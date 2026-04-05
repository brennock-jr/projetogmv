import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { getStore } from "@netlify/blobs";
import { a as requireRoleMiddleware } from "./identity-DkpMdGlM.js";
import { c as createServerFn } from "../server.js";
import "@netlify/identity";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
const getUsuarios_createServerFn_handler = createServerRpc({
  id: "53265775e8a89bfff77f41a66a900333b60ab1966c927d1dea57c38db6ffc82c",
  name: "getUsuarios",
  filename: "src/server/usuarios.functions.ts"
}, (opts) => getUsuarios.__executeServer(opts));
const getUsuarios = createServerFn({
  method: "GET"
}).middleware([requireRoleMiddleware("chefia")]).handler(getUsuarios_createServerFn_handler, async () => {
  const store = getStore({
    name: "gmv-usuarios",
    consistency: "strong"
  });
  const {
    blobs
  } = await store.list();
  if (!blobs.length) return [];
  const results = await Promise.all(blobs.map((b) => store.get(b.key, {
    type: "json"
  })));
  return results.filter(Boolean).sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
});
export {
  getUsuarios_createServerFn_handler
};
