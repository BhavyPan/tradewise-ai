import { PortfolioOverview } from "@/components/trademind/PortfolioOverview";
import { MarketSentiment } from "@/components/trademind/MarketSentiment";
import { Watchlist } from "@/components/trademind/Watchlist";
import { StockSearch } from "@/components/trademind/StockSearch";
import { Sidebar } from "@/components/trademind/Sidebar";
import { TopBar } from "@/components/trademind/TopBar";

const Index = () => {
  return (
    <div className="min-h-screen flex bg-background bg-orb">
      <Sidebar />

      <main className="flex-1 p-5 md:p-8 max-w-[1400px] mx-auto w-full">
        <TopBar
          title="Dashboard"
          subtitle="Your portfolio at a glance."
        />

        {/* Portfolio hero + stats */}
        <PortfolioOverview />

        {/* Middle row: Market sentiment + Watchlist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          <div className="lg:col-span-1">
            <MarketSentiment />
          </div>
          <div className="lg:col-span-2">
            <Watchlist />
          </div>
        </div>

        {/* Stock search / AI lookup */}
        <StockSearch />

        <footer className="text-center text-xs text-muted-foreground py-6 mt-6 relative z-10">
          TradeMind AI · Live quotes via Yahoo Finance · Past performance ≠ future results.
        </footer>
      </main>
    </div>
  );
};

export default Index;
