import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export function BotaoInstalar() {
  // Guarda o evento nativo do navegador para ser disparado pelo botão
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [mostrarBotao, setMostrarBotao] = useState(false);

  useEffect(() => {
    // Intercepta o aviso padrão do navegador
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setMostrarBotao(true); // Só mostra o botão se o app puder ser instalado
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Mostra a janela nativa de instalação do celular
    deferredPrompt.prompt();
    
    // Aguarda a resposta do usuário
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setMostrarBotao(false); // Esconde o botão se o usuário instalou
    }
    setDeferredPrompt(null);
  };

  if (!mostrarBotao) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="flex items-center gap-2 bg-military-gold text-military-green px-4 py-2 rounded font-bold uppercase tracking-wider shadow-md hover:bg-yellow-500 transition-colors"
    >
      <Download className="w-4 h-4" />
      Instalar App
    </button>
  );
}