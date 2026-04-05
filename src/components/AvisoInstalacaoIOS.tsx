import { useState, useEffect } from 'react';
import { Share, X } from 'lucide-react';

export function AvisoInstalacaoIos() {
  const [mostrarAviso, setMostrarAviso] = useState(false);

  useEffect(() => {
    // Detecta se é um dispositivo iOS (iPhone, iPad, iPod)
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    // Detecta se o app já está rodando instalado (modo standalone)
    const isInStandaloneMode = () => {
      return ('standalone' in window.navigator) && (window.navigator as any).standalone;
    };

    // Se for iOS e AINDA NÃO estiver instalado, mostra a dica
    if (isIos() && !isInStandaloneMode()) {
      setMostrarAviso(true);
    }
  }, []);

  if (!mostrarAviso) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white text-military-green p-4 rounded-lg shadow-2xl border-t-4 border-military-gold flex items-start gap-3 z-50 animate-bounce">
      <div className="flex-1">
        <p className="text-sm font-bold mb-1">Instale o aplicativo GMV</p>
        <p className="text-xs text-gray-600">
          Para instalar este web app no seu iPhone: toque no ícone de Compartilhar <Share className="inline w-3 h-3 text-blue-500 mx-1" /> na barra do navegador e selecione <strong>"Adicionar à Tela de Início"</strong>.
        </p>
      </div>
      <button 
        onClick={() => setMostrarAviso(false)}
        className="text-gray-400 hover:text-gray-800"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}