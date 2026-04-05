import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { u as useIdentity, R as Route } from "./router-DfFyyK-n.js";
import { updateUser } from "@netlify/identity";
import { KeyRound, CalendarDays, CheckCircle, Users, MapPin, Target, ArrowDownToLine, Mountain, Tent } from "lucide-react";
import { useState, useEffect } from "react";
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
    icon: /* @__PURE__ */ jsx(Tent, { className: "w-4 h-4" }),
    cor: "bg-green-700",
    label: "Acampamento"
  },
  Trilha: {
    icon: /* @__PURE__ */ jsx(Mountain, { className: "w-4 h-4" }),
    cor: "bg-amber-700",
    label: "Trilha"
  },
  Rapel: {
    icon: /* @__PURE__ */ jsx(ArrowDownToLine, { className: "w-4 h-4" }),
    cor: "bg-blue-700",
    label: "Rapel"
  },
  Airsoft: {
    icon: /* @__PURE__ */ jsx(Target, { className: "w-4 h-4" }),
    cor: "bg-gray-700",
    label: "Airsoft"
  }
};
function formatarData(dataStr) {
  return new Date(dataStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}
function DashboardPage() {
  const {
    user
  } = useIdentity();
  const {
    eventos,
    minhasInscricoes
  } = Route.useLoaderData();
  const {
    user: serverUser
  } = Route.useRouteContext();
  const isChefia = serverUser?.roles?.includes("chefia");
  const agora = /* @__PURE__ */ new Date();
  const proximosEventos = eventos.filter((e) => new Date(e.data) >= agora);
  eventos.filter((e) => new Date(e.data) < agora);
  const eventosInscritos = minhasInscricoes.map((i) => i.eventoId);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [recoveryErro, setRecoveryErro] = useState("");
  const [recoverySucesso, setRecoverySucesso] = useState("");
  const [recoveryCarregando, setRecoveryCarregando] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("gmv_recovery_mode") === "true") {
      setRecoveryMode(true);
      sessionStorage.removeItem("gmv_recovery_mode");
    }
  }, []);
  const handleAtualizarSenha = async (e) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      setRecoveryErro("As senhas não coincidem.");
      return;
    }
    if (novaSenha.length < 6) {
      setRecoveryErro("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    setRecoveryCarregando(true);
    setRecoveryErro("");
    try {
      await updateUser({
        password: novaSenha
      });
      setRecoverySucesso("Senha atualizada com sucesso!");
      setRecoveryMode(false);
    } catch {
      setRecoveryErro("Erro ao atualizar a senha. Tente novamente.");
    } finally {
      setRecoveryCarregando(false);
    }
  };
  const nomeUsuario = user?.name || serverUser?.name || serverUser?.email || "Agente";
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
    recoveryMode && /* @__PURE__ */ jsx("div", { className: "mb-6 bg-amber-50 border border-amber-300 rounded-lg p-5 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsx(KeyRound, { className: "w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-amber-800 mb-1", children: "Redefinir Senha" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-amber-700 mb-3", children: "Você acessou via link de recuperação. Defina uma nova senha para continuar." }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleAtualizarSenha, className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx("input", { type: "password", value: novaSenha, onChange: (e) => setNovaSenha(e.target.value), placeholder: "Nova senha", required: true, className: "px-3 py-2 border border-amber-300 rounded bg-white text-sm focus:outline-none focus:border-amber-500" }),
          /* @__PURE__ */ jsx("input", { type: "password", value: confirmarSenha, onChange: (e) => setConfirmarSenha(e.target.value), placeholder: "Confirmar nova senha", required: true, className: "px-3 py-2 border border-amber-300 rounded bg-white text-sm focus:outline-none focus:border-amber-500" }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: recoveryCarregando, className: "px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm font-medium disabled:opacity-60", children: recoveryCarregando ? "Salvando..." : "Salvar Senha" })
        ] }),
        recoveryErro && /* @__PURE__ */ jsx("p", { className: "text-red-600 text-sm mt-2", children: recoveryErro }),
        recoverySucesso && /* @__PURE__ */ jsx("p", { className: "text-green-600 text-sm mt-2", children: recoverySucesso })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold text-military-green uppercase tracking-wider", children: [
        "Bem-vindo, ",
        nomeUsuario
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 mt-1", children: isChefia ? "Painel da Chefia · GMV" : "Painel do Agente · GMV" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-gray-200 shadow-sm p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Próximas Atividades" }),
          /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-military-green mt-1", children: proximosEventos.length })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bg-military-olive/10 p-3 rounded-lg", children: /* @__PURE__ */ jsx(CalendarDays, { className: "w-6 h-6 text-military-olive" }) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-gray-200 shadow-sm p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Minhas Inscrições" }),
          /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-military-green mt-1", children: minhasInscricoes.length })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bg-military-olive/10 p-3 rounded-lg", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-6 h-6 text-military-olive" }) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-gray-200 shadow-sm p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Total de Atividades" }),
          /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-military-green mt-1", children: eventos.length })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bg-military-olive/10 p-3 rounded-lg", children: /* @__PURE__ */ jsx(Users, { className: "w-6 h-6 text-military-olive" }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-military-green uppercase tracking-wider border-b-2 border-military-gold pb-1", children: "Próximas Atividades" }),
        /* @__PURE__ */ jsx(Link, { to: "/atividades", className: "text-sm text-military-olive hover:underline font-medium", children: "Ver todas →" })
      ] }),
      proximosEventos.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500", children: [
        /* @__PURE__ */ jsx(CalendarDays, { className: "w-12 h-12 mx-auto mb-3 text-gray-300" }),
        /* @__PURE__ */ jsx("p", { children: "Nenhuma atividade programada." }),
        isChefia && /* @__PURE__ */ jsx(Link, { to: "/chefia", className: "text-military-olive hover:underline text-sm mt-2 inline-block", children: "Criar nova atividade" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: proximosEventos.slice(0, 6).map((evento) => /* @__PURE__ */ jsx(EventoCard, { evento, inscrito: eventosInscritos.includes(evento.id) }, evento.id)) })
    ] }),
    minhasInscricoes.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-military-green uppercase tracking-wider border-b-2 border-military-gold pb-1 mb-4", children: "Minhas Inscrições" }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-gray-200 overflow-hidden", children: minhasInscricoes.map((inscricao, idx) => {
        const evento = eventos.find((e) => e.id === inscricao.eventoId);
        if (!evento) return null;
        const cat = categoriaConfig[evento.categoria];
        return /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-4 p-4 ${idx < minhasInscricoes.length - 1 ? "border-b border-gray-100" : ""}`, children: [
          /* @__PURE__ */ jsx("span", { className: `${cat?.cor || "bg-gray-600"} text-white p-2 rounded`, children: cat?.icon }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900 truncate", children: evento.titulo }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
              formatarData(evento.data),
              " · ",
              evento.local
            ] })
          ] }),
          /* @__PURE__ */ jsx(Link, { to: "/atividades/$id", params: {
            id: evento.id
          }, className: "text-sm text-military-olive hover:underline flex-shrink-0", children: "Detalhes" })
        ] }, inscricao.eventoId);
      }) })
    ] })
  ] });
}
function EventoCard({
  evento,
  inscrito
}) {
  const cat = categoriaConfig[evento.categoria];
  const passado = new Date(evento.data) < /* @__PURE__ */ new Date();
  return /* @__PURE__ */ jsxs(Link, { to: "/atividades/$id", params: {
    id: evento.id
  }, className: "block bg-white rounded-lg border border-gray-200 shadow-sm hover:border-military-olive hover:shadow-md transition-all overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: `${cat?.cor || "bg-gray-700"} px-4 py-3 flex items-center gap-2`, children: [
      /* @__PURE__ */ jsx("span", { className: "text-white", children: cat?.icon }),
      /* @__PURE__ */ jsx("span", { className: "text-white text-xs font-bold uppercase tracking-wider", children: cat?.label }),
      inscrito && /* @__PURE__ */ jsx("span", { className: "ml-auto bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider", children: "Inscrito" }),
      passado && /* @__PURE__ */ jsx("span", { className: "ml-auto bg-black/20 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider", children: "Encerrado" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-900 mb-2 line-clamp-2", children: evento.titulo }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
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
      ] })
    ] })
  ] });
}
export {
  DashboardPage as component
};
