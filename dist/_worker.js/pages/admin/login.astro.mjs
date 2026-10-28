globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BK8TKggP.mjs';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_DWbR3uIv.mjs';
/* empty css                                    */
export { r as renderers } from '../../chunks/_@astro-renderers_Be5W017m.mjs';

const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Acceso administrador | Manfr3d.cl", "data-astro-cid-rf56lckb": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="login-page" data-astro-cid-rf56lckb><div class="login-card" data-astro-cid-rf56lckb><p class="eyebrow" data-astro-cid-rf56lckb>MANFR3D / ADMIN</p><h1 data-astro-cid-rf56lckb>Tu catálogo,<br data-astro-cid-rf56lckb><em data-astro-cid-rf56lckb>bajo control.</em></h1><p class="sub" data-astro-cid-rf56lckb>Ingresa con el usuario autorizado para administrar productos y publicaciones.</p><form id="login-form" data-astro-cid-rf56lckb><label data-astro-cid-rf56lckb>Correo electrónico<input id="email" type="email" required autocomplete="username" data-astro-cid-rf56lckb></label><label data-astro-cid-rf56lckb>Contraseña<input id="password" type="password" required autocomplete="current-password" data-astro-cid-rf56lckb></label><button type="submit" data-astro-cid-rf56lckb>Iniciar sesión ↗</button><p id="error" role="status" data-astro-cid-rf56lckb></p></form><a class="back" href="/" data-astro-cid-rf56lckb>← Volver a la web</a></div></main> ` })} ${renderScript($$result, "C:/Users/Manfr/OneDrive/Desktop/Proyecto web 3d/manfr3d-starter/src/pages/admin/login.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/Manfr/OneDrive/Desktop/Proyecto web 3d/manfr3d-starter/src/pages/admin/login.astro", void 0);

const $$file = "C:/Users/Manfr/OneDrive/Desktop/Proyecto web 3d/manfr3d-starter/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
