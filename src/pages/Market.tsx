import { Sidebar } from "@/components/trademind/Sidebar";
import { TopBar } from "@/components/trademind/TopBar";
import { StockSearch } from "@/components/trademind/StockSearch";

const Market = () => (
  <div className="min-h-screen flex bg-background">
    <Sidebar />
    <main className="flex-1 p-5 md:p-8 max-w-[1400px] mx-auto w-full">
      <TopBar title="Market Lookup" subtitle="Search any real-world stock for live pricing." />
      <StockSearch />
    </main>
  </div>
);

export default Market;
