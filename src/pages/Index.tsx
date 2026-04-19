import { Sidebar } from "@/components/trademind/Sidebar";
import { TopBar } from "@/components/trademind/TopBar";
import { StockSearch } from "@/components/trademind/StockSearch";

const Index = () => {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />

      <main className="flex-1 p-5 md:p-8 max-w-[1400px] mx-auto w-full">
        <TopBar
          title="Search any real-world stock"
          subtitle="Type a company or ticker to see live market data."
        />

        <StockSearch />

        <footer className="text-center text-xs text-muted-foreground py-6 mt-6">
          TradeMind AI · Live quotes via Yahoo Finance · Past performance ≠ future results.
        </footer>
      </main>
    </div>
  );
};

export default Index;
