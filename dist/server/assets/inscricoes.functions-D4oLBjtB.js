import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { getStore } from "@netlify/blobs";
import { r as requireAuthMiddleware } from "./identity-DkpMdGlM.js";
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
const getInscricoesEvento_createServerFn_handler = createServerRpc({
  id: "c39fb075a8e9b733ebffc5360e427596f193489cd4318666c1e622659c26007b",
  name: "getInscricoesEvento",
  filename: "src/server/inscricoes.functions.ts"
}, (opts) => getInscricoesEvento.__executeServer(opts));
const getInscricoesEvento = createServerFn({
  method: "GET"
}).middleware([requireAuthMiddleware]).inputValidator((data) => data).handler(getInscricoesEvento_createServerFn_handler, async ({
  data
}) => {
  const store = getStore({
    name: "gmv-inscricoes",
    consistency: "strong"
  });
  const {
    blobs
  } = await store.list({
    prefix: `${data.eventoId}/`
  });
  if (!blobs.length) return [];
  const results = await Promise.all(blobs.map((b) => store.get(b.key, {
    type: "json"
  })));
  return results.filter(Boolean);
});
const getMinhasInscricoes_createServerFn_handler = createServerRpc({
  id: "13b60cab3f34bbccbf61735be3a4ea41c800fb9757158d336a00d1d6cc23df21",
  name: "getMinhasInscricoes",
  filename: "src/server/inscricoes.functions.ts"
}, (opts) => getMinhasInscricoes.__executeServer(opts));
const getMinhasInscricoes = createServerFn({
  method: "GET"
}).middleware([requireAuthMiddleware]).handler(getMinhasInscricoes_createServerFn_handler, async ({
  context
}) => {
  const store = getStore({
    name: "gmv-inscricoes",
    consistency: "strong"
  });
  const {
    blobs
  } = await store.list();
  if (!blobs.length) return [];
  const results = await Promise.all(blobs.map((b) => store.get(b.key, {
    type: "json"
  })));
  return results.filter(Boolean).filter((i) => i.userId === context.user.id);
});
const inscreverUsuario_createServerFn_handler = createServerRpc({
  id: "1850a4886a46bf45bae44a38c8311dc162a737d52c0ae5e85c729fa02bd4fd4f",
  name: "inscreverUsuario",
  filename: "src/server/inscricoes.functions.ts"
}, (opts) => inscreverUsuario.__executeServer(opts));
const inscreverUsuario = createServerFn({
  method: "POST"
}).middleware([requireAuthMiddleware]).inputValidator((data) => data).handler(inscreverUsuario_createServerFn_handler, async ({
  data,
  context
}) => {
  const store = getStore({
    name: "gmv-inscricoes",
    consistency: "strong"
  });
  const key = `${data.eventoId}/${context.user.id}`;
  const existente = await store.get(key);
  if (existente !== null) throw new Error("Você já está inscrito nesta atividade");
  const inscricao = {
    eventoId: data.eventoId,
    userId: context.user.id,
    userEmail: context.user.email,
    userName: context.user.name || context.user.email,
    inscritoEm: (/* @__PURE__ */ new Date()).toISOString()
  };
  await store.setJSON(key, inscricao);
  return inscricao;
});
const cancelarInscricao_createServerFn_handler = createServerRpc({
  id: "aff0db4c44c03b1a3662d9be1790c9bc76b7492a1bd902545eea9c1643e8cc0d",
  name: "cancelarInscricao",
  filename: "src/server/inscricoes.functions.ts"
}, (opts) => cancelarInscricao.__executeServer(opts));
const cancelarInscricao = createServerFn({
  method: "POST"
}).middleware([requireAuthMiddleware]).inputValidator((data) => data).handler(cancelarInscricao_createServerFn_handler, async ({
  data,
  context
}) => {
  const store = getStore({
    name: "gmv-inscricoes",
    consistency: "strong"
  });
  const key = `${data.eventoId}/${context.user.id}`;
  await store.delete(key);
  return {
    sucesso: true
  };
});
const verificarInscricao_createServerFn_handler = createServerRpc({
  id: "98eab8930c0a37a94804f15d7d94f18f47679ffb9bb2e2abca70153d3e975b26",
  name: "verificarInscricao",
  filename: "src/server/inscricoes.functions.ts"
}, (opts) => verificarInscricao.__executeServer(opts));
const verificarInscricao = createServerFn({
  method: "GET"
}).middleware([requireAuthMiddleware]).inputValidator((data) => data).handler(verificarInscricao_createServerFn_handler, async ({
  data,
  context
}) => {
  const store = getStore({
    name: "gmv-inscricoes",
    consistency: "strong"
  });
  const key = `${data.eventoId}/${context.user.id}`;
  const inscricao = await store.get(key);
  return {
    inscrito: inscricao !== null
  };
});
export {
  cancelarInscricao_createServerFn_handler,
  getInscricoesEvento_createServerFn_handler,
  getMinhasInscricoes_createServerFn_handler,
  inscreverUsuario_createServerFn_handler,
  verificarInscricao_createServerFn_handler
};
