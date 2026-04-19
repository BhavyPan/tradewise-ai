// Live stock data via Yahoo Finance public endpoints (no API key required).
// We proxy through a public CORS-friendly mirror to avoid browser CORS issues.

const QUOTE_URL = "https://query1.finance.yahoo.com/v7/finance/quote";
const SEARCH_URL = "https://query2.finance.yahoo.com/v1/finance/search";
// CORS proxy fallback (Yahoo blocks direct browser calls in many regions)
const PROXY = "https://corsproxy.io/?";

export type StockQuote = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  exchange: string;
  marketState: string;
  dayHigh?: number;
  dayLow?: number;
  open?: number;
  previousClose?: number;
  marketCap?: number;
  volume?: number;
};

export type SearchHit = {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
};

async function fetchJson(url: string) {
  const res = await fetch(PROXY + encodeURIComponent(url));
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function searchSymbols(query: string): Promise<SearchHit[]> {
  if (!query.trim()) return [];
  const data = await fetchJson(`${SEARCH_URL}?q=${encodeURIComponent(query)}&quotesCount=8&newsCount=0`);
  return (data.quotes || [])
    .filter((q: any) => q.symbol && q.quoteType !== "OPTION")
    .map((q: any) => ({
      symbol: q.symbol,
      name: q.shortname || q.longname || q.symbol,
      exchange: q.exchDisp || q.exchange || "",
      type: q.quoteType || "EQUITY",
    }));
}

export async function getQuote(symbol: string): Promise<StockQuote | null> {
  const data = await fetchJson(`${QUOTE_URL}?symbols=${encodeURIComponent(symbol)}`);
  const q = data?.quoteResponse?.result?.[0];
  if (!q) return null;
  return {
    symbol: q.symbol,
    name: q.longName || q.shortName || q.symbol,
    price: q.regularMarketPrice ?? 0,
    change: q.regularMarketChange ?? 0,
    changePercent: q.regularMarketChangePercent ?? 0,
    currency: q.currency || "USD",
    exchange: q.fullExchangeName || q.exchange || "",
    marketState: q.marketState || "",
    dayHigh: q.regularMarketDayHigh,
    dayLow: q.regularMarketDayLow,
    open: q.regularMarketOpen,
    previousClose: q.regularMarketPreviousClose,
    marketCap: q.marketCap,
    volume: q.regularMarketVolume,
  };
}

export function formatCurrency(value: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export function formatCompact(value?: number) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(value);
}
