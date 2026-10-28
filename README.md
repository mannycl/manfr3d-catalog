# Manfr3d.cl — Starter V1

Catálogo de impresión 3D con Astro + TypeScript + React + Supabase y cotización por WhatsApp. Configurado para despliegue en Cloudflare Pages con adaptador Astro.

## Requisitos
- Node.js LTS
- Cuenta Supabase
- Cuenta GitHub (opcional pero recomendado)
- Número de WhatsApp Business en formato internacional, solo dígitos para `WHATSAPP_NUMBER`

## 1. Instalar
```bash
npm install
cp .env.example .env
npm run dev
```
En Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

## 2. Crear Supabase
1. Crea un proyecto en https://supabase.com/
2. Abre SQL Editor y ejecuta `supabase/migrations/0001_initial_schema.sql`.
3. En Authentication, crea un usuario para ti.
4. En Storage, crea un bucket público llamado `product-images`.
5. Configura las políticas de Storage usando la sección comentada al final del SQL (ajusta el nombre del bucket si lo cambias).
6. Copia Project URL y anon/publishable key a `.env`.

Variables:
- `PUBLIC_SUPABASE_URL`: Project URL
- `PUBLIC_SUPABASE_ANON_KEY`: anon/publishable key; es pública y está protegida por RLS
- `PUBLIC_WHATSAPP_NUMBER`: número en formato internacional, sin `+`, espacios ni guiones; ejemplo `56912345678`

**Nunca coloques una `service_role` / secret key en variables `PUBLIC_*` ni en el navegador.**

## 3. Dar acceso de administrador
El SQL crea `profiles` y una función para que el perfil se cree al registrar usuario, pero por seguridad el usuario nuevo no recibe rol de administrador.
Después de crear tu usuario en Authentication, ejecuta en SQL Editor:
```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'TU_CORREO'
);
```
Reemplaza `TU_CORREO`. No publiques ni compartas credenciales.

## 4. Datos de prueba
Después de promover tu usuario a admin, inserta una categoría:
```sql
insert into public.categories (name, slug, description, is_active, sort_order)
values ('Hogar y decoración', 'hogar-decoracion', 'Objetos útiles y decorativos impresos en 3D.', true, 1)
on conflict (slug) do nothing;
```
Puedes crear productos desde el panel `/admin`. Para que aparezcan en el sitio público, márcalos como publicados.

## 5. Ejecutar y probar
```bash
npm run dev
```
- Catálogo: http://localhost:4321/
- Panel: http://localhost:4321/admin
- Inicio de sesión: http://localhost:4321/admin/login

El panel usa autenticación en cliente y las tablas usan RLS; para una producción reforzada, añade middleware/guard de servidor o una ruta server-side para proteger también la respuesta HTML de las páginas privadas. RLS protege los datos, pero no sustituye la protección de rutas.


## 6. Despliegue en Cloudflare Pages
1. Sube el proyecto a un repositorio GitHub.
2. En Cloudflare Pages, conecta el repositorio.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Añade `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY` y `PUBLIC_WHATSAPP_NUMBER` en las variables de entorno de producción.
6. Despliega y prueba catálogo, inicio de sesión y cotización.

Como el catálogo consulta Supabase en tiempo de solicitud, el proyecto usa el adaptador `@astrojs/cloudflare` y `output: 'server'`.
