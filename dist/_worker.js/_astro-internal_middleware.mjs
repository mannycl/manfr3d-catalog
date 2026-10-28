globalThis.process ??= {}; globalThis.process.env ??= {};
import './chunks/astro-designed-error-pages_BGD0CMA2.mjs';
import './chunks/astro/server_BK8TKggP.mjs';
import { s as sequence } from './chunks/render-context_CzKKHCFx.mjs';

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env
    };
  }
  return next();
};

const onRequest = sequence(
	onRequest$1,
	
	
);

export { onRequest };
