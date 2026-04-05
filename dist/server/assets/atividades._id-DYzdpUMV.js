import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { e as Route, i as inscreverUsuario, f as cancelarInscricao } from "./router-DfFyyK-n.js";
import { u as useServerFn } from "./useServerFn-DWuACypr.js";
import { ArrowLeft, CalendarDays, MapPin, Users, CheckCircle, XCircle, Clock, Target, ArrowDownToLine, Mountain, Tent } from "lucide-react";
import { useState } from "react";
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
const categoriaConfig = {
  Acampamento: {
    icon: /* @__PURE__ */ jsx(Tent, { className: "w-5 h-5" }),
    cor: "bg-green-700",
    label: "Acampamento"
  },
  Trilha: {
    icon: /* @__PURE__ */ jsx(Mountain, { className: "w-5 h-5" }),
    cor: "bg-amber-700",
    label: "Trilha"
  },
  Rapel: {
    icon: /* @__PURE__ */ jsx(ArrowDownToLine, { className: "w-5 h-5" }),
    cor: "bg-blue-700",
    label: "Rapel"
  },
  Airsoft: {
    icon: /* @__PURE__ */ jsx(Target, { className: "w-5 h-5" }),
    cor: "bg-gray-700",
    label: "Airsoft"
  }
};
function formatarData(dataStr) {
  return new Date(dataStr).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}
function AtividadeDetalhePage() {
  const {
    evento,
    inscricoes: inscricoesIniciais,
    inscrito: inscritoInicial
  } = Route.useLoaderData();
  const {
    user
  } = Route.useRouteContext();
  const isChefia = user?.roles?.includes("chefia");
  const [inscrito, setInscrito] = useState(inscritoInicial);
  const [inscricoes, setInscricoes] = useState(inscricoesIniciais);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const inscreverFn = useServerFn(inscreverUsuario);
  const cancelarFn = useServerFn(cancelarInscricao);
  if (!evento) {
    return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 py-16 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-lg", children: "Atividade não encontrada." }),
      /* @__PURE__ */ jsx(Link, { to: "/atividades", className: "text-military-olive hover:underline mt-4 inline-block", children: "← Voltar às atividades" })
    ] });
  }
  const passado = new Date(evento.data) < /* @__PURE__ */ new Date();
  const cat = categoriaConfig[evento.categoria];
  const vagasOcupadas = inscricoes.length;
  const vagasRestantes = evento.vagas - vagasOcupadas;
  const handleInscrever = async () => {
    setCarregando(true);
    setErro("");
    setMensagem("");
    try {
      const nova = await inscreverFn({
        data: {
          eventoId: evento.id
        }
      });
      setInscricoes((prev) => [...prev, nova]);
      setInscrito(true);
      setMensagem("Inscrição realizada com sucesso!");
    } catch (e) {
      setErro(e.message || "Erro ao realizar inscrição.");
    } finally {
      setCarregando(false);
    }
  };
  const handleCancelar = async () => {
    setCarregando(true);
    setErro("");
    setMensagem("");
    try {
      await cancelarFn({
        data: {
          eventoId: evento.id
        }
      });
      setInscricoes((prev) => prev.filter((i) => i.userId !== user?.id));
      setInscrito(false);
      setMensagem("Inscrição cancelada.");
    } catch (e) {
      setErro(e.message || "Erro ao cancelar inscrição.");
    } finally {
      setCarregando(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/atividades", className: "inline-flex items-center gap-1.5 text-sm text-military-olive hover:underline mb-6", children: [
      /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
      "Voltar às atividades"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: `${passado ? "bg-gray-600" : cat?.cor || "bg-gray-700"} px-6 py-5`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-white", children: cat?.icon }),
          /* @__PURE__ */ jsx("span", { className: "text-white text-sm font-bold uppercase tracking-widest opacity-90", children: cat?.label }),
          passado && /* @__PURE__ */ jsx("span", { className: "ml-auto bg-black/20 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider", children: "Encerrado" })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white", children: evento.titulo })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-4 bg-parchment rounded-lg", children: [
            /* @__PURE__ */ jsx(CalendarDays, { className: "w-5 h-5 text-military-olive mt-0.5" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Data" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-800 capitalize mt-0.5", children: formatarData(evento.data) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-4 bg-parchment rounded-lg", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 text-military-olive mt-0.5" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Local" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-800 mt-0.5", children: evento.local })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-4 bg-parchment rounded-lg", children: [
            /* @__PURE__ */ jsx(Users, { className: "w-5 h-5 text-military-olive mt-0.5" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Vagas" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-800 mt-0.5", children: vagasRestantes > 0 ? `${vagasRestantes} de ${evento.vagas} disponíveis` : `Lotado (${evento.vagas} vagas)` })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold text-military-green uppercase tracking-wider mb-2", children: "Descrição" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 leading-relaxed whitespace-pre-wrap", children: evento.descricao })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-500 mb-1", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              vagasOcupadas,
              " inscrito",
              vagasOcupadas !== 1 ? "s" : ""
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              evento.vagas,
              " vagas totais"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full h-2 bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: `h-full rounded-full transition-all ${vagasRestantes === 0 ? "bg-red-500" : vagasRestantes <= 3 ? "bg-amber-500" : "bg-military-olive"}`, style: {
            width: `${Math.min(100, vagasOcupadas / evento.vagas * 100)}%`
          } }) })
        ] }),
        mensagem && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-green-700 text-sm", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }),
          mensagem
        ] }),
        erro && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-red-700 text-sm", children: [
          /* @__PURE__ */ jsx(XCircle, { className: "w-4 h-4" }),
          erro
        ] }),
        !passado && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: inscrito ? /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 items-center w-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-green-700 font-medium", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { children: "Você está inscrito nesta atividade" })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: handleCancelar, disabled: carregando, className: "ml-auto px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded text-sm font-medium transition-colors disabled:opacity-60", children: carregando ? "Aguarde..." : "Cancelar Inscrição" })
        ] }) : vagasRestantes === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-gray-500", children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5" }),
          /* @__PURE__ */ jsx("span", { children: "Atividade lotada — sem vagas disponíveis" })
        ] }) : /* @__PURE__ */ jsx("button", { onClick: handleInscrever, disabled: carregando, className: "px-6 py-2.5 bg-military-olive hover:bg-military-green text-white rounded font-semibold uppercase tracking-wider text-sm transition-colors disabled:opacity-60", children: carregando ? "Aguarde..." : "Inscrever-se" }) })
      ] })
    ] }),
    isChefia && /* @__PURE__ */ jsxs("div", { className: "mt-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "px-6 py-4 border-b border-gray-100 bg-military-green/5", children: /* @__PURE__ */ jsxs("h2", { className: "font-bold text-military-green uppercase tracking-wider text-sm", children: [
        "Lista de Inscritos (",
        inscricoes.length,
        ")"
      ] }) }),
      inscricoes.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-gray-500 text-sm", children: "Nenhum participante inscrito ainda." }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-100", children: inscricoes.map((inscricao, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 px-6 py-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-military-olive rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0", children: idx + 1 }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900", children: inscricao.userName }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: inscricao.userEmail })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: new Date(inscricao.inscritoEm).toLocaleDateString("pt-BR") })
      ] }, inscricao.userId)) })
    ] })
  ] });
}
export {
  AtividadeDetalhePage as component
};
