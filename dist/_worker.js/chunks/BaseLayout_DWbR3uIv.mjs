globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, g as addAttribute, n as renderHead, o as renderSlot, r as renderTemplate, h as createAstro } from './astro/server_BK8TKggP.mjs';
/* empty css                         */

const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title = "Manfr3d.cl | Impresi\xF3n 3D", description = "Objetos impresos en 3D, accesorios funcionales y productos personalizados." } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description"${addAttribute(description, "content")}><meta name="theme-color" content="#f7f7f2"><title>${title}</title>${renderHead()}</head> <body> <header class="site-header"> <a class="brand" href="/" aria-label="Manfr3d inicio">manfr<span>3</span>d<span class="brand-dot">.</span></a> <nav aria-label="Navegación principal"> <a href="/#catalogo">Catálogo</a> <a href="/#como-funciona">Cómo funciona</a> <a class="nav-cta" href="/#catalogo">Cotizar producto <span aria-hidden="true">↗</span></a> </nav> </header> <main>${renderSlot($$result, $$slots["default"])}</main> <footer class="site-footer"> <a class="brand" href="/">manfr<span>3</span>d<span class="brand-dot">.</span></a> <p>Ideas que toman forma. Impresión 3D bajo pedido.</p> <small>© ${(/* @__PURE__ */ new Date()).getFullYear()} Manfr3d.cl</small> </footer> </body></html>`;
}, "C:/Users/Manfr/OneDrive/Desktop/Proyecto web 3d/manfr3d-starter/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
