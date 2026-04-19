import { Search, Loader2, TrendingUp, TrendingDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { searchSymbols, getQuote, formatCurrency, formatCompact, StockQuote, SearchHit } from "@/lib/stocks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const StockSearch = () => {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setHits([]);
      return;
    }
    setSearching(true);
    debounceRef.current = window.setTimeout(async () => {
      try {
        const results = await searchSymbols(query);
        setHits(results);
        setOpen(true);
      } catch {
        toast.error("Search failed. Please try again.");
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query]);

  const pick = async (hit: SearchHit) => {
    setOpen(false);
    setQuery(hit.symbol);
    setLoadingQuote(true);
    setQuote(null);
    try {
      const q = await getQuote(hit.symbol);
      if (!q) {
        toast.error("No live data available for this symbol.");
        return;
      }
      setQuote(q);
    } catch {
      toast.error("Couldn't fetch live price.");
    } finally {
      setLoadingQuote(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (hits[0]) return pick(hits[0]);
    setLoadingQuote(true);
    try {
      const q = await getQuote(query.trim().toUpperCase());
      if (!q) toast.error("Symbol not found.");
      else setQuote(q);
    } finally {
      setLoadingQuote(false);
    }
  };

  const up = (quote?.change ?? 0) >= 0;

  return (
    <div className="rounded-3xl bg-card border border-border shadow-sm p-5 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <Search className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-bold text-base leading-tight">Live stock lookup</h3>
          <p className="text-xs text-muted-foreground">Search any real-world ticker (e.g. AAPL, TSLA, RELIANCE.NS)</p>
        </div>
      </div>

      <form onSubmit={submit} className="relative">
        <div className="flex items-center gap-2 bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-primary/40">
          {searching ? <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" /> : <Search className="w-4 h-4 text-muted-foreground" />}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => hits.length && setOpen(true)}
            placeholder="Search Apple, NVDA, BTC-USD…"
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); setQuote(null); setHits([]); }} aria-label="Clear">
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {open && hits.length > 0 && (
          <div className="absolute z-20 mt-2 w-full rounded-xl bg-popover border border-border shadow-float overflow-hidden">
            {hits.map((h) => (
              <button
                key={h.symbol}
                type="button"
                onClick={() => pick(h)}
                className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-secondary transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{h.symbol} · <span className="text-muted-foreground font-normal">{h.name}</span></p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{h.type} · {h.exchange}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </form>

      <div className="mt-5">
        {loadingQuote && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" /> Fetching live price…
          </div>
        )}

        {!loadingQuote && !quote && (
          <div className="text-center text-sm text-muted-foreground py-10 border border-dashed border-border rounded-xl">
            Search for a stock to see its real-time price.
          </div>
        )}

        {!loadingQuote && quote && (
          <div className="rounded-2xl bg-gradient-card border border-border p-5">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{quote.exchange} · {quote.marketState}</p>
                <h2 className="text-xl font-bold mt-1">{quote.name}</h2>
                <p className="text-xs text-muted-foreground font-mono">{quote.symbol}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold font-mono">{formatCurrency(quote.price, quote.currency)}</p>
                <p className={cn("text-sm font-semibold flex items-center gap-1 justify-end mt-0.5", up ? "text-success" : "text-danger")}>
                  {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {up ? "+" : ""}{quote.change.toFixed(2)} ({up ? "+" : ""}{quote.changePercent.toFixed(2)}%)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              {[
                ["Open", quote.open != null ? formatCurrency(quote.open, quote.currency) : "—"],
                ["Prev close", quote.previousClose != null ? formatCurrency(quote.previousClose, quote.currency) : "—"],
                ["Day high", quote.dayHigh != null ? formatCurrency(quote.dayHigh, quote.currency) : "—"],
                ["Day low", quote.dayLow != null ? formatCurrency(quote.dayLow, quote.currency) : "—"],
                ["Volume", formatCompact(quote.volume)],
                ["Mkt cap", formatCompact(quote.marketCap)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-secondary/50 border border-border p-3">
                  <p className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{k}</p>
                  <p className="font-bold font-mono mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
