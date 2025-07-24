import { useState, useEffect } from "react";
import { useCountdown } from "@/hooks/use-countdown";
import type { Timer } from "@shared/schema";

interface CountdownTimerProps {
  title: string;
  timer: Timer;
  icon: string;
  colorClass: "green" | "blue" | "orange" | "purple";
}

export function CountdownTimer({ title, timer, icon, colorClass }: CountdownTimerProps) {
  const targetTime = timer.timestamp > 0 ? timer.timestamp : null;
  const countdown = useCountdown(targetTime);

  const colorClasses = {
    green: {
      bg: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      border: "border-green-200 dark:border-green-700",
      text: "text-green-700 dark:text-green-300",
      countdownText: "text-green-800 dark:text-green-200",
      lastText: "text-green-600 dark:text-green-400",
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      border: "border-blue-200 dark:border-blue-700",
      text: "text-blue-700 dark:text-blue-300",
      countdownText: "text-blue-800 dark:text-blue-200",
      lastText: "text-blue-600 dark:text-blue-400",
    },
    orange: {
      bg: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
      border: "border-orange-200 dark:border-orange-700",
      text: "text-orange-700 dark:text-orange-300",
      countdownText: "text-orange-800 dark:text-orange-200",
      lastText: "text-orange-600 dark:text-orange-400",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      border: "border-purple-200 dark:border-purple-700",
      text: "text-purple-700 dark:text-purple-300",
      countdownText: "text-purple-800 dark:text-purple-200",
      lastText: "text-purple-600 dark:text-purple-400",
    },
  };

  const colors = colorClasses[colorClass];

  return (
    <div className={`${colors.bg} p-4 rounded-lg border ${colors.border}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${colors.text}`}>{title}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className={`countdown-digit text-2xl font-bold ${colors.countdownText}`}>
        {countdown || timer.countdown}
      </div>
      <div className={`text-xs ${colors.lastText} mt-1`}>
        Last: {timer.LastRestock}
      </div>
    </div>
  );
}
