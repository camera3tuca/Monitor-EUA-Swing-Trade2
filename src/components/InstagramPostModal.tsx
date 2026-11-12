import React, { useState } from 'react';
import { X, Download, Copy, Check, ExternalLink, Sparkles, Share2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface InstagramPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstagramPostModal: React.FC<InstagramPostModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const [selectedFormat, setSelectedFormat] = useState<'feed' | 'story'>('feed');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const playStoreLink = 'https://play.google.com/store/apps/details?id=com.sciencebit.wallstreetscanner';
  const whatsappNumber = '+55 (62) 94263-2021';
  const whatsappLink = 'https://wa.me/5562942632021';

  const captionPt = `🚀 WALL STREET SCANNER PRO — O APP DEFINITIVO DE SWING TRADE CHEGOU AO GOOGLE PLAY! 📈🐂

Quer identificar oportunidades de compra nos maiores mercados do mundo (S&P 500, NASDAQ e NYSE) com base em métodos quantitativos institucionais?

O Wall Street Scanner Pro monitora centenas de ações e ETFs americanos em tempo real, filtrando setups de alta probabilidade:

✨ DESTAQUES DO APLICATIVO:
🟢 Índice de Sobrevenda (IS) exclusivo para compras em fundos e repiques
📊 Indicador IFR / RSI (14) e Estocástico em tempo real
🎯 Retrações de Fibonacci (61.8% e 38.2%) automáticas
🌊 Metodologia Triple Screen do Dr. Alexander Elder
⚡ Trend Template do campeão Mark Minervini
🤖 Filtros com Inteligência Artificial e Aprendizado por Reforço
🏢 Cotações em US$ de Apple, Nvidia, Microsoft, Tesla e mais de 500 empresas!

📲 BAIXE AGORA DIRETAMENTE NO GOOGLE PLAY STORE:
👉 ${playStoreLink}
(Link também na Bio do perfil!)

💬 Dúvidas ou Suporte via WhatsApp:
${whatsappNumber} (${whatsappLink})

Desenvolvido por ScienceBit Computer.
#swingtrade #açõesamericanas #wallstreet #sp500 #nasdaq #bolsadevalores #investimentos #mercadofinanceiro #daytrade #analisetecnica #trading`;

  const captionEn = `🚀 WALL STREET SCANNER PRO — THE INSTITUTIONAL SWING TRADE SCANNER IS ON GOOGLE PLAY! 📈🐂

Spot high-probability pullbacks and bounce opportunities across the S&P 500, NASDAQ, and NYSE in real time.

✨ KEY FEATURES:
🟢 Exclusive Oversold Index (IS)
📊 Real-time RSI(14) & Stochastic Scans
🎯 Automatic Fibonacci Retracements (61.8% / 38.2%)
🌊 Dr. Alexander Elder's Triple Screen Strategy
⚡ Mark Minervini Trend Template
🤖 Machine Learning & Reinforcement Learning Filters
🏢 Live quotes for Apple, Nvidia, Microsoft, Tesla, and 500+ top stocks!

📲 INSTALL NOW DIRECTLY FROM THE GOOGLE PLAY STORE:
👉 ${playStoreLink}

💬 WhatsApp Support: ${whatsappNumber}

Developed by ScienceBit Computer.
#swingtrading #stockmarket #wallstreet #nasdaq #sp500 #tradingapp #technicalanalysis`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-purple-950/40 via-slate-900 to-pink-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20 shrink-0">
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Material de Divulgação para o Instagram</span>
                <span className="bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Pronto para Postar
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Artes em alta resolução com a logomarca oficial, ícone do app e link para o Google Play
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Format Tabs */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedFormat('feed')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  selectedFormat === 'feed'
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <span>Feed Post (1080x1080 Quadrado)</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat('story')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  selectedFormat === 'story'
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <span>Stories / Reels (1080x1920 Vertical)</span>
              </button>
            </div>

            <a
              href={selectedFormat === 'feed' ? '/instagram-post-feed.png' : '/instagram-post-story.png'}
              download={selectedFormat === 'feed' ? 'wallstreet-scanner-instagram-feed.png' : 'wallstreet-scanner-instagram-story.png'}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition shadow cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Imagem PNG</span>
            </a>
          </div>

          {/* Image Preview & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Visual Preview */}
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
              <div className="relative group max-h-[380px] overflow-hidden rounded-xl border border-slate-800 shadow-2xl flex items-center justify-center">
                <img
                  src={selectedFormat === 'feed' ? '/instagram-post-feed.png' : '/instagram-post-story.png'}
                  alt="Arte Instagram"
                  className="max-h-[360px] object-contain rounded-xl"
                />
              </div>
              <div className="mt-3 flex items-center justify-between w-full text-xs text-slate-400 px-1">
                <span className="font-mono text-[11px]">
                  {selectedFormat === 'feed' ? '1080 x 1080 px • PNG' : '1080 x 1920 px • PNG'}
                </span>
                <a
                  href={selectedFormat === 'feed' ? '/instagram-post-feed.png' : '/instagram-post-story.png'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Abrir em tela cheia</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Captions ready to copy */}
            <div className="space-y-4 text-xs">
              {/* Portuguese Caption */}
              <div className="bg-slate-800/40 border border-slate-750 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span>🇧🇷 Legenda Completa em Português</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(captionPt, 'pt')}
                    className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-lg transition cursor-pointer"
                  >
                    {copiedKey === 'pt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'pt' ? 'Copiado!' : 'Copiar Legenda'}</span>
                  </button>
                </div>
                <div className="bg-slate-900/90 rounded-xl p-3 text-[11px] text-slate-300 font-sans max-h-40 overflow-y-auto whitespace-pre-line border border-slate-800">
                  {captionPt}
                </div>
              </div>

              {/* Direct Play Store Link */}
              <div className="bg-slate-800/40 border border-slate-750 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-400 text-xs uppercase tracking-wider">
                    🔗 Link da Google Play Store (para colocar na Bio ou Stories)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(playStoreLink, 'link')}
                    className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-1 rounded-lg transition cursor-pointer"
                  >
                    {copiedKey === 'link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'link' ? 'Copiado!' : 'Copiar Link'}</span>
                  </button>
                </div>
                <div className="bg-slate-900/90 rounded-xl p-2.5 text-[11px] text-blue-300 font-mono select-all border border-slate-800 truncate">
                  {playStoreLink}
                </div>
              </div>

              {/* English Caption */}
              <div className="bg-slate-800/40 border border-slate-750 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 text-xs uppercase tracking-wider">
                    🇺🇸 English Caption (Optional)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(captionEn, 'en')}
                    className="flex items-center gap-1 text-xs bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded-lg transition cursor-pointer"
                  >
                    {copiedKey === 'en' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'en' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-slate-900/90 rounded-xl p-2.5 text-[10px] text-slate-400 font-sans max-h-24 overflow-y-auto whitespace-pre-line border border-slate-800">
                  {captionEn}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 text-[11px]">
            💡 Dica: No Instagram Stories, use a figurinha de <strong>"Link"</strong> colando o link do Google Play!
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
