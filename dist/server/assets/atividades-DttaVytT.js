import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Search, CalendarDays, Tent, Mountain, ArrowDownToLine, Target, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { b as Route } from "./router-DfFyyK-n.js";
import "@netlify/identity";
import "../server.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "./identity-DkpMdGlM.js";
const categorias = [{
  value: "Todas",
  label: "Todas"
}, {
  value: "Acampamento",
  label: "Acampamento",
  icon: /* @__PURE__ */ jsx(Tent, { className: "w-4 h-4" })
}, {
  value: "Trilha",
  label: "Trilha",
  icon: /* @__PURE__ */ jsx(Mountain, { className: "w-4 h-4" })
}, {
  value: "Rapel",
  label: "Rapel",
  icon: /* @__PURE__ */ jsx(ArrowDownToLine, { className: "w-4 h-4" })
}, {
  value: "Airsoft",
  label: "Airsoft",
  icon: /* @__PURE__ */ jsx(Target, { className: "w-4 h-4" })
}];
const categoriaConfig = {
  Acampamento: {
    icon: /* @__PURE__ */ jsx(Tent, { className: "w-4 h-4" }),
    cor: "bg-green-700"
  },
  Trilha: {
    icon: /* @__PURE__ */ jsx(Mountain, { className: "w-4 h-4" }),
    cor: "bg-amber-700"
  },
  Rapel: {
    icon: /* @__PURE__ */ jsx(ArrowDownToLine, { className: "w-4 h-4" }),
    cor: "bg-blue-700"
  },
  Airsoft: {
    icon: /* @__PURE__ */ jsx(Target, { className: "w-4 h-4" }),
    cor: "bg-gray-700"
  }
};
function formatarData(dataStr) {
  return new Date(dataStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}
function AtividadesPage() {
  const {
    eventos
  } = Route.useLoaderData();
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [mostrarPassadas, setMostrarPassadas] = useState(false);
  const agora = /* @__PURE__ */ new Date();
  const eventosFiltrados = eventos.filter((e) => {
    const passado = new Date(e.data) < agora;
    if (!mostrarPassadas && passado) return false;
    if (categoriaFiltro !== "Todas" && e.categoria !== categoriaFiltro) return false;
    if (busca && !e.titulo.toLowerCase().includes(busca.toLowerCase()) && !e.local.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });
  const proximos = eventosFiltrados.filter((e) => new Date(e.data) >= agora);
  const passados = eventosFiltrados.filter((e) => new Date(e.data) < agora);
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-military-green uppercase tracking-wider", children: "Atividades" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 mt-1", children: "Explore e inscreva-se nas atividades do GMV" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-48", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
        /* @__PURE__ */ jsx("input", { type: "text", value: busca, onChange: (e) => setBusca(e.target.value), placeholder: "Buscar por nome ou local...", className: "w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-military-olive" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: categorias.map((cat) => /* @__PURE__ */ jsxs("button", { onClick: () => setCategoriaFiltro(cat.value), className: `flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${categoriaFiltro === cat.value ? "bg-military-olive text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`, children: [
        cat.icon,
        cat.label
      ] }, cat.value)) }),
      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm text-gray-600 cursor-pointer ml-auto", children: [
        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: mostrarPassadas, onChange: (e) => setMostrarPassadas(e.target.checked), className: "rounded border-gray-300" }),
        "Mostrar passadas"
      ] })
    ] }) }),
    eventosFiltrados.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500", children: [
      /* @__PURE__ */ jsx(CalendarDays, { className: "w-12 h-12 mx-auto mb-3 text-gray-300" }),
      /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Nenhuma atividade encontrada." }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mt-1", children: "Tente ajustar os filtros de busca." })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      proximos.length > 0 && /* @__PURE__ */ jsxs("section", { className: "mb-8", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-base font-bold text-military-green uppercase tracking-wider border-b-2 border-military-gold pb-1 mb-4", children: [
          "Próximas — ",
          proximos.length,
          " ",
          proximos.length === 1 ? "atividade" : "atividades"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: proximos.map((evento) => /* @__PURE__ */ jsx(AtividadeCard, { evento }, evento.id)) })
      ] }),
      mostrarPassadas && passados.length > 0 && /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-base font-bold text-gray-500 uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-4", children: [
          "Realizadas — ",
          passados.length,
          " ",
          passados.length === 1 ? "atividade" : "atividades"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: passados.map((evento) => /* @__PURE__ */ jsx(AtividadeCard, { evento, passado: true }, evento.id)) })
      ] })
    ] })
  ] });
}
function AtividadeCard({
  evento,
  passado
}) {
  const cat = categoriaConfig[evento.categoria];
  return /* @__PURE__ */ jsxs(Link, { to: "/atividades/$id", params: {
    id: evento.id
  }, className: `block bg-white rounded-lg border shadow-sm hover:shadow-md transition-all overflow-hidden ${passado ? "border-gray-200 opacity-75" : "border-gray-200 hover:border-military-olive"}`, children: [
    /* @__PURE__ */ jsxs("div", { className: `${passado ? "bg-gray-500" : cat?.cor || "bg-gray-700"} px-4 py-3 flex items-center gap-2`, children: [
      /* @__PURE__ */ jsx("span", { className: "text-white", children: cat?.icon }),
      /* @__PURE__ */ jsx("span", { className: "text-white text-xs font-bold uppercase tracking-wider", children: evento.categoria }),
      passado && /* @__PURE__ */ jsx("span", { className: "ml-auto bg-black/20 text-white text-[10px] px-2 py-0.5 rounded-full uppercase", children: "Encerrado" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-900 mb-3 line-clamp-2", children: evento.titulo }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
          /* @__PURE__ */ jsx(CalendarDays, { className: "w-3.5 h-3.5 text-military-olive flex-shrink-0" }),
          /* @__PURE__ */ jsx("span", { children: formatarData(evento.data) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-military-olive flex-shrink-0" }),
          /* @__PURE__ */ jsx("span", { className: "truncate", children: evento.local })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
          /* @__PURE__ */ jsx(Users, { className: "w-3.5 h-3.5 text-military-olive flex-shrink-0" }),
          /* @__PURE__ */ jsxs("span", { children: [
            evento.vagas,
            " vagas"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-3 pt-3 border-t border-gray-100", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 line-clamp-2", children: evento.descricao }) })
    ] })
  ] });
}
export {
  AtividadesPage as component
};
