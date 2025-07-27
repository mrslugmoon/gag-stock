// api/index.ts
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js"; // <--- CRITICAL FIX: Added .js extension

// Create the Express app instance
const app = express();

// Add standard Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Custom logging middleware (simplified for Vercel environment)
// This middleware captures JSON responses and logs API requests.
// Vercel will capture console.log/console.error output to your function logs.
app.use((req, res, next) => {
  const start = Date.now();
  const originalResJson = res.json;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Override res.json to capture the response body for logging
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // Log API request details when the response finishes
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      let logLine = `${req.method} ${req.path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      console.log(logLine); // Log to Vercel function logs
    }
  });
  next();
});

// Register your API routes onto the Express app instance.
// The `registerRoutes` function returns an http.Server, but in a serverless context,
// we only need it to attach the routes to the `app` instance.
// The returned server object is not used for listening.
registerRoutes(app);

// Error handling middleware for API routes.
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("API Error:", err); // Log the full error details to Vercel function logs
  res.status(status).json({ message });
  // IMPORTANT: Do NOT re-throw errors here in a serverless function,
  // as it can cause the function instance to crash. The client will
  // already receive the error response.
});

// Export the Express app instance. This is the CRITICAL part for Vercel.
// Vercel will automatically wrap this Express app to handle incoming requests
// for your serverless function.
export default app;
