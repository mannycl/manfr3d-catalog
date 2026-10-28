import React from 'react';
import { whatsappUrl } from '../lib/whatsapp';

type Props = { product: { name: string; code: string; base_price: number | null }; color?: string; quantity?: number; notes?: string };

export default function QuoteButton({ product, color = 'A elección', quantity = 1, notes = '' }: Props) {
  const price = product.base_price == null ? 'A cotizar' : `Desde $${product.base_price.toLocaleString('es-CL')}`;
  const message = [
    'Hola, quisiera cotizar un producto de Manfr3d.cl.',
    '',
    `Producto: ${product.name}`,
    `Código: ${product.code}`,
    `Precio publicado: ${price}`,
    `Color: ${color}`,
    `Cantidad: ${quantity}`,
    `Personalización: ${notes.trim() || 'Sin especificar'}`,
    '',
    '¿Me pueden confirmar el precio final y el plazo de entrega?'
  ].join('\n');
  const href = whatsappUrl(message);
  return <a className="quote-button" href={href} target="_blank" rel="noopener noreferrer" onClick={(e) => { if (href === '#') { e.preventDefault(); alert('Configura PUBLIC_WHATSAPP_NUMBER en el archivo .env.'); } }}>
    Consultar por WhatsApp <span aria-hidden="true">↗</span>
    <style>{`.quote-button{display:inline-flex;align-items:center;justify-content:center;gap:10px;background:#263126;color:white;padding:14px 19px;border-radius:999px;font-weight:600;font-size:.92rem;transition:transform .2s,background .2s}.quote-button:hover{background:#405640;transform:translateY(-1px)}`}</style>
  </a>;
}
