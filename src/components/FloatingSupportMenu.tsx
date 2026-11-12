import React, { useState, useEffect } from 'react';
import { Star, HelpCircle, X, ChevronUp, ThumbsUp } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { openPlayStoreReview, PLAY_STORE_WEB_URL, getPlayStoreHref } from '../utils/playStoreReview';

export const FloatingSupportMenu: React.FC = () => {
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showRatingPrompt, setShowRatingPrompt] = useState<boolean>(false);
  const [hoveredStar, setHoveredStar] = useState<number>(5);

  const playStoreUrl = getPlayStoreHref();
  const whatsappUrl = 'https://wa.me/5562942632021?text=Ol%C3%A1%2C%20estou%20usando%20o%20Wall%20Street%20Scanner%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida';

  useEffect(() => {
    // Show sliding rating prompt after a short delay if not dismissed recently
    try {
      const dismissed = localStorage.getItem('rate_prompt_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => {
          setShowRatingPrompt(true);
        }, 3500);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleDismissPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowRatingPrompt(false);
    try {
      localStorage.setItem('rate_prompt_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleRateClick = () => {
    setShowRatingPrompt(false);
    try {
      localStorage.setItem('rate_prompt_dismissed', 'true');
    } catch {
      // ignore
    }
    openPlayStoreReview();
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2.5 print:hidden select-none max-w-[calc(100vw-2rem)]">
      {/* Sliding Rating Prompt Banner / Card */}
      {showRatingPrompt && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/98 to-amber-950/40 border-2 border-amber-400/50 rounded-2xl shadow-2xl p-3.5 mb-1 backdrop-blur-md animate-in fade-in slide-in-from-right-4 duration-300 w-72 sm:w-80 text-white relative">
          <button
            type="button"
            onClick={handleDismissPrompt}
            className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            title={isPt ? 'Fechar lembrete' : 'Close'}
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">⭐</span>
            <span className="font-extrabold text-amber-300 text-xs sm:text-sm">
              {isPt ? 'Gostando do Scanner?' : 'Enjoying the Scanner?'}
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-snug mb-2.5">
            {isPt
              ? 'Sua avaliação 5 estrelas no Google Play nos ajuda a manter o aplicativo gratuito e atualizado diariamente!'
              : 'Your 5-star review on Google Play helps us keep the app free and updated every market day!'}
          </p>

          {/* Interactive 5 Stars */}
          <div className="flex items-center justify-center gap-1.5 py-1 mb-2.5 bg-slate-950/60 rounded-xl border border-amber-500/20">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredStar(star)}
                onClick={handleRateClick}
                className="p-1 hover:scale-125 transition-transform cursor-pointer"
                title={`Avaliar com ${star} estrela${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={`w-6 h-6 transition-colors duration-150 ${
                    star <= hoveredStar
                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                      : 'text-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRateClick}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-md shadow-amber-950/40 transition cursor-pointer"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{isPt ? 'Avaliar 5★ no Google Play' : 'Rate 5★ on Google Play'}</span>
            </button>
            <button
              type="button"
              onClick={handleDismissPrompt}
              className="py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition cursor-pointer"
            >
              {isPt ? 'Depois' : 'Later'}
            </button>
          </div>
        </div>
      )}

      {/* Expanded Quick Options */}
      {isOpen && (
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl p-3 mb-1 space-y-2.5 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200 w-68 sm:w-72">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span>🚀 Wall Street Scanner</span>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 1. Rate on Google Play (Highlighted) */}
          <a
            id="floating-rate-playstore"
            href={playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-2 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-yellow-500/15 hover:from-amber-500/25 hover:to-yellow-500/25 border border-amber-400/50 text-amber-200 hover:text-white transition group cursor-pointer text-xs"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 shrink-0 group-hover:scale-105 transition shadow-sm">
              <Star className="w-4 h-4 fill-slate-950 text-slate-950" />
            </div>
            <div>
              <div className="font-extrabold text-white text-[12px] leading-tight flex items-center gap-1">
                <span>{isPt ? 'Avaliar na Play Store' : 'Rate on Play Store'}</span>
                <span className="text-amber-400">⭐⭐⭐⭐⭐</span>
              </div>
              <div className="text-[10px] text-amber-300 font-semibold">
                {isPt ? 'Deixe 5 estrelas e apoie o app!' : 'Leave 5 stars & support us!'}
              </div>
            </div>
          </a>

          {/* 2. WhatsApp Direct Chat */}
          <a
            id="floating-whatsapp-link"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:text-white transition group cursor-pointer text-xs"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 shrink-0 group-hover:scale-105 transition">
              <svg className="w-4 h-4 fill-slate-950" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-white text-[12px] leading-tight">
                {isPt ? 'Suporte no WhatsApp' : 'WhatsApp Support'}
              </div>
              <div className="text-[11px] text-emerald-400 font-mono font-semibold">
                +55 (62) 94263-2021
              </div>
            </div>
          </a>

          {/* 3. Install on Google Play */}
          <a
            id="floating-install-playstore"
            href={playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:text-white transition group cursor-pointer text-xs"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition">
              <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a2.43 2.43 0 0 1-.61-.955V2.769c.146-.356.362-.68.61-.955zm11.238 11.24L17.2 15.41 5.372 22.19c.478.138.995.122 1.487-.156l11.988-6.98-3.999-3.999zm0-2.108l4-4L6.86 2.006c-.492-.28-1.01-.295-1.488-.157l11.828 6.78 1.648 1.417zm1.614 1.054l4.385 2.506c.74.423.74 1.114 0 1.537l-4.385 2.506-1.584-1.585 1.584-1.584-1.584-1.584 1.584-1.584z"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-white text-[12px] leading-tight">
                {isPt ? 'Instalar Aplicativo' : 'Install App'}
              </div>
              <div className="text-[10px] text-blue-300">
                Google Play Store Oficial
              </div>
            </div>
          </a>
        </div>
      )}

      {/* Main Trigger Buttons Bar */}
      <div className="flex items-center gap-2 flex-wrap justify-end">
        {/* Direct Play Store Rating Sliding Pill */}
        <a
          id="btn-direct-rate-floating"
          href={playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs px-3.5 py-2.5 rounded-full shadow-lg shadow-amber-950/40 hover:shadow-amber-400/30 transition-all duration-300 cursor-pointer group border border-amber-300/60 active:scale-95"
          title={isPt ? 'Avaliar com 5 Estrelas na Google Play Store' : 'Rate 5 Stars on Google Play Store'}
        >
          <div className="relative">
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-950 animate-ping" />
            <Star className="w-4 h-4 fill-slate-950 text-slate-950 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-200" />
          </div>
          <span className="hidden sm:inline font-bold">
            {isPt ? 'Avaliar 5★ na Play Store' : 'Rate 5★ on Play Store'}
          </span>
          <span className="sm:hidden font-bold">
            {isPt ? 'Avaliar 5★' : 'Rate 5★'}
          </span>
        </a>

        {/* Direct WhatsApp Callout Pill */}
        <a
          id="btn-direct-whatsapp-floating"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-full shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/20 transition-all duration-200 cursor-pointer group border border-emerald-400/40 active:scale-95"
          title="Falar no WhatsApp: +55 (62) 94263-2021"
        >
          <div className="relative">
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </div>
          <span className="hidden sm:inline font-mono">WhatsApp (62) 94263-2021</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>

        {/* Toggle Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 flex items-center justify-center shadow-lg transition cursor-pointer shrink-0"
          title={isPt ? 'Mais opções' : 'More options'}
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <HelpCircle className="w-4 h-4 text-blue-400" />}
        </button>
      </div>
    </div>
  );
};
