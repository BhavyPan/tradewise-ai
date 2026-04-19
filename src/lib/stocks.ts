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

export async function getQuote(symbol: string): Promise<StockQuote | null> {
  const data = await callFn({ action: "quote", symbols: symbol });
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

// Keep supabase import to ensure client init side-effects load
void supabase;
