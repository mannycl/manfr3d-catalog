-- Manfr3d.cl catalog V1
create extension if not exists pgcrypto;

create type public.user_role as enum ('admin', 'editor');
create type public.product_status as enum ('draft', 'published', 'archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'editor',
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'editor')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  code text not null unique,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  base_price integer check (base_price is null or base_price >= 0),
  price_label text,
  currency char(3) not null default 'CLP',
  material text,
  dimensions text,
  is_customizable boolean not null default false,
  status public.product_status not null default 'draft',
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  storage_path text,
  alt_text text,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  options text[] not null default '{}',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Private provenance/licensing record. Never expose this table to anonymous users.
create table public.licenses (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  creator_name text,
  source_url text,
  license_name text,
  commercial_printing_allowed boolean not null default false,
  image_usage_allowed boolean not null default false,
  permission_notes text,
  evidence_url text,
  checked_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_status_created_idx on public.products(status, created_at desc);
create index products_category_status_idx on public.products(category_id, status);
create index product_images_product_sort_idx on public.product_images(product_id, sort_order);
create index product_variants_product_active_idx on public.product_variants(product_id, is_active);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger categories_updated_at before update on public.categories
for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products
for each row execute function public.set_updated_at();
create trigger licenses_updated_at before update on public.licenses
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.licenses enable row level security;

-- Profiles: users can see/update their own profile except role cannot be changed by self.
create policy "Users can read own profile" on public.profiles
for select to authenticated using (id = (select auth.uid()) or public.is_admin());
create policy "Admins can update profiles" on public.profiles
for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Public read of active categories. Admins can manage all categories.
create policy "Public read active categories" on public.categories
for select to anon, authenticated using (is_active or public.is_admin());
create policy "Admins manage categories" on public.categories
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Public can read only published products. Admins can manage all products.
create policy "Public read published products" on public.products
for select to anon, authenticated using (status = 'published' or public.is_admin());
create policy "Admins manage products" on public.products
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Images and variants are readable only if their parent product is published, unless admin.
create policy "Public read images of published products" on public.product_images
for select to anon, authenticated using (
  exists (select 1 from public.products p where p.id = product_id and p.status = 'published')
  or public.is_admin()
);
create policy "Admins manage product images" on public.product_images
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Public read variants of published products" on public.product_variants
for select to anon, authenticated using (
  is_active and exists (select 1 from public.products p where p.id = product_id and p.status = 'published')
  or public.is_admin()
);
create policy "Admins manage product variants" on public.product_variants
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Licensing records are admin-only.
create policy "Admins manage licenses" on public.licenses
for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.categories, public.products, public.product_images, public.product_variants to anon, authenticated;
grant insert, update, delete on public.categories, public.products, public.product_images, public.product_variants to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.licenses to authenticated;

-- Storage bucket: create a PUBLIC bucket named product-images in Supabase Dashboard.
-- Public image URLs can then be rendered in the public catalog.
-- Only authenticated admins can upload/delete images in this bucket.
-- Run after creating the bucket:
--
-- create policy "Public read product images" on storage.objects
-- for select to anon, authenticated using (bucket_id = 'product-images');
-- create policy "Admins upload product images" on storage.objects
-- for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());
-- create policy "Admins update product images" on storage.objects
-- for update to authenticated using (bucket_id = 'product-images' and public.is_admin())
-- with check (bucket_id = 'product-images' and public.is_admin());
-- create policy "Admins delete product images" on storage.objects
-- for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());
