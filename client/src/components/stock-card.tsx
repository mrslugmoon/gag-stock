import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { StockItem } from "@shared/schema";

interface StockCardProps {
  title: string;
  icon: string;
  items: StockItem[];
  inStockCount: number | string;
  colorClass: "green" | "blue" | "orange" | "purple";
  isLoading: boolean;
  isCosmetics?: boolean;
}

export function StockCard({ 
  title, 
  icon, 
  items, 
  inStockCount, 
  colorClass, 
  isLoading,
  isCosmetics = false 
}: StockCardProps) {
  const colorClasses = {
    green: {
      badge: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconText: "text-green-700 dark:text-green-300",
    },
    blue: {
      badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconText: "text-blue-700 dark:text-blue-300",
    },
    orange: {
      badge: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconText: "text-orange-700 dark:text-orange-300",
    },
    purple: {
      badge: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconText: "text-purple-700 dark:text-purple-300",
    },
  };

  const colors = colorClasses[colorClass];

  const getStockBadge = (stock: number) => {
    if (isCosmetics) {
      return (
        <span className="px-2 py-1 bg-garden-light-green text-white text-xs font-medium rounded-full">
          ∞
        </span>
      );
    }

    if (stock === 0) {
      return (
        <span className="px-2 py-1 bg-garden-red text-white text-xs font-medium rounded-full">
          0
        </span>
      );
    } else if (stock <= 5) {
      return (
        <span className="px-2 py-1 bg-garden-orange text-white text-xs font-medium rounded-full">
          {stock}
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-garden-light-green text-white text-xs font-medium rounded-full">
          {stock}
        </span>
      );
    }
  };

  const getStatusDot = (stock: number) => {
    if (isCosmetics) {
      return <div className="w-2 h-2 bg-garden-light-green rounded-full"></div>;
    }

    if (stock === 0) {
      return <div className="w-2 h-2 bg-garden-red rounded-full"></div>;
    } else if (stock <= 5) {
      return <div className="w-2 h-2 bg-garden-orange rounded-full"></div>;
    } else {
      return <div className="w-2 h-2 bg-garden-light-green rounded-full"></div>;
    }
  };



  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <span className="mr-2">{icon}</span>
            {title}
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 ${colors.badge} text-xs font-medium rounded-full`}>
              {typeof inStockCount === 'number' ? `${inStockCount} in stock` : inStockCount}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-12 rounded-full" />
                  <Skeleton className="w-2 h-2 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">📦</div>
            <p>No items available</p>
            <p className="text-sm">Check back after the next restock</p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
                      <span className="text-sm">
                        {item.emoji || item.icon || "📦"}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStockBadge(item.stock)}
                    {getStatusDot(item.stock)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
