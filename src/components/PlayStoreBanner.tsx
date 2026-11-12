import React, { useState, useEffect } from 'react';
import { Star, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { AppIcon } from './AppIcon';

export const PlayStoreBanner: React.FC = () => {
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const [dismissed, setDismissed] = useState<boolean>(true);

  useEffect(() => {
    try {
      const isDismissed = localStorage.getItem('playstore_banner_dismissed');
      // Show if not dismissed within last 24h
      if (!isDismissed) {
        setDismissed(false);
      }
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem('playstore_banner_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 border-b border-emerald-500/40 text-slate-100 px-3 sm:px-6 py-2.5 relative z-40 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Left: App icon + Text */}
        <div className="flex items-center gap-3 min-w-0">
          <AppIcon
            size={40}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-md shrink-0 border border-slate-700/60 p-0.5"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white text-xs sm:text-sm tracking-tight">
                {isPt ? 'Aplicativo Oficial na Google Play Store' : 'Official Google Play Store App'}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{isPt ? 'Verificado & Seguro' : 'Verified'}</span>
              </span>
            </div>
            <p className="text-slate-300 text-[11px] truncate hidden sm:block">
              {isPt
                ? 'Instale o app diretamente pela Play Store para receber alertas de swing trade e máxima velocidade.'
                : 'Install directly from Google Play Store for real-time swing trade alerts and optimal mobile performance.'}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          {/* Direct Install on Play Store Button */}
          <a
            id="banner-install-playstore"
            href="https://play.google.com/store/apps/details?id=com.sciencebit.wallstreetscanner"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl shadow-md transition duration-200 text-xs cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0 fill-slate-950" viewBox="0 0 24 24">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a2.43 2.43 0 0 1-.61-.955V2.769c.146-.356.362-.68.61-.955zm11.238 11.24L17.2 15.41 5.372 22.19c.478.138.995.122 1.487-.156l11.988-6.98-3.999-3.999zm0-2.108l4-4L6.86 2.006c-.492-.28-1.01-.295-1.488-.157l11.828 6.78 1.648 1.417zm1.614 1.054l4.385 2.506c.74.423.74 1.114 0 1.537l-4.385 2.506-1.584-1.585 1.584-1.584-1.584-1.584 1.584-1.584z"/>
            </svg>
            <span>{isPt ? 'Instalar no Google Play' : 'Install on Google Play'}</span>
          </a>

          {/* Rate Button */}
          <a
            id="banner-rate-playstore"
            href="https://play.google.com/store/apps/details?id=com.sciencebit.wallstreetscanner"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/50 text-amber-300 px-3 py-1.5 rounded-xl font-bold transition text-xs"
            title="Avaliar no Google Play"
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
            <span>{isPt ? 'Avaliar 5★' : 'Rate 5★'}</span>
          </a>

          {/* WhatsApp Support Link */}
          <a
            id="banner-whatsapp-support"
            href="https://wa.me/5562942632021?text=Ol%C3%A1%2C%20estou%20usando%20o%20Wall%20Street%20Scanner%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 px-2.5 py-1.5 rounded-xl font-medium transition text-xs"
            title="WhatsApp: +55 (62) 94263-2021"
          >
            <span>WhatsApp: +55 (62) 94263-2021</span>
          </a>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title={isPt ? 'Fechar aviso' : 'Close notice'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
