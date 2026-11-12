import React, { useState, useEffect } from 'react';
import { Clock, ChevronDown, ChevronUp, BookOpen, Globe, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../i18n/LanguageContext';
import { MarketUniverse } from '../types';
import { ScienceBitLogo } from './ScienceBitLogo';
import { AppIcon } from './AppIcon';

interface MarketStatus {
  status: 'aberta' | 'pre-abertura' | 'leilao' | 'fechada';
  label: string;
  sublabel: string;
  badgeClass: string;
  dotClass: string;
}

interface HeaderProps {
  market?: MarketUniverse;
  onMarketChange?: (m: MarketUniverse) => void;
  onSelectMarket?: (m: MarketUniverse) => void;
  onOpenPlayStoreKit?: () => void;
  onOpenTutorial?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPlayStoreKit, onOpenTutorial }) => {
  const { language, setLanguage, t } = useLanguage();
  const [timeStr, setTimeStr] = useState<string>('');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState<boolean>(false);
  const [marketStatus, setMarketStatus] = useState<MarketStatus>({
    status: 'fechada',
    label: 'Market Closed',
    sublabel: 'Opens at 09:30 ET',
    badgeClass: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
    dotClass: 'bg-rose-500',
  });
  const [guiaAberto, setGuiaAberto] = useState<boolean>(false);

  useEffect(() => {
    const updateTimeAndMarket = () => {
      try {
        const now = new Date();
        const timeZone = 'America/New_York';
        const str = now.toLocaleTimeString(language === 'pt' ? 'pt-BR' : 'en-US', {
          timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setTimeStr(str);

        const dateInTz = new Date(now.toLocaleString('en-US', { timeZone }));
        const dayOfWeek = dateInTz.getDay();
        const hours = dateInTz.getHours();
        const minutes = dateInTz.getMinutes();
        const totalMinutes = hours * 60 + minutes;

        if (dayOfWeek === 0 || dayOfWeek === 6) {
          setMarketStatus({
            status: 'fechada',
            label: t('marketClosed'),
            sublabel: t('weekendClosed'),
            badgeClass: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
            dotClass: 'bg-rose-500',
          });
          return;
        }

        if (totalMinutes < 9 * 60 + 30) {
          setMarketStatus({
            status: 'pre-abertura',
            label: t('preMarket'),
            sublabel: `${t('opensAt')} 09:30 ET`,
            badgeClass: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
            dotClass: 'bg-amber-500',
          });
        } else if (totalMinutes < 16 * 60) {
          setMarketStatus({
            status: 'aberta',
            label: t('marketOpen'),
            sublabel: `${t('closesAt')} 16:00 ET`,
            badgeClass: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
            dotClass: 'bg-emerald-400 animate-pulse',
          });
        } else {
          setMarketStatus({
            status: 'fechada',
            label: t('marketClosed'),
            sublabel: t('afterHours'),
            badgeClass: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
            dotClass: 'bg-rose-500',
          });
        }
      } catch {
        setTimeStr(new Date().toLocaleTimeString());
      }
    };
    updateTimeAndMarket();
    const interval = setInterval(updateTimeAndMarket, 1000);
    return () => clearInterval(interval);
  }, [language, t]);

  return (
    <header className="bg-slate-850/95 backdrop-blur-md border-b border-slate-700/70 sticky top-0 z-30 px-3 sm:px-6 lg:px-8 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Main Row: Brand & Vital Controls */}
        <div className="flex items-center justify-between gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="relative group shrink-0 flex items-center justify-center">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <AppIcon
                size={44}
                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl shadow-md drop-shadow-[0_2px_10px_rgba(16,185,129,0.3)] p-0.5"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight truncate">
                  Wall Street Scanner
                </h1>
                <span className="hidden sm:inline-block bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Swing Trade Pro
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {t('live')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium truncate">
                <span className="text-blue-400 sm:hidden font-bold">Swing Trade Pro</span>
                <span className="text-slate-600 sm:hidden">•</span>
                <span className="truncate">S&amp;P 500, NASDAQ &amp; NYSE</span>
                <span className="text-slate-600 hidden md:inline">•</span>
                <span className="hidden md:inline text-slate-400">por ScienceBit Computer</span>
              </div>
            </div>
          </div>

          {/* Quick Header Right: Status & Language */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Market Status (Bolsa Aberta / Fechada) */}
            <div
              id="market-status-badge"
              title={`${marketStatus.label} - ${marketStatus.sublabel}`}
              className={`flex items-center gap-1.5 border px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl font-bold text-xs shadow-sm transition ${marketStatus.badgeClass}`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${marketStatus.dotClass}`}></span>
              <span className="leading-tight">{marketStatus.label}</span>
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                id="btn-lang-selector"
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 px-2.5 py-1 sm:py-1.5 rounded-xl font-bold text-xs text-slate-200 transition shadow-inner cursor-pointer"
                title="Select Language / Selecionar Idioma"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>{SUPPORTED_LANGUAGES.find((l) => l.code === language)?.flag || '🇺🇸'}</span>
                <span className="uppercase text-[11px]">
                  {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.code || 'EN'}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isLangMenuOpen ? 'rotate-180 text-blue-400' : ''}`} />
              </button>

              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl py-1.5 z-50 overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-800 flex items-center justify-between">
                      <span>Language / Idioma</span>
                      <span className="text-[9px] text-blue-400 font-normal">5 options</span>
                    </div>
                    <div className="p-1 space-y-0.5">
                      {SUPPORTED_LANGUAGES.map((lang) => {
                        const isSelected = language === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => {
                              setLanguage(lang.code);
                              setIsLangMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition text-left cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white font-bold shadow-sm'
                                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-base leading-none">{lang.flag}</span>
                              <div>
                                <div className="leading-tight">{lang.nativeName}</div>
                                <div className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                                  {lang.name}
                                </div>
                              </div>
                            </div>
                            <span
                              className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                                isSelected ? 'bg-blue-700/60 text-white' : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {lang.code}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sub-Header Row: Controls & Quick Actions (Well-spaced & responsive) */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80 flex-wrap sm:flex-nowrap">
          {/* Left Actions / Badges */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* ScienceBit Logo Badge */}
            <ScienceBitLogo variant="badge" size="sm" />

            {/* US Markets Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/90 border border-blue-500/30 px-2.5 py-1 rounded-lg text-blue-300 font-semibold text-xs">
              <span>🇺🇸</span>
              <span>US$ Wall Street</span>
            </div>

            {/* Clock */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/80 border border-slate-700/80 px-2.5 py-1 rounded-lg text-slate-300 text-xs">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-mono text-emerald-400 font-semibold">{timeStr || '--:--:--'}</span>
              <span className="text-[10px] text-slate-500">ET</span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap text-xs ml-auto">
            {/* Didactic Tutorial Modal Button */}
            <button
              id="btn-open-didactic-tutorial"
              type="button"
              onClick={onOpenTutorial}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 hover:from-blue-600/50 hover:to-indigo-600/50 border border-blue-400/50 text-blue-200 hover:text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl font-bold transition cursor-pointer shadow-md text-xs"
              title={language === 'pt' ? 'Abrir Instruções Didáticas e Passo a Passo' : 'Open Didactic Guide'}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'pt' ? 'Instruções Didáticas' : 'Didactic Guide'}</span>
              <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                {language === 'pt' ? 'Aprenda' : 'Learn'}
              </span>
            </button>

            {/* Quick Summary Accordion toggle button */}
            <button
              id="btn-toggle-guide"
              onClick={() => setGuiaAberto(!guiaAberto)}
              className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl font-medium transition cursor-pointer text-xs"
            >
              <span>{t('guideBtn')}</span>
              {guiaAberto ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Instalar na Google Play Store */}
            <a
              id="header-btn-install-playstore"
              href="https://play.google.com/store/apps/details?id=com.sciencebit.wallstreetscanner"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/50 hover:to-teal-600/50 border border-emerald-400/50 text-emerald-200 hover:text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl font-bold transition shadow-sm text-xs cursor-pointer"
              title="Instalar App Oficial diretamente na Google Play Store"
            >
              <svg className="w-3.5 h-3.5 shrink-0 fill-emerald-400" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a2.43 2.43 0 0 1-.61-.955V2.769c.146-.356.362-.68.61-.955zm11.238 11.24L17.2 15.41 5.372 22.19c.478.138.995.122 1.487-.156l11.988-6.98-3.999-3.999zm0-2.108l4-4L6.86 2.006c-.492-.28-1.01-.295-1.488-.157l11.828 6.78 1.648 1.417zm1.614 1.054l4.385 2.506c.74.423.74 1.114 0 1.537l-4.385 2.506-1.584-1.585 1.584-1.584-1.584-1.584 1.584-1.584z"/>
              </svg>
              <span>{language === 'pt' ? 'Instalar na Play Store' : 'Install on Play Store'}</span>
            </a>

            {/* WhatsApp Contact (+55 (62) 94263-2021) */}
            <a
              id="header-btn-whatsapp"
              href="https://wa.me/5562942632021?text=Ol%C3%A1%2C%20estou%20usando%20o%20Wall%20Street%20Scanner%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 hover:text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl font-bold transition shadow-sm text-xs cursor-pointer"
              title="Falar no WhatsApp: +55 (62) 94263-2021"
            >
              <svg className="w-3.5 h-3.5 fill-emerald-400 shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp</span>
              <span className="hidden xl:inline text-[10px] text-emerald-400 font-normal">
                (62) 94263-2021
              </span>
            </a>

            {/* Avaliar na Google Play */}
            <a
              id="header-btn-rate-playstore"
              href="https://play.google.com/store/apps/details?id=com.sciencebit.wallstreetscanner"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/50 text-amber-300 hover:text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl font-bold transition shadow-sm text-xs cursor-pointer"
              title="Avaliar no Google Play Store (5 Estrelas)"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
              <span>{language === 'pt' ? 'Avaliar App' : 'Rate App'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Expandable Guide */}
      <AnimatePresence>
        {guiaAberto && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-7xl mx-auto mt-3 pt-3 border-t border-slate-700/60 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 pb-2 text-xs">
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/60">
                <h4 className="font-bold text-blue-400 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  {t('guideIS')}
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {t('guideISDesc')}
                </p>
              </div>

              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/60">
                <h4 className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {t('guideRSI')}
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {t('guideRSIDesc')}
                </p>
              </div>

              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/60">
                <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  {t('guideFibo')}
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {t('guideFiboDesc')}
                </p>
              </div>

              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/60">
                <h4 className="font-bold text-indigo-400 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  {t('guideTriple')}
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {t('guideTripleDesc')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
