import React, { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';

type Category = { id: string; name: string; slug: string };
type Product = { 
  id: string; 
  name: string; 
  slug: string; 
  code: string; 
  short_description: string | null; 
  description: string | null; 
  base_price: number | null; 
  price_label: string | null; 
  category_id: string | null; 
  status: 'draft'|'published'|'archived'; 
  material: string | null; 
  dimensions: string | null; 
  is_customizable: boolean; 
};

const empty: Partial<Product> = { 
  name:'', slug:'', code:'', short_description:'', description:'', 
  base_price:null, price_label:'', category_id:'', status:'draft', 
  material:'PLA', dimensions:'', is_customizable:false 
};

const slugify = (s:string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

export default function AdminApp() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('Iniciando comprobación...');
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Partial<Product>|null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState('');

  async function load() {
    setLoading(true);
    try {
      const sb = getSupabase();
      
      setStep('1. Verificando autenticación de usuario...');
      const { data: { user: current }, error: authError } = await sb.auth.getUser();
      if (authError) throw authError;
      
      setUser(current);
      if (!current) { 
        window.location.href = '/admin/login'; 
        return; 
      }

      setStep('2. Verificando rol en la tabla profiles...');
      const { data: profile, error: profileError } = await sb
        .from('profiles')
        .select('role')
        .eq('id', current.id)
        .maybeSingle();

      if (profileError) console.warn('Aviso en perfil:', profileError.message);

      // Si no existe perfil o el rol no es admin
      if (!profile || profile.role !== 'admin') { 
        setIsAdmin(false); 
        setMessage(`Acceso denegado. Tu usuario (${current.email}) no tiene el rol 'admin' en la tabla 'profiles'.`); 
        setLoading(false); 
        return; 
      }

      setIsAdmin(true);

      setStep('3. Cargando categorías y productos desde Supabase...');
      const [{data:cats, error:catError}, {data:prods, error:prodError}] = await Promise.all([
        sb.from('categories').select('id,name,slug').order('sort_order'),
        sb.from('products').select('*').order('created_at', {ascending:false})
      ]);

      if (catError) throw new Error(`Error en categorías: ${catError.message}`);
      if (prodError) throw new Error(`Error en productos: ${prodError.message}`);

      setCategories(cats ?? []); 
      setProducts(prods ?? []);
    } catch(e: any) { 
      console.error('Error durante la carga:', e);
      setMessage(e?.message || 'Error desconocido al cargar el panel.'); 
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault(); 
    if(!editing) return; 
    setBusy(true); 
    setMessage('');

    try {
      const sb = getSupabase();
      const name = String(editing.name ?? '').trim();
      const code = String(editing.code ?? '').trim().toUpperCase();
      
      if(!name || !code) throw new Error('Nombre y código son obligatorios.');

      const payload = {
        name, code, 
        slug: String(editing.slug || slugify(name)), 
        short_description: editing.short_description || null,
        description: editing.description || null, 
        base_price: editing.base_price === null || editing.base_price === undefined || editing.base_price === '' as any ? null : Number(editing.base_price),
        price_label: editing.price_label || null, 
        category_id: editing.category_id || null, 
        status: editing.status || 'draft',
        material: editing.material || null, 
        dimensions: editing.dimensions || null, 
        is_customizable: Boolean(editing.is_customizable)
      };

      let productId = editing.id;
      if(productId) {
        const {error} = await sb.from('products').update(payload).eq('id', productId);
        if(error) throw error;
      } else {
        const {data, error} = await sb.from('products').insert(payload).select('id').single();
        if(error) throw error; 
        productId = data.id;
      }

      if(imageFile && productId) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${productId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await sb.storage
          .from('product-images')
          .upload(fileName, imageFile, { upsert: true });

        if (uploadError) throw new Error(`Error al subir imagen: ${uploadError.message}`);

        const { data: { publicUrl } } = sb.storage
          .from('product-images')
          .getPublicUrl(fileName);

        const { error: imgTableError } = await sb.from('product_images').insert({
          product_id: productId,
          image_url: publicUrl,
          alt_text: name,
          is_primary: true,
          sort_order: 0
        });

        if (imgTableError) throw imgTableError;
      }

      setMessage('Producto guardado con éxito.'); 
      setEditing(null); 
      setImageFile(null); 
      await load();
    } catch(e: any) { 
      setMessage(e?.message || 'No se pudo guardar.'); 
    }
    setBusy(false);
  }

  async function archive(p: Product) {
    if(!confirm(`¿Archivar "${p.name}"?`)) return;
    const {error} = await getSupabase().from('products').update({status:'archived'}).eq('id', p.id);
    if(error) setMessage(error.message); 
    else { setMessage('Producto archivado.'); await load(); }
  }

  async function logout() { 
    await getSupabase().auth.signOut(); 
    window.location.href='/admin/login'; 
  }

  if (loading) {
    return (
      <div className="state">
        <p><strong>Cargando panel…</strong></p>
        <p style={{ fontSize: '0.85rem', color: '#666' }}>{step}</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="state">
        <h2>Acceso Restringido</h2>
        <p>{message}</p>
        <button onClick={logout}>Cerrar sesión</button>
      </div>
    );
  }

  const visible = products.filter(p => `${p.name} ${p.code}`.toLowerCase().includes(filter.toLowerCase()));
  const update = (key: keyof Product, value: any) => setEditing(v => v ? ({...v, [key]: value, ...(key === 'name' && !v.id ? {slug: slugify(String(value))} : {})}) : v);

  return (
    <div className="admin-app">
      <div className="toolbar">
        <div><strong>{products.length}</strong><span> productos registrados</span></div>
        <div className="toolbar-actions">
          <button className="secondary" onClick={logout}>Cerrar sesión</button>
          <button onClick={() => { setEditing({...empty}); setImageFile(null); setMessage(''); }}>+ Nuevo producto</button>
        </div>
      </div>

      {message && <p className="message" role="status">{message}</p>}

      {editing && (
        <form className="editor" onSubmit={save}>
          <div className="editor-heading">
            <h2>{editing.id ? 'Editar producto' : 'Nuevo producto'}</h2>
            <button type="button" className="secondary" onClick={() => setEditing(null)}>Cancelar</button>
          </div>

          <div className="fields">
            <label>Nombre *<input required value={editing.name ?? ''} onChange={e=>update('name', e.target.value)} /></label>
            <label>Código *<input required value={editing.code ?? ''} placeholder="HOG-001" onChange={e=>update('code', e.target.value)} /></label>
            <label>URL (slug)<input value={editing.slug ?? ''} onChange={e=>update('slug', e.target.value)} /></label>
            <label>Categoría
              <select value={editing.category_id ?? ''} onChange={e=>update('category_id', e.target.value)}>
                <option value="">Sin categoría</option>
                {categories.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label>Precio base (CLP)<input type="number" min="0" step="1" value={editing.base_price ?? ''} onChange={e=>update('base_price', e.target.value === '' ? null : Number(e.target.value))} /></label>
            <label>Etiqueta de precio<input value={editing.price_label ?? ''} placeholder="Desde $4.990" onChange={e=>update('price_label', e.target.value)} /></label>
            <label>Material<input value={editing.material ?? ''} onChange={e=>update('material', e.target.value)} /></label>
            <label>Dimensiones<input value={editing.dimensions ?? ''} placeholder="12 × 8 × 6 cm" onChange={e=>update('dimensions', e.target.value)} /></label>
            <label>Estado
              <select value={editing.status ?? 'draft'} onChange={e=>update('status', e.target.value as Product['status'])}>
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="archived">Archivado</option>
              </select>
            </label>
            <label className="checkbox">
              <input type="checkbox" checked={Boolean(editing.is_customizable)} onChange={e=>update('is_customizable', e.target.checked)} /> Permite personalización
            </label>
            <label className="wide">Descripción breve<textarea rows={2} value={editing.short_description ?? ''} onChange={e=>update('short_description', e.target.value)} /></label>
            <label className="wide">Descripción completa<textarea rows={4} value={editing.description ?? ''} onChange={e=>update('description', e.target.value)} /></label>
            
            <label className="wide">
              Imagen del producto
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => setImageFile(e.target.files?.[0] || null)} 
              />
              <small>Sube una imagen desde tu dispositivo. Se guardará directamente en el almacenamiento de Supabase.</small>
            </label>
          </div>

          <button type="submit" disabled={busy}>{busy ? 'Guardando…' : 'Guardar producto'}</button>
        </form>
      )}

      <div className="list-head">
        <h2>Productos</h2>
        <input aria-label="Buscar producto" placeholder="Buscar por nombre o código…" value={filter} onChange={e=>setFilter(e.target.value)} />
      </div>

      {visible.length === 0 ? (
        <div className="state">Todavía no hay productos. Crea el primero con “Nuevo producto”.</div>
      ) : (
        <div className="product-list">
          {visible.map(p => (
            <article className="product-row" key={p.id}>
              <div className="product-main">
                <strong>{p.name}</strong>
                <span>{p.code} · {p.slug}</span>
              </div>
              <span className={`status ${p.status}`}>{p.status==='published'?'Publicado':p.status==='draft'?'Borrador':'Archivado'}</span>
              <span className="price">{p.base_price == null ? 'A cotizar' : `Desde $${p.base_price.toLocaleString('es-CL')}`}</span>
              <div className="row-actions">
                <button className="secondary" onClick={() => { setEditing({...p}); setImageFile(null); setMessage(''); }}>Editar</button>
                <button className="secondary" onClick={() => void archive(p)} disabled={p.status==='archived'}>Archivar</button>
                <a href={`/productos/${p.slug}`} target="_blank" rel="noreferrer">Ver ↗</a>
              </div>
            </article>
          ))}
        </div>
      )}

      <style>{`.admin-app{color:#252b23}.toolbar{display:flex;justify-content:space-between;align-items:center;gap:15px;padding:18px;background:#fff;border:1px solid #e4e7de;border-radius:10px}.toolbar span{color:#73796f;font-size:.9rem}.toolbar-actions,.row-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.admin-app button{border:0;border-radius:999px;padding:11px 15px;background:#263126;color:#fff;cursor:pointer;font-weight:600;font-size:.82rem}.admin-app button:disabled{opacity:.5;cursor:wait}.admin-app button.secondary{background:#eef0e9;color:#3d4639}.message{background:#e7eddf;color:#42583b;padding:13px;border-radius:8px}.editor{margin:22px 0;padding:22px;background:#fff;border:1px solid #e3e6dc;border-radius:12px}.editor-heading,.list-head{display:flex;justify-content:space-between;align-items:center;gap:15px}.editor h2,.list-head h2{font-family:Manrope,sans-serif;letter-spacing:-.04em}.fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px;margin:20px 0}.fields label{display:grid;gap:7px;font-size:.82rem;font-weight:600}.fields input,.fields select,.fields textarea,.list-head input{width:100%;min-width:0;padding:11px;border:1px solid #dfe2d8;border-radius:7px;background:#fbfcf8;color:#252b23}.fields .wide{grid-column:1/-1}.fields label.checkbox{display:flex;align-items:center;gap:9px}.fields label.checkbox input{width:auto}.fields small{color:#7a8076;font-weight:400;line-height:1.5}.list-head{margin:30px 0 12px}.list-head input{max-width:320px}.product-list{background:#fff;border:1px solid #e4e7de;border-radius:10px;overflow:hidden}.product-row{display:grid;grid-template-columns:minmax(140px,1.4fr) auto auto auto;align-items:center;gap:18px;padding:16px;border-bottom:1px solid #eceee7}.product-row:last-child{border-bottom:0}.product-main{display:grid;gap:5px}.product-main span{font-size:.75rem;color:#7b8177}.status{font-size:.72rem;border-radius:999px;padding:6px 9px;background:#f1f1ec;white-space:nowrap}.status.published{background:#e5efdf;color:#42643a}.status.draft{background:#fff0d4;color:#876522}.status.archived{background:#eee;color:#777}.price{font-size:.82rem;white-space:nowrap}.row-actions a{font-size:.8rem;font-weight:600;white-space:nowrap}.state{padding:35px 20px;text-align:center;background:#fff;border:1px solid #e4e7de;border-radius:10px;color:#74796f}.state button{border:0;border-radius:999px;background:#263126;color:white;padding:10px 15px}@media(max-width:850px){.product-row{grid-template-columns:1fr auto}.product-row .price{grid-column:1}.row-actions{grid-column:1/-1}.fields{grid-template-columns:1fr}}@media(max-width:540px){.toolbar{align-items:flex-start;flex-direction:column}.list-head{align-items:flex-start;flex-direction:column}.list-head input{max-width:none}.product-row{gap:10px}.status{justify-self:start}}`}</style>
    </div>
  );
}