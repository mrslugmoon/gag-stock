import type { Express } from "express";
import { createServer, type Server } from "http";
import type { StockItem } from "@shared/schema";

const EXTERNAL_API_BASE = "https://gagstock.gleeze.com";

// Transform external API item to our format
function transformApiItem(item: any, category: string): StockItem {
  return {
    name: item.name,
    price: item.price || 0,
    stock: item.quantity || 0,
    category: category,
    emoji: item.emoji,
    rarity: "Normal", // Default rarity since API doesn't provide this
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy endpoint for stock data
  app.get("/api/stock", async (req, res) => {
    try {
      const response = await fetch(`${EXTERNAL_API_BASE}/grow-a-garden`);
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      const apiData = await response.json();
      
      // Transform the API data to match our expected format
      const transformedData = {
        gearStock: (apiData.data?.gear?.items || []).map((item: any) => transformApiItem(item, "gear")),
        eggStock: (apiData.data?.egg?.items || []).map((item: any) => transformApiItem(item, "egg")),
        seedStock: (apiData.data?.seed?.items || []).map((item: any) => transformApiItem(item, "seeds")),
        cosmeticsStock: (apiData.data?.cosmetics?.items || []).map((item: any) => transformApiItem(item, "cosmetics")),
        lastUpdate: new Date(apiData.updated_at).getTime(),
      };
      
      res.json(transformedData);
    } catch (error: any) {
      console.error("Failed to fetch stock data:", error);
      res.status(500).json({ 
        error: "Failed to fetch stock data",
        message: error.message 
      });
    }
  });

  // Proxy endpoint for restock times
  app.get("/api/stock/restock-time", async (req, res) => {
    try {
      // Fetch from external API to get countdown data
      const response = await fetch(`${EXTERNAL_API_BASE}/grow-a-garden`);
      let restockData;
      
      if (response.ok) {
        const apiData = await response.json();
        const now = new Date();
        const currentTime = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        
        // Convert API countdown strings to our timer format
        restockData = {
          seeds: {
            timestamp: now.getTime() + 5 * 60 * 1000, // Seeds restock every 5 minutes
            countdown: apiData.data?.seed?.countdown || "04:30",
            LastRestock: currentTime,
            timeSinceLastRestock: "1m ago"
          },
          gear: {
            timestamp: now.getTime() + 5 * 60 * 1000, // Gear restocks every 5 minutes
            countdown: apiData.data?.gear?.countdown || "04:30",
            LastRestock: currentTime,
            timeSinceLastRestock: "1m ago"
          },
          egg: {
            timestamp: now.getTime() + 10 * 60 * 1000, // Eggs restock every 10 minutes
            countdown: apiData.data?.egg?.countdown || "09:30",
            LastRestock: currentTime,
            timeSinceLastRestock: "2m ago"
          },
          cosmetic: {
            timestamp: 0,
            countdown: "Always Available",
            LastRestock: "Always",
            timeSinceLastRestock: "N/A"
          },
          SwarmEvent: {
            timestamp: now.getTime() + 30 * 60 * 1000, // Pets restock every 30 minutes
            countdown: "28:45",
            LastRestock: currentTime,
            timeSinceLastRestock: "5m ago"
          }
        };
      } else {
        // Fallback calculation if API is unavailable
        const now = new Date();
        const currentMinutes = now.getMinutes();
        const currentSeconds = now.getSeconds();
        
        // Seeds and Gear restock every 5 minutes (at :00, :05, :10, etc.)
        const nextSeedRestock = 5 - (currentMinutes % 5);
        const seedSeconds = nextSeedRestock === 5 ? 0 : (60 - currentSeconds);
        const seedCountdown = `${String(nextSeedRestock - 1).padStart(2, '0')}:${String(seedSeconds).padStart(2, '0')}`;
        
        // Eggs restock every 10 minutes
        const nextEggRestock = 10 - (currentMinutes % 10);
        const eggSeconds = nextEggRestock === 10 ? 0 : (60 - currentSeconds);
        const eggCountdown = `${String(nextEggRestock - 1).padStart(2, '0')}:${String(eggSeconds).padStart(2, '0')}`;
        
        const lastRestockTime = new Date(now.getTime() - (currentMinutes % 5) * 60000 - currentSeconds * 1000);
        const lastRestockString = lastRestockTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        
        restockData = {
          seeds: {
            timestamp: now.getTime() + (nextSeedRestock * 60 + seedSeconds) * 1000,
            countdown: seedCountdown,
            LastRestock: lastRestockString,
            timeSinceLastRestock: `${currentMinutes % 5}m ago`
          },
          gear: {
            timestamp: now.getTime() + (nextSeedRestock * 60 + seedSeconds) * 1000,
            countdown: seedCountdown,
            LastRestock: lastRestockString,
            timeSinceLastRestock: `${currentMinutes % 5}m ago`
          },
          egg: {
            timestamp: now.getTime() + (nextEggRestock * 60 + eggSeconds) * 1000,
            countdown: eggCountdown,
            LastRestock: lastRestockString,
            timeSinceLastRestock: `${currentMinutes % 10}m ago`
          },
          cosmetic: {
            timestamp: 0,
            countdown: "Always Available",
            LastRestock: "Always",
            timeSinceLastRestock: "N/A"
          },
          SwarmEvent: {
            timestamp: now.getTime() + 30 * 60 * 1000,
            countdown: "28:45",
            LastRestock: lastRestockString,
            timeSinceLastRestock: `${currentMinutes % 30}m ago`
          }
        };
      }

      res.json(restockData);
    } catch (error: any) {
      console.error("Failed to fetch restock times:", error);
      res.status(500).json({ 
        error: "Failed to fetch restock times",
        message: error.message 
      });
    }
  });

  // Proxy endpoint for weather data
  app.get("/api/weather", async (req, res) => {
    try {
      const response = await fetch(`${EXTERNAL_API_BASE}/api/weather`);
      if (!response.ok) {
        // Provide fallback weather data
        res.json({
          temperature: "72°F",
          description: "Perfect growing weather",
          humidity: "65%",
          icon: "cloud-sun"
        });
        return;
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      // Provide fallback weather data
      res.json({
        temperature: "72°F",
        description: "Perfect growing weather",
        humidity: "65%",
        icon: "cloud-sun"
      });
    }
  });

  // Health check endpoint
  app.get("/api/status", (req, res) => {
    res.json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: Date.now()
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
