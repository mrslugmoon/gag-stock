import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "./countdown-timer";
import { StockCard } from "./stock-card";
import { WeatherWidget } from "./weather-widget";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { StockResponse, RestockTimes, WeatherResponse } from "@shared/schema";

export function StockChecker() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();

  // Fetch stock data every 30 seconds
  const { data: stockData, isLoading: stockLoading, error: stockError, refetch: refetchStock } = useQuery<StockResponse>({
    queryKey: ["/api/stock"],
    refetchInterval: 30000,
  });

  // Fetch restock times every 30 seconds
  const { data: restockData, isLoading: restockLoading, refetch: refetchRestock } = useQuery<RestockTimes>({
    queryKey: ["/api/stock/restock-time"],
    refetchInterval: 30000,
  });

  // Fetch weather data every minute
  const { data: weatherData, isLoading: weatherLoading, refetch: refetchWeather } = useQuery<WeatherResponse>({
    queryKey: ["/api/weather"],
    refetchInterval: 60000,
  });

  // Handle stock data success/error with useEffect
  useEffect(() => {
    if (stockData) {
      setLastUpdate(new Date());
    }
    if (stockError) {
      toast({
        title: "Stock Data Error",
        description: `Failed to fetch stock data: ${(stockError as Error).message}`,
        variant: "destructive",
      });
    }
  }, [stockData, stockError, toast]);

  // Handle restock times error
  useEffect(() => {
    if (restockData && !restockLoading) {
      // Successfully loaded restock data
    }
  }, [restockData, restockLoading]);

  const isOnline = !stockError;
  const isLoading = stockLoading || restockLoading;

  const handleManualRefresh = async () => {
    try {
      await Promise.all([refetchStock(), refetchRestock(), refetchWeather()]);
      setLastUpdate(new Date());
      toast({
        title: "Data Refreshed",
        description: "Stock data has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getStockCount = (items: any[] = []) => {
    return items.filter(item => item.stock > 0).length;
  };

  return (
    <div className="font-inter">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-garden-green to-garden-light-green rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🌱</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Grow a Garden</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Stock Checker</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <>
                    <div className="w-2 h-2 bg-garden-light-green rounded-full pulse-green"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Live</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-500">Offline</span>
                  </>
                )}
              </div>
              
              {/* Last Update */}
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{formatTimeAgo(lastUpdate)}</span>
              </div>
              
              {/* Manual Refresh */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleManualRefresh}
                disabled={isLoading}
                className="p-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Countdown Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="text-garden-blue mr-2">⏰</span>
              Next Restocks
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {restockData && (
                <>
                  <CountdownTimer
                    title="Seeds"
                    timer={restockData.seeds}
                    icon="🌱"
                    colorClass="green"
                  />
                  <CountdownTimer
                    title="Gear"
                    timer={restockData.gear}
                    icon="⚙️"
                    colorClass="blue"
                  />
                  <CountdownTimer
                    title="Eggs"
                    timer={restockData.egg}
                    icon="🥚"
                    colorClass="orange"
                  />
                  <CountdownTimer
                    title="Pets"
                    timer={restockData.SwarmEvent || { countdown: "22:45", LastRestock: "11:30 AM", timestamp: 0, timeSinceLastRestock: "30m ago" }}
                    icon="⭐"
                    colorClass="purple"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stock Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StockCard
            title="Seeds Stock"
            icon="🌱"
            items={stockData?.seedStock || []}
            inStockCount={getStockCount(stockData?.seedStock)}
            colorClass="green"
            isLoading={stockLoading}
          />
          
          <StockCard
            title="Gear Stock"
            icon="⚙️"
            items={stockData?.gearStock || []}
            inStockCount={getStockCount(stockData?.gearStock)}
            colorClass="blue"
            isLoading={stockLoading}
          />
          
          <StockCard
            title="Eggs Stock"
            icon="🥚"
            items={stockData?.eggStock || []}
            inStockCount={getStockCount(stockData?.eggStock)}
            colorClass="orange"
            isLoading={stockLoading}
          />
          
          <StockCard
            title="Cosmetics"
            icon="🎨"
            items={stockData?.cosmeticsStock || []}
            inStockCount="Always Available"
            colorClass="purple"
            isLoading={stockLoading}
            isCosmetics={true}
          />
        </div>

        {/* Weather Widget */}
        {weatherData && (
          <div className="mt-6">
            <WeatherWidget data={weatherData} isLoading={weatherLoading} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 space-y-2">
          <div>
            Data provided by{" "}
            <a
              href="https://github.com/XanaOG/Grow-A-Garden-API"
              className="text-garden-blue hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              XanaOG's Grow-A-Garden API
            </a>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <span>Auto-refresh: 30s</span>
            <span>•</span>
            <span>Server: {isOnline ? "Online" : "Offline"}</span>
            <span>•</span>
            <span>Last update: {formatTimeAgo(lastUpdate)}</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
