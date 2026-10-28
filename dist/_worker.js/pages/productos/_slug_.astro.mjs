globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../chunks/astro/server_BK8TKggP.mjs';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_DWbR3uIv.mjs';
import { a as reactExports } from '../../chunks/_@astro-renderers_Be5W017m.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Be5W017m.mjs';
import { g as getSupabase } from '../../chunks/supabase_DNBNS36f.mjs';
/* empty css                                     */

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production = {};

/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production;

function requireReactJsxRuntime_production () {
	if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
	hasRequiredReactJsxRuntime_production = 1;
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	function jsxProd(type, config, maybeKey) {
	  var key = null;
	  void 0 !== maybeKey && (key = "" + maybeKey);
	  void 0 !== config.key && (key = "" + config.key);
	  if ("key" in config) {
	    maybeKey = {};
	    for (var propName in config)
	      "key" !== propName && (maybeKey[propName] = config[propName]);
	  } else maybeKey = config;
	  config = maybeKey.ref;
	  return {
	    $$typeof: REACT_ELEMENT_TYPE,
	    type: type,
	    key: key,
	    ref: void 0 !== config ? config : null,
	    props: maybeKey
	  };
	}
	reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
	reactJsxRuntime_production.jsx = jsxProd;
	reactJsxRuntime_production.jsxs = jsxProd;
	return reactJsxRuntime_production;
}

var hasRequiredJsxRuntime;

function requireJsxRuntime () {
	if (hasRequiredJsxRuntime) return jsxRuntime.exports;
	hasRequiredJsxRuntime = 1;
	{
	  jsxRuntime.exports = requireReactJsxRuntime_production();
	}
	return jsxRuntime.exports;
}

var jsxRuntimeExports = requireJsxRuntime();

function whatsappUrl(message) {
  const number = "56967795368";
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

function QuoteForm({ product }) {
  const [color, setColor] = reactExports.useState("A elección");
  const [quantity, setQuantity] = reactExports.useState(1);
  const [notes, setNotes] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState({});
  const activeVariants = product.variants.filter((v) => v.options?.length);
  const optionsText = activeVariants.map((v) => `${v.name}: ${selected[v.id] || "Sin elegir"}`).join("; ");
  const message = [
    "Hola, quisiera cotizar un producto de Manfr3d.cl.",
    "",
    `Producto: ${product.name}`,
    `Código: ${product.code}`,
    `Precio base publicado: ${product.base_price == null ? "A cotizar" : `Desde $${product.base_price.toLocaleString("es-CL")}`}`,
    `Color: ${color}`,
    ...activeVariants.length ? [`Opciones: ${optionsText}`] : [],
    `Cantidad: ${quantity}`,
    `Personalización/comentarios: ${notes.trim() || "Sin especificar"}`,
    "",
    "¿Me pueden confirmar el precio final y el plazo de entrega?"
  ].join("\n");
  const href = whatsappUrl(message);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "quote-form", onSubmit: (e) => {
    e.preventDefault();
    if (href === "#") {
      alert("Configura PUBLIC_WHATSAPP_NUMBER en .env.");
      return;
    }
    window.open(href, "_blank", "noopener,noreferrer");
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
      "Color",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: color, onChange: (e) => setColor(e.target.value), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "A elección" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Negro" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Blanco" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Gris" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Verde" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Otro color (consultar)" })
      ] })
    ] }),
    activeVariants.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
      v.name,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: selected[v.id] || "", onChange: (e) => setSelected((s) => ({ ...s, [v.id]: e.target.value })), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Seleccionar…" }),
        v.options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: o }, o))
      ] })
    ] }, v.id)),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
      "Cantidad",
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "1", max: "100", value: quantity, onChange: (e) => setQuantity(Math.max(1, Math.min(100, Number(e.target.value) || 1))) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
      "Personalización o comentarios",
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 3, maxLength: 500, placeholder: "Nombre, medidas, idea especial...", value: notes, onChange: (e) => setNotes(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", children: "Consultar por WhatsApp ↗" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `.quote-form{display:grid;gap:15px;margin-top:25px}.quote-form label{display:grid;gap:7px;font-size:.84rem;font-weight:600}.quote-form select,.quote-form input,.quote-form textarea{width:100%;border:1px solid #dfe2d8;background:#fff;border-radius:8px;padding:12px;color:#283026;outline-color:#7d9873}.quote-form button{border:0;border-radius:999px;background:#263126;color:#fff;padding:15px 20px;font-weight:700;cursor:pointer}.quote-form button:hover{background:#405640}` })
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const slug = Astro2.params.slug;
  let product = null;
  let relatedImages = [];
  let relatedVariants = [];
  let category = null;
  try {
    const sb = getSupabase();
    const { data } = await sb.from("products").select("*, categories(name, slug), product_images(*)").eq("slug", slug).eq("status", "published").maybeSingle();
    product = data;
    if (product) {
      relatedImages = (product.product_images ?? []).sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order);
      const { data: variants } = await sb.from("product_variants").select("*").eq("product_id", product.id).eq("is_active", true).order("sort_order");
      relatedVariants = variants ?? [];
      category = product.categories;
    }
  } catch {
  }
  if (!product) Astro2.response.status = 404;
  const price = product?.base_price == null ? "Consultar precio" : `Desde $${product.base_price.toLocaleString("es-CL")}`;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": product ? `${product.name} | Manfr3d.cl` : "Producto no encontrado | Manfr3d.cl", "description": product?.short_description ?? "Producto impreso en 3D bajo pedido.", "data-astro-cid-gputwutb": true }, { "default": async ($$result2) => renderTemplate`${product ? renderTemplate`${maybeRenderHead()}<section class="detail" data-astro-cid-gputwutb> <a class="back" href="/#catalogo" data-astro-cid-gputwutb>← Volver al catálogo</a> <div class="detail-grid" data-astro-cid-gputwutb> <div class="gallery" data-astro-cid-gputwutb> ${relatedImages.length ? relatedImages.map((img) => renderTemplate`<img${addAttribute(img.image_url, "src")}${addAttribute(img.alt_text || product.name, "alt")} data-astro-cid-gputwutb>`) : renderTemplate`<div class="image-placeholder" data-astro-cid-gputwutb>manfr3d.</div>`} </div> <div class="detail-copy" data-astro-cid-gputwutb> <p class="eyebrow" data-astro-cid-gputwutb>${category?.name ?? "Colecci\xF3n Manfr3d"} · ${product.code}</p> <h1 data-astro-cid-gputwutb>${product.name}</h1> <p class="short" data-astro-cid-gputwutb>${product.short_description}</p> <div class="price" data-astro-cid-gputwutb>${product.price_label || price}</div> ${product.description && renderTemplate`<div class="description" data-astro-cid-gputwutb>${product.description}</div>`} ${product.material && renderTemplate`<p class="meta" data-astro-cid-gputwutb><strong data-astro-cid-gputwutb>Material:</strong> ${product.material}</p>`} ${product.dimensions && renderTemplate`<p class="meta" data-astro-cid-gputwutb><strong data-astro-cid-gputwutb>Dimensiones:</strong> ${product.dimensions}</p>`} ${product.is_customizable ? renderTemplate`<p class="custom-note" data-astro-cid-gputwutb>✳ Este producto permite personalización. Cuéntanos qué tienes en mente.</p>` : null} ${renderComponent($$result2, "QuoteForm", QuoteForm, { "client:load": true, "product": { name: product.name, code: product.code, base_price: product.base_price, variants: relatedVariants }, "client:component-hydration": "load", "client:component-path": "C:/Users/Manfr/OneDrive/Desktop/Proyecto web 3d/manfr3d-starter/src/components/QuoteForm", "client:component-export": "default", "data-astro-cid-gputwutb": true })} <p class="fine-print" data-astro-cid-gputwutb>El precio publicado es orientativo. Confirmaremos el valor final, las opciones disponibles y el plazo antes de fabricar.</p> </div> </div> </section>` : renderTemplate`<section class="not-found" data-astro-cid-gputwutb><h1 data-astro-cid-gputwutb>Producto no encontrado</h1><p data-astro-cid-gputwutb>Puede que ya no esté disponible.</p><a href="/" data-astro-cid-gputwutb>Volver al catálogo</a></section>`}` })} `;
}, "C:/Users/Manfr/OneDrive/Desktop/Proyecto web 3d/manfr3d-starter/src/pages/productos/[slug].astro", void 0);

const $$file = "C:/Users/Manfr/OneDrive/Desktop/Proyecto web 3d/manfr3d-starter/src/pages/productos/[slug].astro";
const $$url = "/productos/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
