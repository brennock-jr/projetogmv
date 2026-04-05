import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { a as Route, c as criarEvento, d as deletarEvento } from "./router-DfFyyK-n.js";
import { u as useServerFn } from "./useServerFn-DWuACypr.js";
import { Shield, CalendarDays, Users, Target, X, Plus, MapPin, AlertTriangle, Trash2, ArrowDownToLine, Mountain, Tent } from "lucide-react";
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
const CATEGORIAS = ["Acampamento", "Trilha", "Rapel", "Airsoft"];
function formatarData(dataStr) {
  return new Date(dataStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}
function ChefiaPage() {
  const {
    eventos: eventosIniciais,
    usuarios
  } = Route.useLoaderData();
  const [tab, setTab] = useState("eventos");
  const [eventos, setEventos] = useState(eventosIniciais);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const criarFn = useServerFn(criarEvento);
  const deletarFn = useServerFn(deletarEvento);
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    categoria: "Acampamento",
    data: "",
    local: "",
    vagas: 20
  });
  const agora = /* @__PURE__ */ new Date();
  const proximosEventos = eventos.filter((e) => new Date(e.data) >= agora);
  const eventosPassados = eventos.filter((e) => new Date(e.data) < agora);
  const handleCriarEvento = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");
    setMensagem("");
    try {
      const novo = await criarFn({
        data: {
          ...form,
          vagas: Number(form.vagas)
        }
      });
      setEventos((prev) => [...prev, novo].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()));
      setMostrarFormulario(false);
      setForm({
        titulo: "",
        descricao: "",
        categoria: "Acampamento",
        data: "",
        local: "",
        vagas: 20
      });
      setMensagem("Atividade criada com sucesso!");
    } catch (err) {
      setErro(err.message || "Erro ao criar atividade.");
    } finally {
      setCarregando(false);
    }
  };
  const handleDeletar = async (id) => {
    setCarregando(true);
    setErro("");
    try {
      await deletarFn({
        data: {
          id
        }
      });
      setEventos((prev) => prev.filter((e) => e.id !== id));
      setConfirmDelete(null);
      setMensagem("Atividade removida.");
    } catch (err) {
      setErro(err.message || "Erro ao remover atividade.");
    } finally {
      setCarregando(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-military-gold p-2 rounded", children: /* @__PURE__ */ jsx(Shield, { className: "w-6 h-6 text-military-green" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-military-green uppercase tracking-wider", children: "Painel da Chefia" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: "Gestão de atividades e participantes" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6", children: [{
      label: "Total de Atividades",
      value: eventos.length,
      icon: /* @__PURE__ */ jsx(CalendarDays, { className: "w-5 h-5" })
    }, {
      label: "Atividades Futuras",
      value: proximosEventos.length,
      icon: /* @__PURE__ */ jsx(CalendarDays, { className: "w-5 h-5" })
    }, {
      label: "Usuários Cadastrados",
      value: usuarios.length,
      icon: /* @__PURE__ */ jsx(Users, { className: "w-5 h-5" })
    }, {
      label: "Realizadas",
      value: eventosPassados.length,
      icon: /* @__PURE__ */ jsx(Target, { className: "w-5 h-5" })
    }].map((stat) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-gray-200 shadow-sm p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wider leading-tight", children: stat.label }),
        /* @__PURE__ */ jsx("span", { className: "text-military-olive", children: stat.icon })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-military-green", children: stat.value })
    ] }, stat.label)) }),
    /* @__PURE__ */ jsxs("div", { className: "flex border-b border-gray-200 mb-6", children: [
      /* @__PURE__ */ jsx("button", { onClick: () => setTab("eventos"), className: `px-5 py-3 text-sm font-semibold uppercase tracking-wider border-b-2 transition-colors ${tab === "eventos" ? "border-military-olive text-military-olive" : "border-transparent text-gray-500 hover:text-gray-700"}`, children: "Atividades" }),
      /* @__PURE__ */ jsx("button", { onClick: () => setTab("usuarios"), className: `px-5 py-3 text-sm font-semibold uppercase tracking-wider border-b-2 transition-colors ${tab === "usuarios" ? "border-military-olive text-military-olive" : "border-transparent text-gray-500 hover:text-gray-700"}`, children: "Usuários" })
    ] }),
    mensagem && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("span", { children: mensagem }),
      /* @__PURE__ */ jsx("button", { onClick: () => setMensagem(""), children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
    ] }),
    erro && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("span", { children: erro }),
      /* @__PURE__ */ jsx("button", { onClick: () => setErro(""), children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
    ] }),
    tab === "eventos" && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxs("h2", { className: "font-bold text-military-green uppercase tracking-wider text-base", children: [
          "Atividades (",
          eventos.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setMostrarFormulario(!mostrarFormulario), className: "flex items-center gap-2 bg-military-olive hover:bg-military-green text-white px-4 py-2 rounded text-sm font-semibold uppercase tracking-wider transition-colors", children: [
          mostrarFormulario ? /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
          mostrarFormulario ? "Cancelar" : "Nova Atividade"
        ] })
      ] }),
      mostrarFormulario && /* @__PURE__ */ jsxs("div", { className: "bg-parchment border-2 border-military-olive rounded-lg p-6 mb-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-military-green uppercase tracking-wider mb-4 text-sm", children: "Criar Nova Atividade" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleCriarEvento, className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1", children: "Título *" }),
            /* @__PURE__ */ jsx("input", { type: "text", value: form.titulo, onChange: (e) => setForm({
              ...form,
              titulo: e.target.value
            }), required: true, placeholder: "Ex: Acampamento Serra da Canastra", className: "w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-military-olive" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1", children: "Descrição *" }),
            /* @__PURE__ */ jsx("textarea", { value: form.descricao, onChange: (e) => setForm({
              ...form,
              descricao: e.target.value
            }), required: true, rows: 3, placeholder: "Descreva a atividade, equipamentos necessários, nível de dificuldade...", className: "w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-military-olive resize-none" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1", children: "Categoria *" }),
            /* @__PURE__ */ jsx("select", { value: form.categoria, onChange: (e) => setForm({
              ...form,
              categoria: e.target.value
            }), className: "w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-military-olive", children: CATEGORIAS.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c }, c)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1", children: "Data *" }),
            /* @__PURE__ */ jsx("input", { type: "date", value: form.data, onChange: (e) => setForm({
              ...form,
              data: e.target.value
            }), required: true, className: "w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-military-olive" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1", children: "Local *" }),
            /* @__PURE__ */ jsx("input", { type: "text", value: form.local, onChange: (e) => setForm({
              ...form,
              local: e.target.value
            }), required: true, placeholder: "Ex: Parque Nacional da Serra do Cipó, MG", className: "w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-military-olive" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1", children: "Vagas *" }),
            /* @__PURE__ */ jsx("input", { type: "number", value: form.vagas, onChange: (e) => setForm({
              ...form,
              vagas: Number(e.target.value)
            }), required: true, min: 1, max: 200, className: "w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-military-olive" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2 flex gap-3 pt-2", children: [
            /* @__PURE__ */ jsx("button", { type: "submit", disabled: carregando, className: "px-6 py-2.5 bg-military-olive hover:bg-military-green text-white rounded font-semibold uppercase tracking-wider text-sm transition-colors disabled:opacity-60", children: carregando ? "Salvando..." : "Criar Atividade" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setMostrarFormulario(false), className: "px-6 py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded text-sm font-medium transition-colors", children: "Cancelar" })
          ] })
        ] })
      ] }),
      eventos.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500", children: [
        /* @__PURE__ */ jsx(CalendarDays, { className: "w-12 h-12 mx-auto mb-3 text-gray-300" }),
        /* @__PURE__ */ jsx("p", { children: "Nenhuma atividade cadastrada." }),
        /* @__PURE__ */ jsx("button", { onClick: () => setMostrarFormulario(true), className: "text-military-olive hover:underline text-sm mt-2", children: "Criar a primeira atividade" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: eventos.map((evento) => {
        const passado = new Date(evento.data) < agora;
        const cat = categoriaConfig[evento.categoria];
        return /* @__PURE__ */ jsx("div", { className: `bg-white rounded-lg border shadow-sm overflow-hidden ${confirmDelete === evento.id ? "border-red-300" : "border-gray-200"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-stretch", children: [
          /* @__PURE__ */ jsx("div", { className: `${passado ? "bg-gray-500" : cat?.cor || "bg-gray-700"} w-1.5 flex-shrink-0` }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 px-4 py-3 flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
              /* @__PURE__ */ jsx("span", { className: `${passado ? "text-gray-400" : "text-military-olive"}`, children: cat?.icon }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wider", children: evento.categoria }),
              passado && /* @__PURE__ */ jsx("span", { className: "bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider", children: "Encerrado" })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900 flex-1 min-w-0", children: evento.titulo }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm text-gray-500 flex-shrink-0", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(CalendarDays, { className: "w-3.5 h-3.5" }),
                formatarData(evento.data)
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5" }),
                evento.local
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Users, { className: "w-3.5 h-3.5" }),
                evento.vagas,
                " vagas"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
              /* @__PURE__ */ jsx(Link, { to: "/atividades/$id", params: {
                id: evento.id
              }, className: "px-3 py-1.5 text-xs border border-military-olive text-military-olive hover:bg-military-olive hover:text-white rounded transition-colors", children: "Ver" }),
              confirmDelete === evento.id ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-xs text-red-600 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(AlertTriangle, { className: "w-3 h-3" }),
                  " Confirmar?"
                ] }),
                /* @__PURE__ */ jsx("button", { onClick: () => handleDeletar(evento.id), disabled: carregando, className: "px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60", children: "Sim, remover" }),
                /* @__PURE__ */ jsx("button", { onClick: () => setConfirmDelete(null), className: "px-3 py-1.5 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50", children: "Não" })
              ] }) : /* @__PURE__ */ jsx("button", { onClick: () => setConfirmDelete(evento.id), className: "p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors", title: "Remover atividade", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
            ] })
          ] })
        ] }) }, evento.id);
      }) })
    ] }),
    tab === "usuarios" && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxs("h2", { className: "font-bold text-military-green uppercase tracking-wider text-base", children: [
        "Usuários Cadastrados (",
        usuarios.length,
        ")"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-amber-800 flex gap-2", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 flex-shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Para alterar o papel de um usuário (promover para Chefia), acesse o",
          " ",
          /* @__PURE__ */ jsx("strong", { children: "Painel do Netlify → Identity → Usuários" }),
          " e edite o campo",
          " ",
          /* @__PURE__ */ jsx("code", { className: "bg-amber-100 px-1 rounded", children: "app_metadata.roles" }),
          "."
        ] })
      ] }),
      usuarios.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500", children: [
        /* @__PURE__ */ jsx(Users, { className: "w-12 h-12 mx-auto mb-3 text-gray-300" }),
        /* @__PURE__ */ jsx("p", { children: "Nenhum usuário cadastrado ainda." })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-12 text-xs font-semibold text-gray-500 uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("span", { className: "col-span-1", children: "#" }),
          /* @__PURE__ */ jsx("span", { className: "col-span-4", children: "Nome" }),
          /* @__PURE__ */ jsx("span", { className: "col-span-4", children: "Email" }),
          /* @__PURE__ */ jsx("span", { className: "col-span-2", children: "Papel" }),
          /* @__PURE__ */ jsx("span", { className: "col-span-1", children: "Desde" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-100", children: usuarios.map((usuario, idx) => /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 grid grid-cols-12 text-sm items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "col-span-1 text-gray-400", children: idx + 1 }),
          /* @__PURE__ */ jsx("span", { className: "col-span-4 font-medium text-gray-900 truncate", children: usuario.nome }),
          /* @__PURE__ */ jsx("span", { className: "col-span-4 text-gray-600 truncate", children: usuario.email }),
          /* @__PURE__ */ jsx("span", { className: "col-span-2", children: /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${usuario.papel === "chefia" ? "bg-military-gold/20 text-military-green" : "bg-gray-100 text-gray-600"}`, children: [
            usuario.papel === "chefia" ? /* @__PURE__ */ jsx(Shield, { className: "w-3 h-3" }) : null,
            usuario.papel
          ] }) }),
          /* @__PURE__ */ jsx("span", { className: "col-span-1 text-gray-400 text-xs", children: new Date(usuario.criadoEm).toLocaleDateString("pt-BR", {
            month: "2-digit",
            year: "2-digit"
          }) })
        ] }, usuario.id)) })
      ] })
    ] })
  ] });
}
export {
  ChefiaPage as component
};
