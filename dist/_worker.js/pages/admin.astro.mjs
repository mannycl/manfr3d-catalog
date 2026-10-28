globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BK8TKggP.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DWbR3uIv.mjs';
/* empty css                                 */
export { r as renderers } from '../chunks/_@astro-renderers_Be5W017m.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Administrar cat\xE1logo | Manfr3d.cl", "data-astro-cid-u2h3djql": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="admin-page" data-astro-cid-u2h3djql> <div class="admin-top" data-astro-cid-u2h3djql> <div data-astro-cid-u2h3djql> <p class="eyebrow" data-astro-cid-u2h3djql>MANFR3D / ADMINISTRACIÓN</p> <h1 data-astro-cid-u2h3djql>Catálogo de productos</h1> <p data-astro-cid-u2h3djql>Gestiona lo que tus clientes pueden descubrir.</p> </div> <a href="/" class="site-link" data-astro-cid-u2h3djql>Ver web ↗</a> </div> <!-- Renderizamos directamente el componente React aquí --> ${renderComponent($$result2, "AdminApp", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-u2h3djql": true, "client:component-path": "C:/Users/Manfr/OneDrive/Desktop/Proyecto web 3d/manfr3d-starter/src/components/AdminApp", "client:component-export": "default" })} </section> ` })} `;
}, "C:/Users/Manfr/OneDrive/Desktop/Proyecto web 3d/manfr3d-starter/src/pages/admin/index.astro", void 0);

const $$file = "C:/Users/Manfr/OneDrive/Desktop/Proyecto web 3d/manfr3d-starter/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
