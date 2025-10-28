# Platzi Fake Store - React Application

A modern, feature-rich React application for managing products using the Platzi Fake Store REST API.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/karolwalasik/platzi-store
cd platzi-store

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Prerequisites

- **Node.js**: Version 20.19+ or 22.12+ (required by Vite)
- **npm** or **pnpm**


### Authentication 

- Login with JWT tokens (`POST /auth/login`)
- Automatic token refresh on expiration
- **Access Token**: sessionStorage (cleared on tab close)
- **Refresh Token**: localStorage (persists across sessions)
- All product/category requests include `Authorization: Bearer <token>`

### Products Management 

- **Searchable, sortable, paginated product table**
- **Filters**: title (debounced), category, price range
- **URL state persistence** - filters, sorting, and pagination survive page refreshes
- **CRUD operations**: Create, Read, Update, Delete with form validation
- **Delete confirmation** dialog
- **Toast notifications** for success/error feedback
- **Mobile-responsive**: Cards on mobile, table on desktop

### Pages & Routing 

| Route | Description |
|-------|-------------|
| `/login` | Authentication |
| `/` | Products list with filters |
| `/products/new` | Create product |
| `/products/:id` | Product details |
| `/products/:id/edit` | Edit product |
| `/*` | 404 Not Found |

## Project Structure

```
src/
├── features/              # Feature-based architecture
│   ├── auth/             # Login, tokens, protected routes
│   ├── products/         # Products CRUD, filtering, sorting
│   └── categories/       # Category data fetching
├── shared/               
│   ├── components/ui/    # Reusable UI components
│   ├── hooks/            # Custom hooks (debounce, localStorage)
│   └── utils/            # Helper functions
└── lib/                  
    ├── api-client.ts     # Axios instance with interceptors
    ├── query-client.ts   # TanStack Query config
    └── router.tsx        # React Router setup
```

## Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Build
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm test                 # Run tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report

# Code Quality
npm run lint             # Check for linting errors
npm run lint:fix         # Auto-fix linting errors
npm run format           # Format code with Prettier
npm run format:check     # Check formatting
```

## Testing

Sample tests included:

1. **Unit Tests**
   - `auth-service.test.ts` (6 tests) - Token management
   - `Button.test.tsx` (9 tests) - UI component variants

2. **Integration Tests**
   - `ProductsPage.integration.test.tsx` (2 tests) - Loading & rendering

Run tests:
```bash
npm test
```

## 🔑 Demo Credentials

```
Email: john@mail.com
Password: changeme
```

## 📡 API Integration

**Base URL**: `https://api.escuelajs.co/api/v1`

### Endpoints Used

- `POST /auth/login` - User authentication
- `POST /auth/refresh-token` - Token refresh
- `GET /products` - List products with filters (`title`, `price_min`, `price_max`, `categoryId`, `limit`, `offset`)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /categories` - List all categories

## 🎨 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 |
| **Build Tool** | Vite |
| **Language** | TypeScript |
| **Routing** | React Router v6 |
| **Data Fetching** | TanStack Query (React Query) |
| **HTTP Client** | Axios |
| **Styling** | Tailwind CSS v4 |
| **Forms** | React Hook Form + Zod |
| **Testing** | Vitest + React Testing Library |
| **Linting** | ESLint + Prettier |

## Configuration Files

- `.eslintrc.cjs` - ESLint configuration
- `.prettierrc` - Prettier formatting rules
- `tailwind.config.js` - Tailwind CSS setup (v4)
- `tsconfig.json` - TypeScript compiler options
- `vite.config.ts` - Vite build configuration
- `vitest.config.ts` - Test configuration

## State Management Strategy

- **Server State**: TanStack Query (products, categories)
- **URL State**: Search params (filters, sort, pagination)
- **Local State**: React useState/useReducer
- **Session State**: sessionStorage (access token)
- **Persistent State**: localStorage (refresh token)

## Key Implementation Details

### URL State Persistence

All filters, sorting, and pagination state are stored in URL query parameters:

```
/?title=shirt&categoryId=1&price_min=10&price_max=100&sortBy=price&sortDir=asc&page=2
```

This allows:
- ✅ State persistence across page refreshes
- ✅ Shareable links
- ✅ Browser back/forward navigation

### Automatic Token Refresh

Axios interceptor automatically refreshes expired access tokens:

```typescript
// Request interceptor: Add Bearer token
axios.interceptors.request.use(config => {
  const token = authService.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: Handle 401 and refresh token
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Attempt token refresh...
    }
  }
)
```

### Caching Strategy

- **10-second cache** for product queries (requirement)
- **Stale-while-revalidate** pattern
- **Optimistic updates** for mutations

## Known Limitations

1. **API Limitations**:
   - Some API filters are buggy → Fallback to client-side filtering

   
