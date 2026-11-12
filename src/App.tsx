import React, { useState, useEffect, useMemo } from 'react';
import { Download, FileText, BookOpen, ChevronDown, ChevronUp, CheckCircle2, Lightbulb, HelpCircle, Star } from 'lucide-react';
import { Header } from './components/Header';
import { ScannerFilters } from './components/ScannerFilters';
import { OpportunitiesTable } from './components/OpportunitiesTable';
import { AssetDetailPanel, TabType } from './components/AssetDetailPanel';
import { ScienceBitLogo } from './components/ScienceBitLogo';
import { PlayStoreKitModal } from './components/PlayStoreKitModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { DidacticTutorialModal } from './components/DidacticTutorialModal';
import { PlayStoreBanner } from './components/PlayStoreBanner';
import { FloatingSupportMenu } from './components/FloatingSupportMenu';
import { AppIcon } from './components/AppIcon';
import { useLanguage } from './i18n/LanguageContext';
import { downloadWebIntoAppZip } from './utils/downloadHelper';

import {
  AssetClass,
  AssetOpportunity,
  HistoricalCandle,
  FibonacciLevels,
  TripleScreenResult,
  MinerviniResult,
  MLPredictionResult,
  RLAgentResult,
  FlowResult,
  FundamentalsData,
  NewsArticle,
  BacktestResult,
  MarketType,
  MarketUniverse,
  USUniverse
} from './types';

import {
  enrichCandles,
  calculateFibonacci,
  calculateTripleScreen,
  calculateMinervini,
  calculateFlow,
  calculateMLPrediction,
  calculateRLAgent,
  runScannerBacktest
} from './utils/indicators';
import { getSectorStyle } from './utils/sectorUtils';
import { getApiUrl } from './utils/api';
import {
  getOfflineOpportunities,
  getOfflineCandles,
  getOfflineFundamentals,
  getOfflineNews
} from './utils/offlineFallback';

import {
  Activity,
  Award,
  BarChart2,
  Bot,
  Brain,
  ChevronRight,
  Compass,
  History,
  Info,
  Landmark,
  Layers,
  Newspaper,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
  Globe,
  ExternalLink
} from 'lucide-react';

export const App: React.FC = () => {
  const { t, language } = useLanguage();
  const isPt = language === 'pt';

  // Market Selection (USA is the only market)
  const [market] = useState<MarketType>('usa');
  const [selectedUSUniverse, setSelectedUSUniverse] = useState<USUniverse>('all');
  const [showDidacticBanner, setShowDidacticBanner] = useState<boolean>(true);

  // Filters State
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [filterEMA20, setFilterEMA20] = useState<boolean>(false);
  const [filterEMA50, setFilterEMA50] = useState<boolean>(false);
  const [filterEMA200, setFilterEMA200] = useState<boolean>(false);
  const [minLiquidez, setMinLiquidez] = useState<number>(1);
  const [showBacktests, setShowBacktests] = useState<boolean>(false);

  // Scanner Data State (initialized immediately with curated offline data so screen is never blank)
  const [opportunities, setOpportunities] = useState<AssetOpportunity[]>(() => getOfflineOpportunities('all'));
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [isKitModalOpen, setIsKitModalOpen] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        const p = new URLSearchParams(window.location.search);
        return p.get('kit') === '1' || p.get('admin') === '1' || p.get('download') === '1';
      }
    } catch {
      // ignore
    }
    return false;
  });
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<boolean>(false);

  // Auto-download zip if requested via developer URL parameter (?download=1 or ?zip=1)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const p = new URLSearchParams(window.location.search);
        if (p.get('download') === '1' || p.get('zip') === '1') {
          const success = downloadWebIntoAppZip();
          if (success) {
            setDownloadSuccessToast(true);
            setTimeout(() => setDownloadSuccessToast(false), 8000);
          }
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Active Asset Analysis State
  const [timeframe, setTimeframe] = useState<string>('1d');
  const [activeTab, setActiveTab] = useState<
    'grafico' | 'triplescreen' | 'minervini' | 'flow' | 'ml' | 'rl' | 'backtest' | 'fundamentalista' | 'noticias'
  >('grafico');

  const [candles, setCandles] = useState<HistoricalCandle[]>(() => enrichCandles(getOfflineCandles('NVDA', '1d')));
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [fundamentals, setFundamentals] = useState<FundamentalsData | null>(() => getOfflineFundamentals('NVDA'));
  const [news, setNews] = useState<NewsArticle[]>(() => getOfflineNews('NVDA'));

  // Fetch opportunities scanner with graceful offline fallback
  const fetchScanner = async () => {
    setIsScanning(true);
    try {
      const res = await fetch(getApiUrl('/api/scan'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          market: 'usa',
          universe: selectedUSUniverse
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          setOpportunities(json.data);
          if (selectedTicker) {
            const hasCurrent = json.data.some((d: AssetOpportunity) => d.Ticker === selectedTicker);
            if (!hasCurrent) {
              setSelectedTicker(null);
            }
          }
          return;
        }
      }
      setOpportunities(getOfflineOpportunities(selectedUSUniverse));
    } catch (err) {
      console.warn('Usando base local do scanner:', err);
      setOpportunities(getOfflineOpportunities(selectedUSUniverse));
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    fetchScanner();
  }, [selectedUSUniverse]);

  // Fetch selected ticker historical candles and details with graceful offline fallback
  useEffect(() => {
    if (!selectedTicker) return;

    let isMounted = true;
    setIsLoadingHistory(true);

    const loadData = async () => {
      try {
        // Fetch historical candles with market param
        let loadedCandles = false;
        try {
          const histRes = await fetch(
            getApiUrl(`/api/history/${selectedTicker}?timeframe=${timeframe}&range=1y&market=${market}`)
          );
          if (histRes.ok && isMounted) {
            const histJson = await histRes.json();
            if (histJson.candles && Array.isArray(histJson.candles) && histJson.candles.length > 0) {
              const enriched = enrichCandles(histJson.candles);
              setCandles(enriched);
              loadedCandles = true;
            }
          }
        } catch {
          // Handled by offline fallback below
        }

        if (!loadedCandles && isMounted) {
          setCandles(enrichCandles(getOfflineCandles(selectedTicker, timeframe)));
        }

        // Fetch fundamentals
        let loadedFund = false;
        try {
          const fundRes = await fetch(getApiUrl(`/api/fundamentals/${selectedTicker}?market=${market}`));
          if (fundRes.ok && isMounted) {
            const fundJson = await fundRes.json();
            setFundamentals(fundJson);
            loadedFund = true;
          }
        } catch {
          // Handled by offline fallback below
        }
        if (!loadedFund && isMounted) {
          setFundamentals(getOfflineFundamentals(selectedTicker));
        }

        // Fetch news
        let loadedNews = false;
        try {
          const newsRes = await fetch(getApiUrl(`/api/news/${selectedTicker}?market=${market}`));
          if (newsRes.ok && isMounted) {
            const newsJson = await newsRes.json();
            if (newsJson.artigos && newsJson.artigos.length > 0) {
              setNews(newsJson.artigos);
              loadedNews = true;
            }
          }
        } catch {
          // Handled by offline fallback below
        }
        if (!loadedNews && isMounted) {
          setNews(getOfflineNews(selectedTicker));
        }
      } catch (err) {
        console.warn(`Fallback local para ${selectedTicker}:`, err);
      } finally {
        if (isMounted) setIsLoadingHistory(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [selectedTicker, timeframe, market]);

  // Available Sectors with counts
  const availableSectors = useMemo(() => {
    const counts: Record<string, number> = {};
    opportunities.forEach((op) => {
      const s = op.Setor || 'Outros';
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [opportunities]);

  // Filtered Opportunities List
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((op) => {
      if (selectedSector !== 'all' && (op.Setor || 'Outros') !== selectedSector) return false;
      if (op.Liquidez < minLiquidez) return false;
      if (filterEMA20 && (!op.EMA20 || typeof op.EMA20 !== 'number' || isNaN(op.EMA20) || op.Preco <= op.EMA20)) return false;
      if (filterEMA50 && (!op.EMA50 || typeof op.EMA50 !== 'number' || isNaN(op.EMA50) || op.Preco <= op.EMA50)) return false;
      if (filterEMA200 && (!op.EMA200 || typeof op.EMA200 !== 'number' || isNaN(op.EMA200) || op.Preco <= op.EMA200)) return false;
      return true;
    });
  }, [opportunities, selectedSector, minLiquidez, filterEMA20, filterEMA50, filterEMA200]);

  // Selected Opportunity Object
  const selectedOpp = useMemo(() => {
    return filteredOpportunities.find((o) => o.Ticker === selectedTicker) || filteredOpportunities[0] || null;
  }, [filteredOpportunities, selectedTicker]);

  // Computed Indicators for Active Asset
  const fibonacci: FibonacciLevels = useMemo(() => {
    return calculateFibonacci(candles);
  }, [candles]);

  const tripleScreen: TripleScreenResult = useMemo(() => {
    return calculateTripleScreen(candles);
  }, [candles]);

  const minervini: MinerviniResult = useMemo(() => {
    return calculateMinervini(candles);
  }, [candles]);

  const flowResult: FlowResult = useMemo(() => {
    return calculateFlow(candles);
  }, [candles]);

  const mlPrediction: MLPredictionResult = useMemo(() => {
    return calculateMLPrediction(candles, selectedTicker || 'ATIVO', 5);
  }, [candles, selectedTicker]);

  const rlAgent: RLAgentResult = useMemo(() => {
    return calculateRLAgent(candles, selectedTicker || 'ATIVO');
  }, [candles, selectedTicker]);

  const backtestData: BacktestResult = useMemo(() => {
    return runScannerBacktest(candles);
  }, [candles]);

  const isOfflineApp = typeof window !== 'undefined' && (
    window.location.protocol === 'file:' ||
    window.location.protocol === 'capacitor:' ||
    window.location.origin === 'null' ||
    window.location.origin.startsWith('file:') ||
    Boolean((window as any).Capacitor?.isNativePlatform?.())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Developer Download Bar - Only rendered in browser/preview, 100% hidden in the installed mobile APK (file: protocol) */}
      {!isOfflineApp && (
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-blue-500/40 text-blue-200 text-xs px-3 sm:px-6 py-2 flex items-center justify-between gap-3 z-50">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase">Dev</span>
            <span className="font-semibold text-slate-200 text-xs">Área do Desenvolvedor</span>
            <span className="text-slate-400 hidden md:inline text-[11px]">• Oculto no celular dos usuários</span>
          </div>
          <button
            id="dev-top-download-zip"
            type="button"
            onClick={() => downloadWebIntoAppZip()}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded-lg transition shadow-md cursor-pointer text-xs active:scale-95"
            title="Baixar pacote ZIP offline atualizado com todas as 230+ quedas e gráfico em linha"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Baixar ZIP WebIntoApp (350 KB)</span>
          </button>
        </div>
      )}

      {/* Toast Notification for In-Memory ZIP Download */}
      {downloadSuccessToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300 text-xs sm:text-sm border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span>✓ Arquivo wallstreet-scanner-webintoapp.zip baixado com sucesso na sua pasta Downloads!</span>
        </div>
      )}

      {/* Official Google Play Store Banner */}
      <PlayStoreBanner />

      {/* Top Navigation Header */}
      <Header
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Scanner Filters */}
        <ScannerFilters
          selectedUSUniverse={selectedUSUniverse}
          onSelectUSUniverse={setSelectedUSUniverse}
          selectedSector={selectedSector}
          setSelectedSector={setSelectedSector}
          availableSectors={availableSectors}
          filterEMA20={filterEMA20}
          setFilterEMA20={setFilterEMA20}
          filterEMA50={filterEMA50}
          setFilterEMA50={setFilterEMA50}
          filterEMA200={filterEMA200}
          setFilterEMA200={setFilterEMA200}
          minLiquidez={minLiquidez}
          setMinLiquidez={setMinLiquidez}
          showBacktests={showBacktests}
          setShowBacktests={setShowBacktests}
          isScanning={isScanning}
          onRefresh={fetchScanner}
          totalFiltered={filteredOpportunities.length}
          totalTotal={opportunities.length}
        />

        {/* Didactic Quick-Guide & Educational Instruction Banner */}
        {showDidacticBanner ? (
          <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/30 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                      <span>{isPt ? 'Instruções Didáticas: Como Usar o Scanner em 3 Passos' : 'Didactic Guide: How to Use the Scanner in 3 Steps'}</span>
                    </h3>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {isPt ? 'Guia Prático' : 'Quick Guide'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {isPt
                      ? 'Dicas práticas para identificar repiques de alta probabilidade e operar com gestão de risco'
                      : 'Practical tips to spot high-probability swing trade bounces with solid risk control'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                <button
                  type="button"
                  id="btn-banner-open-tutorial"
                  onClick={() => setIsTutorialOpen(true)}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-md transition cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isPt ? 'Abrir Tutorial Completo' : 'Open Full Tutorial'}</span>
                </button>
                <button
                  type="button"
                  id="btn-banner-dismiss"
                  onClick={() => setShowDidacticBanner(false)}
                  className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                  title={isPt ? 'Minimizar Dicas' : 'Minimize Tips'}
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3 Didactic Steps Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3.5 text-xs">
              <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-3 hover:border-blue-500/40 transition">
                <div className="flex items-center gap-2 text-blue-400 font-bold mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[11px] font-mono font-bold">1</span>
                  <span>{isPt ? 'Filtrar Sobrevenda (IS)' : 'Filter Oversold (IS)'}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {isPt
                    ? 'Observe a coluna IS (Índice de Sobrevenda). Valores > 70 ou IFR(14) < 30 indicam ativos excessivamente descontados com alta pressão de repique comprador.'
                    : 'Watch the IS (Oversold Index) column. Scores > 70 or RSI(14) < 30 indicate heavily discounted assets primed for a technical bounce.'}
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-3 hover:border-emerald-500/40 transition">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[11px] font-mono font-bold">2</span>
                  <span>{isPt ? 'Validar Suporte & Fibonacci' : 'Validate Support & Fibonacci'}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {isPt
                    ? 'Clique no ativo para abrir o gráfico. Verifique se o preço repousa sobre a EMA 20/50/200 ou retração de 61.8% de Fibonacci, criando uma barreira de proteção.'
                    : 'Click any asset to open chart analysis. Confirm if the price rests near EMA 20/50/200 or 61.8% Fibonacci, forming a solid technical floor.'}
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-3 hover:border-amber-500/40 transition">
                <div className="flex items-center gap-2 text-amber-400 font-bold mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[11px] font-mono font-bold">3</span>
                  <span>{isPt ? 'Triple Screen de Elder' : 'Triple Screen Strategy'}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {isPt
                    ? 'Acesse a aba Triple Screen: só compre quando a maré semanal for de alta (EMA semanal subindo) e a onda diária estiver em sobrevenda com gatilho de entrada.'
                    : 'Access the Triple Screen tab: enter long only when weekly tide is bullish (rising EMA) and daily wave reaches oversold with an entry trigger.'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowDidacticBanner(true)}
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{isPt ? 'Mostrar Instruções Didáticas Rápidas' : 'Show Quick Didactic Guide'}</span>
            </button>
          </div>
        )}

        {/* Tabela de Oportunidades com Gráfico e Painel Expansível Diretamente Abaixo da Linha do Ativo */}
        <OpportunitiesTable
          opportunities={filteredOpportunities}
          selectedTicker={selectedTicker}
          onSelectTicker={(t) => setSelectedTicker(t)}
          selectedSector={selectedSector}
          onSelectSector={setSelectedSector}
          availableSectors={availableSectors}
          renderDetailPanel={(opp) => (
            <AssetDetailPanel
              selectedOpp={opp}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              candles={candles}
              fibonacci={fibonacci}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              tripleScreen={tripleScreen}
              minervini={minervini}
              flowResult={flowResult}
              mlPrediction={mlPrediction}
              rlAgent={rlAgent}
              backtestData={backtestData}
              fundamentals={fundamentals}
              news={news}
              onClose={() => setSelectedTicker(null)}
            />
          )}
        />
      </main>

      {/* Footer & Regulatory / Educational Disclaimer */}
      <footer className="mt-12 border-t border-slate-800 bg-slate-900/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex flex-wrap items-center gap-2.5">
              <AppIcon
                size={28}
                className="w-7 h-7 rounded-lg flex-shrink-0 shadow-sm p-0.5"
              />
              <span className="font-semibold text-slate-200">
                Wall Street Scanner Pro (S&P 500, Nasdaq, NYSE, ETFs)
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">{t('appSubtitle')}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <ScienceBitLogo variant="badge" size="sm" />
              <span
                id="footer-btn-version-kit"
                onClick={() => setIsKitModalOpen(true)}
                title="Kit de Assets da Google Play Store"
                className="bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-slate-600 text-slate-300 px-2.5 py-1 rounded-lg font-medium text-[11px] cursor-pointer transition select-none"
              >
                Versão 2.0 Wall Street Pro
              </span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <button
                id="footer-btn-tutorial"
                type="button"
                onClick={() => setIsTutorialOpen(true)}
                className="inline-flex items-center gap-1.5 text-blue-300 hover:text-white transition text-[11px] font-bold bg-blue-900/30 hover:bg-blue-800/50 border border-blue-500/40 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                <BookOpen className="w-3 h-3 text-blue-400" />
                <span>Instruções Didáticas</span>
              </button>
              {/* WhatsApp Contact */}
              <a
                id="footer-btn-whatsapp"
                href="https://wa.me/5562942632021?text=Ol%C3%A1%2C%20estou%20usando%20o%20Wall%20Street%20Scanner%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-white transition text-[11px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-lg cursor-pointer"
                title="Suporte no WhatsApp: +55 (62) 94263-2021"
              >
                <svg className="w-3.5 h-3.5 fill-emerald-400 shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>WhatsApp (62) 94263-2021</span>
              </a>

              {/* Instalar na Google Play */}
              <a
                id="footer-btn-install-playstore"
                href="https://play.google.com/store/apps/details?id=com.sciencebit.wallstreetscanner"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-300 hover:text-white transition text-[11px] font-bold bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 px-2.5 py-1 rounded-lg cursor-pointer"
                title="Instalar App Oficial diretamente na Google Play Store"
              >
                <svg className="w-3.5 h-3.5 fill-blue-400 shrink-0" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a2.43 2.43 0 0 1-.61-.955V2.769c.146-.356.362-.68.61-.955zm11.238 11.24L17.2 15.41 5.372 22.19c.478.138.995.122 1.487-.156l11.988-6.98-3.999-3.999zm0-2.108l4-4L6.86 2.006c-.492-.28-1.01-.295-1.488-.157l11.828 6.78 1.648 1.417zm1.614 1.054l4.385 2.506c.74.423.74 1.114 0 1.537l-4.385 2.506-1.584-1.585 1.584-1.584-1.584-1.584 1.584-1.584z"/>
                </svg>
                <span>Instalar no Google Play</span>
              </a>

              {/* Avaliar na Google Play */}
              <a
                id="footer-btn-rate-playstore"
                href="https://play.google.com/store/apps/details?id=com.sciencebit.wallstreetscanner"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-amber-300 hover:text-white transition text-[11px] font-bold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/40 px-2.5 py-1 rounded-lg cursor-pointer"
                title="Avaliar no Google Play Store"
              >
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                <span>Avaliar App ⭐⭐⭐⭐⭐</span>
              </a>

              <button
                id="footer-btn-privacy"
                type="button"
                onClick={() => setIsPrivacyModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition text-[11px] font-medium bg-slate-800 hover:bg-slate-750 border border-slate-700 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                <FileText className="w-3 h-3 text-blue-400" />
                <span>Política de Privacidade</span>
              </button>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="text-slate-400">
                © {new Date().getFullYear()} ScienceBit Computer. Todos os direitos reservados.
              </span>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 text-[11px] leading-relaxed text-slate-400">
            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-750">
              <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                <span>⚠️ {t('disclaimerTitle')}</span>
              </p>
              <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded">
                Finalidade Educacional
              </span>
            </div>
            <p>
              {t('disclaimerText')}
            </p>
            <p className="mt-1.5">
              <strong>Fontes de Dados &amp; Moedas:</strong> Cotações em dólares (US$) com dados de Wall Street (S&P 500, Nasdaq 100, Dow Jones, Russell 2000 e ETFs setoriais).
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Support & Quick Rating Menu */}
      <FloatingSupportMenu />

      {/* Didactic Tutorial Modal */}
      <DidacticTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

      {/* Play Store Assets Modal (Internal / Admin fallback only) */}
      {isKitModalOpen && (
        <PlayStoreKitModal
          isOpen={isKitModalOpen}
          onClose={() => setIsKitModalOpen(false)}
          appUrl={typeof window !== 'undefined' ? window.location.origin : ''}
        />
      )}

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
};
