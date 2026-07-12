# InsightHub Frontend

Production-ready React 19 frontend for InsightHub weather intelligence platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API service layer
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   ├── styles/          # Global styles
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
├── index.html           # HTML entry point
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Dependencies
```

## 🏗️ Architecture

### Layered Design

1. **Pages** - Route components (Dashboard, Weather, AQI, etc.)
2. **Components** - Reusable UI components (MetricCard, CityWeatherGrid, etc.)
3. **Hooks** - Custom React hooks for data fetching (useWeather, useAirQuality, etc.)
4. **Services** - API client (apiService)
5. **Types** - TypeScript interfaces for type safety
6. **Utils** - Helper functions (formatTemperature, getAQIStatus, etc.)

### State Management

- **TanStack Query** for server state management
- **Local state** for UI state (sidebar toggle, theme, etc.)
- No need for Redux - Query handles caching and synchronization

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Dark theme** for professional appearance
- **Responsive design** - Mobile first approach
- Custom components with `@layer` for consistency

## 🔌 API Integration

All API calls go through `services/api.ts` singleton:

```typescript
import { apiService } from '@/services/api'

// Get current weather
const response = await apiService.getCurrentWeather(19.0760, 72.8777)
```

Or use React Query hooks:

```typescript
import { useWeather } from '@/hooks/useWeather'

const { data, isLoading, error } = useWeather(19.0760, 72.8777)
```

## 📝 Environment Variables

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_V1_PREFIX=/api/v1
```

For production:

```env
VITE_API_BASE_URL=https://your-railway-backend-url.railway.app
VITE_API_V1_PREFIX=/api/v1
```

## 🧹 Code Quality

### Type Safety

- Full TypeScript coverage
- No `any` types
- Strict mode enabled

### Component Guidelines

1. **Functional components** only
2. **Props interfaces** for type safety
3. **Descriptive names** for clarity
4. **Single responsibility** principle
5. **No inline styles** - use Tailwind

### Naming Conventions

- Components: `PascalCase` (e.g., `MetricCard`)
- Files: Match component name (e.g., `MetricCard.tsx`)
- Hooks: Start with `use` (e.g., `useWeather`)
- Constants: `UPPER_CASE` (e.g., `DEMO_CITIES`)
- Utilities: `camelCase` (e.g., `formatTemperature`)

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

## 📦 Dependencies

- **react** ^19.0.0 - UI library
- **react-router-dom** ^6.27.0 - Routing
- **@tanstack/react-query** ^5.51.23 - Server state
- **axios** ^1.7.7 - HTTP client
- **recharts** ^2.14.5 - Charts
- **lucide-react** ^0.445.0 - Icons
- **tailwindcss** ^3.4.15 - Styling

## 🔄 Next Steps

1. ✅ Foundation complete
2. ⏳ Add Weather page
3. ⏳ Add AQI module
4. ⏳ Add Analytics with charts
5. ⏳ Add Map visualization
6. ⏳ Add Admin dashboard

## 📚 Documentation

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [TanStack Query Docs](https://tanstack.com/query)
- [Vite Docs](https://vitejs.dev)

## 🤝 Contributing

When adding features:

1. Create feature branch
2. Follow code style (no duplicates)
3. Write clean, readable code
4. Test thoroughly
5. Create pull request

## 📄 License

MIT
