import { z } from "zod";

// Stock item schema (from external API)
export const apiStockItemSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  emoji: z.string().optional(),
  price: z.number().optional(),
});

// Normalized stock item schema for our frontend
export const stockItemSchema = z.object({
  name: z.string(),
  price: z.number().default(0),
  stock: z.number(),
  rarity: z.string().optional(),
  category: z.string(),
  emoji: z.string().optional(),
  icon: z.string().optional(),
});

// Category data from external API
export const apiCategorySchema = z.object({
  items: z.array(apiStockItemSchema),
  countdown: z.string(),
});

// External API response schema
export const externalApiResponseSchema = z.object({
  status: z.string(),
  updated_at: z.string(),
  data: z.object({
    egg: apiCategorySchema.optional(),
    gear: apiCategorySchema.optional(),
    seeds: apiCategorySchema.optional(),
    cosmetics: apiCategorySchema.optional(),
  }),
});

// Timer schema for restock countdowns
export const timerSchema = z.object({
  timestamp: z.number(),
  countdown: z.string(),
  LastRestock: z.string(),
  timeSinceLastRestock: z.string().optional(),
});

// Our normalized stock response schema
export const stockResponseSchema = z.object({
  gearStock: z.array(stockItemSchema),
  eggStock: z.array(stockItemSchema),
  seedStock: z.array(stockItemSchema),
  cosmeticsStock: z.array(stockItemSchema),
  lastUpdate: z.number().optional(),
});

// Restock times response schema
export const restockTimesSchema = z.object({
  egg: timerSchema,
  gear: timerSchema,
  seeds: timerSchema,
  cosmetic: timerSchema,
  SwarmEvent: timerSchema.optional(),
});

// Weather response schema
export const weatherResponseSchema = z.object({
  temperature: z.string(),
  description: z.string(),
  humidity: z.string(),
  icon: z.string(),
});

// API status schema
export const apiStatusSchema = z.object({
  status: z.string(),
  uptime: z.number(),
  timestamp: z.number(),
});

// Export types
export type StockItem = z.infer<typeof stockItemSchema>;
export type Timer = z.infer<typeof timerSchema>;
export type StockResponse = z.infer<typeof stockResponseSchema>;
export type RestockTimes = z.infer<typeof restockTimesSchema>;
export type WeatherResponse = z.infer<typeof weatherResponseSchema>;
export type ApiStatus = z.infer<typeof apiStatusSchema>;
