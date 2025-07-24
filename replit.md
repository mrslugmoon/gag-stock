# Stock Checker Application

## Overview

This is a full-stack web application built to monitor and display real-time stock data for the Roblox game "Grow a Garden". The application connects to live game APIs to provide authentic stock information for various game items (seeds, gear, eggs, cosmetics) along with accurate restock countdown timers and weather information. It's built using a modern React frontend with Express.js backend, styled with shadcn/ui components and Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API Pattern**: RESTful API with proxy endpoints
- **External Integration**: Fetches data from third-party API (gagstock.gleeze.com)
- **Development**: Hot reloading with Vite integration

### Database Strategy
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (configured but not actively used in current implementation)
- **Storage**: In-memory storage implementation for user data (MemStorage class)
- **Migrations**: Drizzle migrations in ./migrations directory

## Key Components

### Frontend Components
1. **StockChecker**: Main dashboard component that orchestrates data fetching and display
2. **StockCard**: Displays individual stock category information with items and availability
3. **CountdownTimer**: Shows restock countdown timers for different item categories
4. **WeatherWidget**: Displays current weather information for the game
5. **UI Components**: Comprehensive set of shadcn/ui components for consistent design

### Backend Components
1. **Express Server**: Main server with middleware for JSON parsing and logging
2. **Route Handlers**: API endpoints that fetch and transform data from external Grow a Garden APIs
3. **Data Transformation**: Converts external API format to normalized frontend-compatible structure
4. **Storage Layer**: Abstract storage interface with in-memory implementation (unused for current functionality)
5. **Vite Integration**: Development server integration for hot reloading

### Data Flow
1. **External API Integration**: Server fetches live data from gagstock.gleeze.com Grow a Garden API
2. **Data Transformation**: Server normalizes API response structure (items with quantity/emoji → stock items)
3. **Client Requests**: Frontend makes API calls to local Express server endpoints every 30 seconds
4. **Real-time Updates**: React Query manages caching and automatic refresh cycles
5. **Live Countdown Timers**: Custom hooks calculate and update countdown displays every second
6. **UI Rendering**: Components render authentic game data with loading states and error handling

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Database connection for Neon PostgreSQL
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **zod**: Schema validation for type safety
- **date-fns**: Date manipulation utilities

### UI Dependencies
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for managing component variants
- **cmdk**: Command palette component

### Development Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Type checking and enhanced developer experience
- **@replit/vite-plugin-runtime-error-modal**: Enhanced error reporting in development

## Data Schema

The application uses Zod schemas for data validation:

- **StockItem**: Individual items with name, price, stock, rarity, category
- **Timer**: Countdown timers with timestamp, countdown string, and last restock info
- **StockResponse**: Complete stock data with different item categories
- **RestockTimes**: Restock countdown information for all categories
- **WeatherResponse**: Current weather conditions

## Deployment Strategy

### Development
- **Local Development**: `npm run dev` starts both frontend and backend with hot reloading
- **Type Checking**: `npm run check` for TypeScript validation
- **Database**: `npm run db:push` for schema updates

### Production Build
- **Frontend Build**: Vite builds optimized static assets to `dist/public`
- **Backend Build**: esbuild bundles Express server to `dist/index.js`
- **Startup**: `npm start` runs the production server

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required for Drizzle config)
- **NODE_ENV**: Environment detection for development vs production
- **REPL_ID**: Replit-specific environment detection

The application is designed to work both in local development and Replit's cloud environment, with conditional loading of Replit-specific plugins and configurations.