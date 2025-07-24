import { StockChecker } from "@/components/stock-checker";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-sky-100 to-purple-100 dark:from-slate-900 dark:via-emerald-900/30 dark:to-purple-900/30">
      <StockChecker />
    </div>
  );
}
