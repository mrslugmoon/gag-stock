import { Cloud, Sun, CloudRain, CloudSnow } from "lucide-react";
import type { WeatherResponse } from "@shared/schema";

interface WeatherWidgetProps {
  data: WeatherResponse;
  isLoading: boolean;
}

export function WeatherWidget({ data, isLoading }: WeatherWidgetProps) {
  const getWeatherIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'sun':
      case 'sunny':
        return <Sun className="text-yellow-500 text-xl" />;
      case 'cloud':
      case 'cloudy':
        return <Cloud className="text-gray-500 text-xl" />;
      case 'rain':
      case 'rainy':
        return <CloudRain className="text-blue-500 text-xl" />;
      case 'snow':
      case 'snowy':
        return <CloudSnow className="text-blue-300 text-xl" />;
      default:
        return <Sun className="text-yellow-500 text-xl" />;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border border-sky-200 dark:border-sky-700 rounded-xl p-6">
        <div className="flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/50 rounded-lg"></div>
            <div>
              <div className="h-6 bg-sky-200 dark:bg-sky-800 rounded w-32 mb-2"></div>
              <div className="h-4 bg-sky-200 dark:bg-sky-800 rounded w-48"></div>
            </div>
          </div>
          <div className="text-right">
            <div className="h-8 bg-sky-200 dark:bg-sky-800 rounded w-16 mb-1"></div>
            <div className="h-4 bg-sky-200 dark:bg-sky-800 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border border-sky-200 dark:border-sky-700 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/50 rounded-lg flex items-center justify-center">
            {getWeatherIcon(data.icon)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-sky-900 dark:text-sky-100">Current Weather</h3>
            <p className="text-sm text-sky-700 dark:text-sky-300">{data.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-sky-900 dark:text-sky-100">{data.temperature}</div>
          <div className="text-sm text-sky-600 dark:text-sky-400">{data.humidity}</div>
        </div>
      </div>
    </div>
  );
}
