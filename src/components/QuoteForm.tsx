import React, { useState } from 'react';
import { whatsappUrl } from '../lib/whatsapp';

type Variant = { id: string; name: string; options: string[] };
type Product = { name: string; code: string; base_price: number | null; variants: Variant[] };
export default function QuoteForm({ product }: { product: Product }) {
  const [color, setColor] = useState('A elección');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [selected, setSelected] = useState<Record<string,string>>({});
  const activeVariants = product.variants.filter(v => v.options?.length);
  const optionsText = activeVariants.map(v => `${v.name}: ${selected[v.id] || 'Sin elegir'}`).join('; ');
  const message = [
    'Hola, quisiera cotizar un producto de Manfr3d.cl.',
    '',
    `Producto: ${product.name}`,
    `Código: ${product.code}`,
    `Precio base publicado: ${product.base_price == null ? 'A cotizar' : `Desde $${product.base_price.toLocaleString('es-CL')}`}`,
    `Color: ${color}`,
    ...(activeVariants.length ? [`Opciones: ${optionsText}`] : []),
    `Cantidad: ${quantity}`,
    `Personalización/comentarios: ${notes.trim() || 'Sin especificar'}`,
    '',
    '¿Me pueden confirmar el precio final y el plazo de entrega?'
  ].join('\n');
  const href = whatsappUrl(message);
  return <form className="quote-form" onSubmit={e => {e.preventDefault(); if (href === '#') { alert('Configura PUBLIC_WHATSAPP_NUMBER en .env.'); return; } window.open(href,'_blank','noopener,noreferrer');}}>
    <label>Color
      <select value={color} onChange={e=>setColor(e.target.value)}>
        <option>A elección</option><option>Negro</option><option>Blanco</option><option>Gris</option><option>Verde</option><option>Otro color (consultar)</option>
      </select>
    </label>
    {activeVariants.map(v => <label key={v.id}>{v.name}
      <select value={selected[v.id] || ''} onChange={e=>setSelected(s=>({...s,[v.id]:e.target.value}))}>
        <option value="">Seleccionar…</option>{v.options.map(o=><option key={o}>{o}</option>)}
      </select>
    </label>)}
    <label>Cantidad
      <input type="number" min="1" max="100" value={quantity} onChange={e=>setQuantity(Math.max(1,Math.min(100,Number(e.target.value)||1)))}/>
    </label>
    <label>Personalización o comentarios
      <textarea rows={3} maxLength={500} placeholder="Nombre, medidas, idea especial..." value={notes} onChange={e=>setNotes(e.target.value)} />
    </label>
    <button type="submit">Consultar por WhatsApp ↗</button>
    <style>{`.quote-form{display:grid;gap:15px;margin-top:25px}.quote-form label{display:grid;gap:7px;font-size:.84rem;font-weight:600}.quote-form select,.quote-form input,.quote-form textarea{width:100%;border:1px solid #dfe2d8;background:#fff;border-radius:8px;padding:12px;color:#283026;outline-color:#7d9873}.quote-form button{border:0;border-radius:999px;background:#263126;color:#fff;padding:15px 20px;font-weight:700;cursor:pointer}.quote-form button:hover{background:#405640}`}</style>
  </form>;
}
