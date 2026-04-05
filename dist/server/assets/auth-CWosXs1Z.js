import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { getUser } from "@netlify/identity";
import { c as createServerFn } from "../server.js";
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
const getServerUser_createServerFn_handler = createServerRpc({
  id: "49106938b52c8bf2e7795ac418917757130e43844a341613882f98c174227919",
  name: "getServerUser",
  filename: "src/lib/auth.ts"
}, (opts) => getServerUser.__executeServer(opts));
const getServerUser = createServerFn({
  method: "GET"
}).handler(getServerUser_createServerFn_handler, async () => {
  const user = await getUser();
  return user ?? null;
});
export {
  getServerUser_createServerFn_handler
};
