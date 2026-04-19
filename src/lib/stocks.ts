import { supabase } from "@/integrations/supabase/client";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stocks`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

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

async function callFn(params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${FN_URL}?${qs}`, {
    headers: { Authorization: `Bearer ${ANON}`, apikey: ANON },
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function searchSymbols(query: string): Promise<SearchHit[]> {
  if (!query.trim()) return [];
  const data = await callFn({ action: "search", q: query });
  return (data.quotes || [])
    .filter((q: any) => q.symbol && q.quoteType !== "OPTION")
    .map((q: any) => ({
      symbol: q.symbol,
      name: q.shortname || q.longname || q.symbol,
      exchange: q.exchDisp || q.exchange || "",
      type: q.quoteType || "EQUITY",
    }));
}

export type HistoryPoint = { t: number; close: number };
export type QuoteResult = { quote: StockQuote; history: HistoryPoint[] };

export async function getQuote(symbol: string): Promise<QuoteResult | null> {
  const data = await callFn({ action: "quote", symbols: symbol });
  const r = data?.chart?.result?.[0];
  const meta = r?.meta;
  if (!meta) return null;
  const price = meta.regularMarketPrice ?? 0;
  const prev = meta.chartPreviousClose ?? meta.previousClose ?? price;
  const change = price - prev;
  const changePercent = prev ? (change / prev) * 100 : 0;

  const timestamps: number[] = r.timestamp || [];
  const closes: (number | null)[] = r.indicators?.quote?.[0]?.close || [];
  const history: HistoryPoint[] = timestamps
    .map((t, i) => ({ t: t * 1000, close: closes[i] as number }))
    .filter((p) => typeof p.close === "number");

  return {
    quote: {
      symbol: meta.symbol,
      name: meta.longName || meta.shortName || meta.symbol,
      price,
      change,
      changePercent,
      currency: meta.currency || "USD",
      exchange: meta.fullExchangeName || meta.exchangeName || "",
      marketState: meta.marketState || "",
      dayHigh: meta.regularMarketDayHigh,
      dayLow: meta.regularMarketDayLow,
      open: meta.regularMarketOpen ?? meta.chartPreviousClose,
      previousClose: prev,
      marketCap: undefined,
      volume: meta.regularMarketVolume,
    },
    history,
  };
}

export type AIRecommendation = {
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;
  risk: "Low" | "Medium" | "High";
  hold: string;
  reason: string;
};

export async function getRecommendation(quote: StockQuote, history: HistoryPoint[]): Promise<AIRecommendation> {
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stock-recommendation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ANON}`,
      apikey: ANON,
    },
    body: JSON.stringify({ quote, history: history.map((h) => h.close) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `Failed (${res.status})`);
  return data;
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

// Keep supabase import to ensure client init side-effects load
void supabase;
