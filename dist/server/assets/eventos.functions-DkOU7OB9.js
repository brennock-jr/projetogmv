import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { getStore } from "@netlify/blobs";
import { r as requireAuthMiddleware, a as requireRoleMiddleware } from "./identity-DkpMdGlM.js";
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
const getEventos_createServerFn_handler = createServerRpc({
  id: "1fef2a64a1f0450efed5dc893e302d803b54c02fd3d5ab0825ebfa54b41037d6",
  name: "getEventos",
  filename: "src/server/eventos.functions.ts"
}, (opts) => getEventos.__executeServer(opts));
const getEventos = createServerFn({
  method: "GET"
}).middleware([requireAuthMiddleware]).handler(getEventos_createServerFn_handler, async () => {
  const store = getStore({
    name: "gmv-eventos",
    consistency: "strong"
  });
  const {
    blobs
  } = await store.list();
  if (!blobs.length) return [];
  const results = await Promise.all(blobs.map((b) => store.get(b.key, {
    type: "json"
  })));
  return results.filter(Boolean).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
});
const getEvento_createServerFn_handler = createServerRpc({
  id: "b5a99b1b9f88f7e924785b6c161f57cfaf4bffd9b553456390107c2bb5318157",
  name: "getEvento",
  filename: "src/server/eventos.functions.ts"
}, (opts) => getEvento.__executeServer(opts));
const getEvento = createServerFn({
  method: "GET"
}).middleware([requireAuthMiddleware]).inputValidator((data) => data).handler(getEvento_createServerFn_handler, async ({
  data
}) => {
  const store = getStore({
    name: "gmv-eventos",
    consistency: "strong"
  });
  return store.get(data.id, {
    type: "json"
  });
});
const criarEvento_createServerFn_handler = createServerRpc({
  id: "fb57b54cfa8a0140f25e61c2ef87556814103581b469fd88b5f26e70df46f6c7",
  name: "criarEvento",
  filename: "src/server/eventos.functions.ts"
}, (opts) => criarEvento.__executeServer(opts));
const criarEvento = createServerFn({
  method: "POST"
}).middleware([requireRoleMiddleware("chefia")]).inputValidator((data) => data).handler(criarEvento_createServerFn_handler, async ({
  data,
  context
}) => {
  const store = getStore({
    name: "gmv-eventos",
    consistency: "strong"
  });
  const id = crypto.randomUUID();
  const evento = {
    id,
    titulo: data.titulo,
    descricao: data.descricao,
    categoria: data.categoria,
    data: data.data,
    local: data.local,
    vagas: data.vagas,
    criadorId: context.user.id,
    criadoEm: (/* @__PURE__ */ new Date()).toISOString()
  };
  await store.setJSON(id, evento);
  return evento;
});
const deletarEvento_createServerFn_handler = createServerRpc({
  id: "664b54311a3750dba0961fa9d12f661d1670f59a2c7228c078b80a8df6ae3a7d",
  name: "deletarEvento",
  filename: "src/server/eventos.functions.ts"
}, (opts) => deletarEvento.__executeServer(opts));
const deletarEvento = createServerFn({
  method: "POST"
}).middleware([requireRoleMiddleware("chefia")]).inputValidator((data) => data).handler(deletarEvento_createServerFn_handler, async ({
  data
}) => {
  const store = getStore({
    name: "gmv-eventos",
    consistency: "strong"
  });
  await store.delete(data.id);
  return {
    sucesso: true
  };
});
export {
  criarEvento_createServerFn_handler,
  deletarEvento_createServerFn_handler,
  getEvento_createServerFn_handler,
  getEventos_createServerFn_handler
};
