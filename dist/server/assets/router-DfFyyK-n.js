import { useNavigate, useLocation, Link, createRootRoute, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, redirect, createRouter } from "@tanstack/react-router";
import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { useState, useEffect, createContext, useContext } from "react";
import { getUser, onAuthChange, logout, handleAuthCallback } from "@netlify/identity";
import { Shield, LogOut, X, Menu } from "lucide-react";
import { T as TSS_SERVER_FUNCTION, g as getServerFnById, c as createServerFn } from "../server.js";
import { r as requireAuthMiddleware, a as requireRoleMiddleware } from "./identity-DkpMdGlM.js";
const IdentityContext = createContext(null);
function IdentityProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    getUser().then((u) => {
      setUser(u ?? null);
      setReady(true);
    });
    const unsubscribe = onAuthChange((u) => {
      setUser(u ?? null);
    });
    return unsubscribe;
  }, []);
  return /* @__PURE__ */ jsx(IdentityContext.Provider, { value: { user, ready, logout }, children });
}
function useIdentity() {
  const ctx = useContext(IdentityContext);
  if (!ctx) throw new Error("useIdentity must be used within an IdentityProvider");
  return ctx;
}
const AUTH_HASH_PATTERN = /^#(confirmation_token|recovery_token|invite_token|email_change_token|access_token)=/;
function CallbackHandler({ children }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (AUTH_HASH_PATTERN.test(window.location.hash)) {
      handleAuthCallback().then((result) => {
        if (!result) return;
        if (result.type === "recovery") {
          sessionStorage.setItem("gmv_recovery_mode", "true");
          navigate({ to: "/dashboard" });
        } else if (result.type === "confirmation" || result.type === "oauth" || result.type === "invite") {
          navigate({ to: "/dashboard" });
        }
      }).catch(console.error);
    }
  }, []);
  return /* @__PURE__ */ jsx(Fragment, { children });
}
function Header() {
  const { user, logout: logout2 } = useIdentity();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isChefia = user?.roles?.includes("chefia");
  const handleLogout = async () => {
    await logout2();
    navigate({ to: "/login" });
  };
  const navLinks = [
    { to: "/dashboard", label: "Painel" },
    { to: "/atividades", label: "Atividades" },
    ...isChefia ? [{ to: "/chefia", label: "Chefia" }] : []
  ];
  return /* @__PURE__ */ jsxs("header", { className: "bg-military-green text-white shadow-lg", children: [
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-16", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/dashboard", className: "flex items-center gap-2 hover:opacity-90", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-military-gold rounded p-1.5", children: /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 text-military-green" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col leading-tight", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-sm tracking-widest text-military-gold uppercase", children: "GMV" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-300 tracking-wider uppercase hidden sm:block", children: "Grupo Militar de Voluntários" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "hidden md:flex items-center gap-1", children: navLinks.map((link) => /* @__PURE__ */ jsx(
        Link,
        {
          to: link.to,
          className: `px-4 py-2 rounded text-sm font-medium uppercase tracking-wider transition-colors ${location.pathname === link.to ? "bg-military-olive text-white" : "text-gray-300 hover:bg-military-olive/50 hover:text-white"}`,
          children: link.label
        },
        link.to
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-3", children: [
        user && /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-white", children: user.name || user.email }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-military-gold uppercase tracking-wider", children: isChefia ? "Chefia" : "Agente" })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleLogout,
            className: "flex items-center gap-1.5 bg-military-olive/60 hover:bg-military-olive px-3 py-1.5 rounded text-sm transition-colors",
            children: [
              /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { className: "hidden lg:inline", children: "Sair" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "md:hidden text-gray-300 hover:text-white",
          onClick: () => setMenuOpen(!menuOpen),
          children: menuOpen ? /* @__PURE__ */ jsx(X, { className: "w-6 h-6" }) : /* @__PURE__ */ jsx(Menu, { className: "w-6 h-6" })
        }
      )
    ] }) }),
    menuOpen && /* @__PURE__ */ jsx("div", { className: "md:hidden bg-military-green border-t border-military-olive/50", children: /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 space-y-1", children: [
      navLinks.map((link) => /* @__PURE__ */ jsx(
        Link,
        {
          to: link.to,
          onClick: () => setMenuOpen(false),
          className: `block px-3 py-2 rounded text-sm font-medium uppercase tracking-wider ${location.pathname === link.to ? "bg-military-olive text-white" : "text-gray-300 hover:bg-military-olive/50 hover:text-white"}`,
          children: link.label
        },
        link.to
      )),
      /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t border-military-olive/50", children: [
        user && /* @__PURE__ */ jsxs("p", { className: "px-3 py-1 text-xs text-military-gold uppercase tracking-wider", children: [
          user.name || user.email,
          " · ",
          isChefia ? "Chefia" : "Agente"
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleLogout,
            className: "w-full text-left px-3 py-2 rounded text-sm text-gray-300 hover:text-white hover:bg-military-olive/50 flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
              "Sair"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
const AUTH_ROUTES = ["/login", "/recuperar-senha"];
const Route$6 = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GMV – Grupo Militar de Voluntários" }
    ]
  }),
  shellComponent: RootDocument,
  component: RootLayout
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "pt-BR", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx(HeadContent, {}),
      /* @__PURE__ */ jsx("link", { rel: "manifest", href: "/manifest.webmanifest" }),
      /* @__PURE__ */ jsx("link", { rel: "apple-touch-icon", href: "/icons/icon-192.png" }),
      /* @__PURE__ */ jsx("meta", { name: "theme-color", content: "#0f766e" }),
      /* @__PURE__ */ jsx("meta", { name: "mobile-web-app-capable", content: "yes" }),
      /* @__PURE__ */ jsx("meta", { name: "apple-mobile-web-app-capable", content: "yes" })
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootLayout() {
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => console.error("Service worker registration failed:", error));
    }
  }, []);
  return /* @__PURE__ */ jsx(IdentityProvider, { children: /* @__PURE__ */ jsx(CallbackHandler, { children: /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-parchment", children: [
    !isAuthPage && /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx(Outlet, {})
  ] }) }) });
}
const $$splitComponentImporter$5 = () => import("./login-DlFk9tv8.js");
const Route$5 = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var createSsrRpc = (functionId, importer) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getServerUser = createServerFn({
  method: "GET"
}).handler(createSsrRpc("49106938b52c8bf2e7795ac418917757130e43844a341613882f98c174227919"));
const getEventos = createServerFn({
  method: "GET"
}).middleware([requireAuthMiddleware]).handler(createSsrRpc("1fef2a64a1f0450efed5dc893e302d803b54c02fd3d5ab0825ebfa54b41037d6"));
const getEvento = createServerFn({
  method: "GET"
}).middleware([requireAuthMiddleware]).inputValidator((data) => data).handler(createSsrRpc("b5a99b1b9f88f7e924785b6c161f57cfaf4bffd9b553456390107c2bb5318157"));
const criarEvento = createServerFn({
  method: "POST"
}).middleware([requireRoleMiddleware("chefia")]).inputValidator((data) => data).handler(createSsrRpc("fb57b54cfa8a0140f25e61c2ef87556814103581b469fd88b5f26e70df46f6c7"));
const deletarEvento = createServerFn({
  method: "POST"
}).middleware([requireRoleMiddleware("chefia")]).inputValidator((data) => data).handler(createSsrRpc("664b54311a3750dba0961fa9d12f661d1670f59a2c7228c078b80a8df6ae3a7d"));
const getInscricoesEvento = createServerFn({
  method: "GET"
}).middleware([requireAuthMiddleware]).inputValidator((data) => data).handler(createSsrRpc("c39fb075a8e9b733ebffc5360e427596f193489cd4318666c1e622659c26007b"));
const getMinhasInscricoes = createServerFn({
  method: "GET"
}).middleware([requireAuthMiddleware]).handler(createSsrRpc("13b60cab3f34bbccbf61735be3a4ea41c800fb9757158d336a00d1d6cc23df21"));
const inscreverUsuario = createServerFn({
  method: "POST"
}).middleware([requireAuthMiddleware]).inputValidator((data) => data).handler(createSsrRpc("1850a4886a46bf45bae44a38c8311dc162a737d52c0ae5e85c729fa02bd4fd4f"));
const cancelarInscricao = createServerFn({
  method: "POST"
}).middleware([requireAuthMiddleware]).inputValidator((data) => data).handler(createSsrRpc("aff0db4c44c03b1a3662d9be1790c9bc76b7492a1bd902545eea9c1643e8cc0d"));
const verificarInscricao = createServerFn({
  method: "GET"
}).middleware([requireAuthMiddleware]).inputValidator((data) => data).handler(createSsrRpc("98eab8930c0a37a94804f15d7d94f18f47679ffb9bb2e2abca70153d3e975b26"));
const $$splitComponentImporter$4 = () => import("./dashboard-CblnqSC9.js");
const Route$4 = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const user = await getServerUser();
    if (!user) throw redirect({
      to: "/login"
    });
    return {
      user
    };
  },
  loader: async () => {
    const [eventos, minhasInscricoes] = await Promise.all([getEventos(), getMinhasInscricoes()]);
    return {
      eventos,
      minhasInscricoes
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const getUsuarios = createServerFn({
  method: "GET"
}).middleware([requireRoleMiddleware("chefia")]).handler(createSsrRpc("53265775e8a89bfff77f41a66a900333b60ab1966c927d1dea57c38db6ffc82c"));
const $$splitComponentImporter$3 = () => import("./chefia-BSyfDDoq.js");
const Route$3 = createFileRoute("/chefia")({
  beforeLoad: async () => {
    const user = await getServerUser();
    if (!user) throw redirect({
      to: "/login"
    });
    if (!user.roles?.includes("chefia")) throw redirect({
      to: "/dashboard"
    });
    return {
      user
    };
  },
  loader: async () => {
    const [eventos, usuarios] = await Promise.all([getEventos(), getUsuarios()]);
    return {
      eventos,
      usuarios
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./atividades-DttaVytT.js");
const Route$2 = createFileRoute("/atividades")({
  beforeLoad: async () => {
    const user = await getServerUser();
    if (!user) throw redirect({
      to: "/login"
    });
    return {
      user
    };
  },
  loader: async () => {
    const eventos = await getEventos();
    return {
      eventos
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./index-BTU5dmpx.js");
const Route$1 = createFileRoute("/")({
  beforeLoad: async () => {
    const user = await getServerUser();
    if (user) {
      throw redirect({
        to: "/dashboard"
      });
    } else {
      throw redirect({
        to: "/login"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./atividades._id-DYzdpUMV.js");
const Route = createFileRoute("/atividades/$id")({
  beforeLoad: async () => {
    const user = await getServerUser();
    if (!user) throw redirect({
      to: "/login"
    });
    return {
      user
    };
  },
  loader: async ({
    params
  }) => {
    const [evento, inscricoes, verificacao] = await Promise.all([getEvento({
      data: {
        id: params.id
      }
    }), getInscricoesEvento({
      data: {
        eventoId: params.id
      }
    }), verificarInscricao({
      data: {
        eventoId: params.id
      }
    })]);
    return {
      evento,
      inscricoes,
      inscrito: verificacao.inscrito
    };
  },
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const LoginRoute = Route$5.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$6
});
const DashboardRoute = Route$4.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$6
});
const ChefiaRoute = Route$3.update({
  id: "/chefia",
  path: "/chefia",
  getParentRoute: () => Route$6
});
const AtividadesRoute = Route$2.update({
  id: "/atividades",
  path: "/atividades",
  getParentRoute: () => Route$6
});
const IndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$6
});
const AtividadesIdRoute = Route.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => AtividadesRoute
});
const AtividadesRouteChildren = {
  AtividadesIdRoute
};
const AtividadesRouteWithChildren = AtividadesRoute._addFileChildren(
  AtividadesRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AtividadesRoute: AtividadesRouteWithChildren,
  ChefiaRoute,
  DashboardRoute,
  LoginRoute
};
const routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$4 as R,
  Route$3 as a,
  Route$2 as b,
  criarEvento as c,
  deletarEvento as d,
  Route as e,
  cancelarInscricao as f,
  inscreverUsuario as i,
  router as r,
  useIdentity as u
};
