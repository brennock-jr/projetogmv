import { getUser } from "@netlify/identity";
var createMiddleware = (options, __opts) => {
  const resolvedOptions = {
    type: "request",
    ...__opts || options
  };
  return {
    options: resolvedOptions,
    middleware: (middleware) => {
      return createMiddleware({}, Object.assign(resolvedOptions, { middleware }));
    },
    inputValidator: (inputValidator) => {
      return createMiddleware({}, Object.assign(resolvedOptions, { inputValidator }));
    },
    client: (client) => {
      return createMiddleware({}, Object.assign(resolvedOptions, { client }));
    },
    server: (server) => {
      return createMiddleware({}, Object.assign(resolvedOptions, { server }));
    }
  };
};
createMiddleware().server(async ({ next }) => {
  const user = await getUser() ?? null;
  return next({ context: { user } });
});
const requireAuthMiddleware = createMiddleware().server(async ({ next }) => {
  const user = await getUser();
  if (!user) throw new Error("Autenticação necessária");
  return next({ context: { user } });
});
function requireRoleMiddleware(role) {
  return createMiddleware().server(async ({ next }) => {
    const user = await getUser();
    if (!user) throw new Error("Autenticação necessária");
    if (!user.roles?.includes(role)) throw new Error(`Papel '${role}' necessário`);
    return next({ context: { user } });
  });
}
export {
  requireRoleMiddleware as a,
  requireAuthMiddleware as r
};
