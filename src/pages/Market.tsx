import { Sidebar } from "@/components/trademind/Sidebar";
import { TopBar } from "@/components/trademind/TopBar";
import { MarketSentiment } from "@/components/trademind/MarketSentiment";
import { Watchlist } from "@/components/trademind/Watchlist";
import { TrendingUp, TrendingDown, Flame } from "lucide-react";

const trending = [
  { sym: "NVDA", name: "Nvidia", change: 4.82, vol: "82M" },
  { sym: "META", name: "Meta", change: 3.21, vol: "45M" },
  { sym: "GOOGL", name: "Alphabet", change: 2.14, vol: "32M" },
  { sym: "TSLA", name: "Tesla", change: -2.15, vol: "97M" },
  { sym: "AMD", name: "AMD", change: -1.45, vol: "58M" },
  { sym: "NFLX", name: "Netflix", change: 1.88, vol: "21M" },
];

const Market = () => (
  <div className="min-h-screen flex bg-background">
    <Sidebar />
    <main className="flex-1 p-5 md:p-8 max-w-[1400px] mx-auto w-full">
      <TopBar title="Market Analysis" subtitle="Trending stocks, indicators and sentiment." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2 rounded-3xl bg-card border border-border shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
              <Flame className="w-4 h-4 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-bold">Trending today</h3>
              <p className="text-xs text-muted-foreground">Highest volume movers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trending.map((t) => {
              const up = t.change >= 0;
              return (
                <div key={t.sym} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 hover:bg-secondary transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-card flex items-center justify-center text-xs font-bold border border-border">
                      {t.sym.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.sym}</p>
                      <p className="text-xs text-muted-foreground">Vol {t.vol}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold flex items-center gap-1 ${up ? "text-success" : "text-danger"}`}>
                    {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {up ? "+" : ""}{t.change}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <MarketSentiment />
      </div>

      <Watchlist />
    </main>
  </div>
);

export default Market;
