import { AssetOpportunity, HistoricalCandle, FundamentalsData, NewsArticle, USUniverse, AssetClass } from '../types';
import { US_MARKET_CURATED } from '../data/usMarketData';

export function getOfflineOpportunities(universe: USUniverse = 'all'): AssetOpportunity[] {
  let list = US_MARKET_CURATED;
  if (universe === 'sp500') {
    list = list.filter((a) => a.index === 'S&P 500');
  } else if (universe === 'nasdaq') {
    list = list.filter((a) => a.exchange === 'NASDAQ');
  } else if (universe === 'nyse') {
    list = list.filter((a) => a.exchange === 'NYSE');
  } else if (universe === 'etf') {
    list = list.filter((a) => a.isEtf);
  }

  return list.map((a) => {
    const isOver = Math.round(100 - a.rsi);
    const score = Number((7.5 + (isOver / 100) * 2.3).toFixed(1));
    const fechamentoAnt = Number((a.close / (1 + a.change / 100)).toFixed(2));
    const classe: AssetClass = a.isEtf ? 'ETF' : a.exchange === 'NASDAQ' ? 'Nasdaq' : 'S&P 500';

    const potencial: 'Muito Alta' | 'Alta' | 'Média' = score >= 9.0 ? 'Muito Alta' : score >= 8.0 ? 'Alta' : 'Média';

    return {
      Ticker: a.ticker,
      Empresa: a.name,
      Classe: classe,
      Setor: a.sector,
      Preco: a.close,
      Fechamento_Anterior: fechamentoAnt,
      Variacao_Abs: Number((a.close - fechamentoAnt).toFixed(2)),
      Volume: a.vol,
      Queda_Dia: a.change,
      Gap: a.gap,
      IS: isOver,
      RSI14: a.rsi,
      Stoch: a.stoch,
      Potencial: potencial,
      Score: score,
      Sinais: a.rsi < 30 ? 'RSI Sobrevendido • Suporte Fibo 61.8%' : 'Estocástico Gatilho • EMA 200',
      Explicacoes: [
        `RSI(14) em ${a.rsi} indica exaustão de baixa no timeframe diário.`,
        `Preço testando zona de suporte relevante com assimetria favorável para Swing Trade.`,
        `Filtro de tendência primária e médias móveis institucionais alinhadas.`
      ],
      Liquidez: a.vol > 3000000000 ? 10 : a.vol > 1000000000 ? 9 : 8,
      EMA20: a.ema20,
      EMA50: a.ema50,
      EMA200: a.ema200,
      exchange: a.exchange,
      index: a.index,
      currency: 'USD' as const
    };
  }).sort((a, b) => b.IS - a.IS);
}

export function getOfflineCandles(ticker: string, timeframe: string = '1d'): HistoricalCandle[] {
  const asset = US_MARKET_CURATED.find((a) => a.ticker === ticker) || {
    ticker,
    close: 100,
    change: 1.5,
    ema20: 102,
    ema50: 98,
    ema200: 90
  };

  const count = 90;
  const candles: HistoricalCandle[] = [];
  const basePrice = asset.close * 0.85;
  let current = basePrice;
  const now = new Date();

  // Create an uptrend that pulls back to Fibonacci 61.8% and forms a confirmation hammer
  for (let i = count; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    const timestamp = Math.floor(d.getTime() / 1000);

    // Progression: rally for 60 bars, pullback for 25 bars, final reversal hammer today
    let delta = 0;
    if (i > 30) {
      // Uptrend phase
      delta = (Math.random() - 0.42) * (current * 0.025);
    } else if (i > 3) {
      // Pullback phase into Fibo support
      delta = (Math.random() - 0.65) * (current * 0.022);
    } else if (i === 0) {
      // Today: Reversal Hammer with long lower shadow
      const open = asset.close * 0.99;
      const low = asset.close * 0.965; // long lower wick!
      const high = asset.close * 1.008;
      const close = asset.close;
      const vol = 45000000;
      candles.push({
        date: dateStr,
        timestamp,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: vol
      });
      break;
    } else {
      // Consolidation right at support
      delta = (Math.random() - 0.45) * (current * 0.015);
    }

    current = Math.max(current * 0.6, current + delta);
    const spread = current * 0.02;
    const open = current - spread * (Math.random() - 0.5);
    const close = current;
    const high = Math.max(open, close) + spread * Math.random();
    const low = Math.min(open, close) - spread * Math.random();
    const vol = Math.floor(25000000 + Math.random() * 30000000);

    candles.push({
      date: dateStr,
      timestamp,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: vol
    });
  }

  return candles;
}

export function getOfflineFundamentals(ticker: string): FundamentalsData {
  const asset = US_MARKET_CURATED.find((a) => a.ticker === ticker);
  const mktCap = asset ? asset.vol * 450 : 1850000000000;

  return {
    score: 8.8,
    fonte: 'ScienceBit Quant Engine',
    ticker_fonte: ticker,
    pe_ratio: 28.5,
    market_cap: mktCap,
    dividend_yield: 0.85,
    revenue_growth: 14.5,
    recomendacao: 'COMPRA FORTE',
    setor: asset?.sector || 'Tecnologia'
  };
}

export function getOfflineNews(ticker: string): NewsArticle[] {
  return [
    {
      titulo: `${ticker}: Análise Quantitativa Identifica Nível Chave de Reversão em Suporte Institucional`,
      fonte: 'Wall Street Journal • Markets',
      link: 'https://finance.yahoo.com',
      dt: 'Hoje',
      resumo: 'Ativo atinge zona de sobrevenda extrema com forte confluência de suporte em médias móveis e Fibonacci.',
      sentimento: {
        label: 'Positivo',
        score: 0.85
      }
    },
    {
      titulo: `Fluxo Institucional Acelera em Ações Americanas após Correção Técnica`,
      fonte: 'Bloomberg Terminal Report',
      link: 'https://finance.yahoo.com',
      dt: 'Ontem',
      resumo: 'Grandes fundos iniciam posicionamento comprador em empresas líderes com balanço sólido.',
      sentimento: {
        label: 'Positivo',
        score: 0.78
      }
    },
    {
      titulo: `Perspectivas de Lucro e Projeção de Retorno para Swing Trade no S&P 500`,
      fonte: 'ScienceBit Quantitative Analysis',
      link: 'https://sciencebit.com.br',
      dt: 'Ontem',
      resumo: 'Modelo de Machine Learning projeta assimetria favorável para os próximos 5 dias de negociação.',
      sentimento: {
        label: 'Positivo',
        score: 0.92
      }
    }
  ];
}
