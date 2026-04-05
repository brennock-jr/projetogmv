import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { login, MissingIdentityError, AuthError, signup, requestPasswordRecovery } from "@netlify/identity";
import { u as useIdentity } from "./router-DfFyyK-n.js";
import { Shield, EyeOff, Eye } from "lucide-react";
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
function LoginPage() {
  const {
    user,
    ready
  } = useIdentity();
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  useEffect(() => {
    if (ready && user) {
      navigate({
        to: "/dashboard"
      });
    }
  }, [ready, user]);
  const limparMensagens = () => {
    setErro("");
    setSucesso("");
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    limparMensagens();
    setCarregando(true);
    try {
      await login(email, senha);
      navigate({
        to: "/dashboard"
      });
    } catch (err) {
      if (err instanceof MissingIdentityError) {
        setErro("Serviço de autenticação indisponível.");
      } else if (err instanceof AuthError) {
        if (err.status === 401) setErro("Email ou senha inválidos.");
        else setErro(err.message);
      } else {
        setErro("Ocorreu um erro. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  };
  const handleCadastro = async (e) => {
    e.preventDefault();
    limparMensagens();
    setCarregando(true);
    try {
      const u = await signup(email, senha, {
        full_name: nome
      });
      if (u.emailVerified) {
        navigate({
          to: "/dashboard"
        });
      } else {
        setSucesso(`Conta criada! Verifique seu email (${email}) para confirmar o cadastro.`);
      }
    } catch (err) {
      if (err instanceof AuthError) {
        if (err.status === 403) setErro("Cadastro de novos usuários não está disponível.");
        else if (err.status === 422) setErro("Email inválido ou senha muito fraca (mínimo 6 caracteres).");
        else setErro(err.message);
      } else {
        setErro("Ocorreu um erro. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  };
  const handleRecuperar = async (e) => {
    e.preventDefault();
    limparMensagens();
    setCarregando(true);
    try {
      await requestPasswordRecovery(email);
      setSucesso(`Email de recuperação enviado para ${email}. Verifique sua caixa de entrada.`);
    } catch (err) {
      if (err instanceof AuthError) setErro(err.message);
      else setErro("Ocorreu um erro. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-military-green flex flex-col items-center justify-center px-4 py-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 bg-military-gold rounded-full mb-4 shadow-xl", children: /* @__PURE__ */ jsx(Shield, { className: "w-10 h-10 text-military-green" }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-white tracking-widest uppercase", children: "GMV" }),
      /* @__PURE__ */ jsx("p", { className: "text-military-gold text-sm tracking-widest uppercase mt-1", children: "Grupo Militar de Voluntários" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-3 justify-center", children: [
        /* @__PURE__ */ jsx("div", { className: "h-px w-16 bg-military-gold/40" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-xs tracking-wider uppercase", children: "Atividades ao Ar Livre" }),
        /* @__PURE__ */ jsx("div", { className: "h-px w-16 bg-military-gold/40" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm bg-parchment rounded-lg shadow-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "flex border-b border-parchment-dark", children: [{
        key: "login",
        label: "Entrar"
      }, {
        key: "cadastro",
        label: "Cadastrar"
      }, {
        key: "recuperar",
        label: "Recuperar Senha"
      }].map((t) => /* @__PURE__ */ jsx("button", { onClick: () => {
        setTab(t.key);
        limparMensagens();
      }, className: `flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${tab === t.key ? "bg-military-olive text-white" : "text-gray-600 hover:bg-parchment-dark"} ${t.key === "recuperar" ? "hidden" : ""}`, children: t.label }, t.key)) }),
      /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        erro && /* @__PURE__ */ jsx("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm", children: erro }),
        sucesso && /* @__PURE__ */ jsx("div", { className: "mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm", children: sucesso }),
        tab === "login" && /* @__PURE__ */ jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1", children: "Email" }),
            /* @__PURE__ */ jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, placeholder: "seu@email.com", className: "w-full px-3 py-2.5 border border-gray-300 rounded bg-white focus:outline-none focus:border-military-olive text-sm" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1", children: "Senha" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("input", { type: mostrarSenha ? "text" : "password", value: senha, onChange: (e) => setSenha(e.target.value), required: true, placeholder: "••••••••", className: "w-full px-3 py-2.5 border border-gray-300 rounded bg-white focus:outline-none focus:border-military-olive text-sm pr-10" }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setMostrarSenha(!mostrarSenha), className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600", children: mostrarSenha ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: carregando, className: "w-full bg-military-olive hover:bg-military-green text-white py-2.5 rounded font-semibold uppercase tracking-wider text-sm transition-colors disabled:opacity-60", children: carregando ? "Aguarde..." : "Entrar" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
            setTab("recuperar");
            limparMensagens();
          }, className: "w-full text-center text-xs text-military-olive hover:underline mt-1", children: "Esqueci minha senha" })
        ] }),
        tab === "cadastro" && /* @__PURE__ */ jsxs("form", { onSubmit: handleCadastro, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1", children: "Nome Completo" }),
            /* @__PURE__ */ jsx("input", { type: "text", value: nome, onChange: (e) => setNome(e.target.value), required: true, placeholder: "Seu nome", className: "w-full px-3 py-2.5 border border-gray-300 rounded bg-white focus:outline-none focus:border-military-olive text-sm" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1", children: "Email" }),
            /* @__PURE__ */ jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, placeholder: "seu@email.com", className: "w-full px-3 py-2.5 border border-gray-300 rounded bg-white focus:outline-none focus:border-military-olive text-sm" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1", children: "Senha" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("input", { type: mostrarSenha ? "text" : "password", value: senha, onChange: (e) => setSenha(e.target.value), required: true, minLength: 6, placeholder: "Mínimo 6 caracteres", className: "w-full px-3 py-2.5 border border-gray-300 rounded bg-white focus:outline-none focus:border-military-olive text-sm pr-10" }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setMostrarSenha(!mostrarSenha), className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600", children: mostrarSenha ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: carregando, className: "w-full bg-military-olive hover:bg-military-green text-white py-2.5 rounded font-semibold uppercase tracking-wider text-sm transition-colors disabled:opacity-60", children: carregando ? "Aguarde..." : "Criar Conta" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 text-center mt-2", children: [
            "Após o cadastro, confirme seu email para ativar a conta. Novos usuários recebem o papel de ",
            /* @__PURE__ */ jsx("strong", { children: "Agente" }),
            "."
          ] })
        ] }),
        tab === "recuperar" && /* @__PURE__ */ jsxs("form", { onSubmit: handleRecuperar, className: "space-y-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-2", children: "Informe seu email para receber o link de recuperação de senha." }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1", children: "Email" }),
            /* @__PURE__ */ jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, placeholder: "seu@email.com", className: "w-full px-3 py-2.5 border border-gray-300 rounded bg-white focus:outline-none focus:border-military-olive text-sm" })
          ] }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: carregando, className: "w-full bg-military-olive hover:bg-military-green text-white py-2.5 rounded font-semibold uppercase tracking-wider text-sm transition-colors disabled:opacity-60", children: carregando ? "Aguarde..." : "Enviar Link" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
            setTab("login");
            limparMensagens();
          }, className: "w-full text-center text-xs text-military-olive hover:underline", children: "Voltar para o login" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-gray-500 text-xs mt-6 text-center", children: [
      "GMV © ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " · Todos os direitos reservados"
    ] })
  ] });
}
export {
  LoginPage as component
};
