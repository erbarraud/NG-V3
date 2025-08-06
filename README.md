# Neural Grader - Lumber Mill Management System

A comprehensive Vue.js application for managing lumber grading operations, production orders, and quality control in modern sawmills.

## 🎯 Project Overview

Neural Grader is a production-ready lumber mill management system that provides:
- Real-time production monitoring and dashboards
- Automated lumber grading with AI integration
- Production order scheduling and management
- Quality control and claims management
- User management and role-based access control
- Live camera feeds and equipment monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd neural-grader
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173` (or the port shown in terminal)

## 🏗 Architecture & Tech Stack

### Core Technologies
- **Vue 3** with Composition API and TypeScript
- **Pinia** for state management
- **Vue Router** with lazy loading and route guards
- **Tailwind CSS** for styling
- **Chart.js** with vue-chartjs for data visualization
- **Vite** for build tooling with optimized chunk splitting

### Recent Improvements (Audit Complete ✅)
This codebase has undergone a comprehensive audit and modernization:

#### 1. **State Management (Pinia)**
- Centralized stores for grades and authentication
- Type-safe state management with TypeScript
- Located in `src/stores/`

#### 2. **Authentication System**
- Role-based access control (admin, operator, viewer)
- JWT-style token management with localStorage
- Route guards for protected pages
- **DEV MODE**: Authentication is currently DISABLED for easier development
  - All route guards return early `next()` in `src/router/guards.ts`
  - To re-enable: uncomment the auth logic in guard functions

#### 3. **Testing Suite**
- **Vitest** with Vue Test Utils
- 30 passing tests covering stores, components, and composables
- Run tests: `npm run test` or `npm run test:run`

#### 4. **Performance Optimizations**
- Lazy route loading for code splitting
- Manual chunk optimization in `vite.config.ts`
- Lazy image loading component (`src/components/ui/lazy-image.vue`)

#### 5. **Error Monitoring & Logging**
- Global error handling with structured logging
- Performance metrics collection (Web Vitals)
- Debug dashboard at `/debug` route
- **DEV MODE**: Console logging is DISABLED for cleaner development

#### 6. **Build Optimizations**
- Optimized bundle splitting (vendor, ui, charts chunks)
- Production builds with tree-shaking
- Asset optimization and compression

## 📁 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── Layout/             # Layout components (AppLayout, navigation)
│   ├── ui/                 # Base UI components (buttons, inputs, etc.)
│   ├── grade/              # Grade-specific components
│   ├── charts/             # Chart components (BarChart)
│   └── error/              # Error handling components
├── views/                  # Page components (routes)
│   ├── error/              # Error pages (404, 500, unauthorized)
│   ├── Dashboard.vue       # Main dashboard
│   ├── GradeManagement.vue # Grade management
│   ├── Login.vue           # Authentication
│   ├── Debug.vue           # Monitoring dashboard
│   └── ...
├── stores/                 # Pinia stores
│   ├── auth.ts             # Authentication state
│   └── grades.ts           # Grade management state
├── router/                 # Vue Router configuration
│   ├── index.ts            # Route definitions
│   └── guards.ts           # Route guards (AUTH DISABLED)
├── composables/            # Vue 3 composables
│   ├── useAsyncState.ts    # Async operation handling
│   ├── useErrorLogging.ts  # Error logging system
│   ├── usePerformance.ts   # Performance monitoring
│   └── useGradeData.ts     # Grade data logic (migrated to store)
├── plugins/                # Vue plugins
│   └── errorHandler.ts     # Global error handling setup
├── test/                   # Test files
│   ├── stores/             # Store tests
│   ├── components/         # Component tests
│   └── composables/        # Composable tests
└── lib/                    # Utility functions
```

## 🛠 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage

## 🎨 Key Features & Pages

### Core Pages
- **Dashboard** (`/`) - Production KPIs, charts, recent orders, system alerts
- **Production Orders** (`/orders`) - Order management and scheduling
- **Grade Management** (`/grade-management`) - Lumber grade definitions
- **Board Inspector** (`/board-inspector/:id`) - Detailed board analysis
- **Board Finder** (`/board-finder`) - Search and filter boards
- **Live Scanning** (`/scanning`) - Real-time AI grading
- **Line Check** (`/line-check`) - Camera monitoring dashboard
- **User Management** (`/user-management`) - Admin user controls
- **Debug Dashboard** (`/debug`) - Monitoring and error logs

### Authentication (Currently Disabled)
Demo credentials (when auth is enabled):
- **Admin**: admin@example.com / admin123
- **Operator**: operator@example.com / operator123

### Development Tools
- **Error Monitoring**: All errors are logged but not shown in console
- **Performance Tracking**: Available via `/debug` route
- **State Inspection**: Vue DevTools compatible

## 🔧 Development Workflow

### Adding New Features

1. **Create Components**:
   ```bash
   # New page component
   src/views/NewFeature.vue
   
   # Reusable component  
   src/components/feature/NewComponent.vue
   ```

2. **Add Routes**:
   ```javascript
   // In src/router/index.ts
   const NewFeature = () => import('../views/NewFeature.vue')
   
   {
     path: '/new-feature',
     name: 'NewFeature', 
     component: NewFeature,
     // beforeEnter: authGuard, // Currently disabled
     meta: { title: 'New Feature' }
   }
   ```

3. **State Management**:
   ```javascript
   // Create new store in src/stores/newFeature.ts
   import { defineStore } from 'pinia'
   
   export const useNewFeatureStore = defineStore('newFeature', () => {
     // Composition API style store
   })
   ```

4. **Add Tests**:
   ```bash
   src/test/components/NewComponent.test.ts
   src/test/stores/newFeature.test.ts
   ```

### Code Conventions

- **Vue 3 Composition API**: Use `<script setup>` syntax
- **TypeScript**: Type all props, emits, and complex data
- **Error Handling**: Wrap async operations with try/catch
- **Loading States**: Use loading spinners/skeletons for better UX
- **Responsive Design**: Mobile-first approach with Tailwind
- **Accessibility**: Include ARIA labels and proper focus management

### Component Example
```vue
<template>
  <ErrorBoundary>
    <div class="p-6">
      <h1 class="text-2xl font-bold">{{ title }}</h1>
      <LoadingSpinner v-if="isLoading" />
      <div v-else-if="error" class="text-red-600">{{ error.message }}</div>
      <div v-else>{{ data }}</div>
    </div>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ErrorBoundary from '@/components/error/error-boundary.vue'
import LoadingSpinner from '@/components/ui/loading-spinner.vue'
import { useAsyncState } from '@/composables/useAsyncState'

interface Props {
  title: string
}

const props = defineProps<Props>()

const fetchData = async () => {
  // Your async logic here
  return await someApiCall()
}

const { state: data, isLoading, error, execute } = useAsyncState(fetchData, null, { immediate: false })

onMounted(() => {
  execute()
})
</script>
```

## 🎨 Design System

### Colors (Tailwind Classes)
- **Primary**: `emerald-600` (#059669)
- **Secondary**: `slate-600` 
- **Success**: `green-600`
- **Warning**: `yellow-600`
- **Error**: `red-600`

### Components
- **Buttons**: `src/components/ui/button.vue`
- **Cards**: `src/components/ui/card.vue` 
- **Badges**: `src/components/ui/badge.vue`
- **Loading**: `src/components/ui/loading-spinner.vue`

## 🧪 Testing

### Running Tests
```bash
npm run test:run  # Run all tests once
npm run test      # Watch mode
```

### Test Structure
- **Stores**: Test Pinia stores with proper setup
- **Components**: Test props, events, and rendering
- **Composables**: Test utility functions and async operations

### Example Test
```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent, {
      props: { title: 'Test' }
    })
    
    expect(wrapper.text()).toContain('Test')
  })
})
```

## 🔧 Configuration Files

- **Vite**: `vite.config.ts` - Build optimization, chunk splitting
- **Vitest**: `vitest.config.ts` - Test configuration  
- **ESLint**: `eslint.config.js` - Linting rules (Vue + TypeScript)
- **Tailwind**: `tailwind.config.js` - Design system
- **TypeScript**: `tsconfig.json` - Type checking

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Build Output
- **Optimized chunks**: vendor.js, charts.js, ui.js, + route chunks
- **Asset optimization**: Images, fonts organized by type
- **Tree-shaking**: Unused code eliminated
- **Compression**: Gzip compression enabled

### Environment Setup
Create `.env.production`:
```
VITE_API_URL=https://api.yourdomain.com
VITE_AUTH_ENABLED=true
```

## 🔒 Re-enabling Authentication (Production)

When ready for production:

1. **Enable Route Guards**:
   ```javascript
   // In src/router/guards.ts
   export const authGuard = (to, from, next) => {
     // Uncomment the auth logic
     const authStore = useAuthStore()
     // ... rest of auth logic
   }
   ```

2. **Enable Error Logging**:
   ```javascript
   // In src/composables/useErrorLogging.ts
   const config = ref({
     enableConsoleLogging: true, // Re-enable for production monitoring
   })
   ```

3. **Update Environment**:
   ```javascript
   // In production env
   VITE_AUTH_ENABLED=true
   ```

## 🤝 Contributing

### Before Making Changes
1. Run `npm run lint` to check code style
2. Run `npm run test:run` to ensure tests pass
3. Test your changes in the browser
4. Check responsive design on different screen sizes

### Pull Request Checklist
- [ ] Code follows existing patterns
- [ ] TypeScript types are properly defined
- [ ] Error handling is implemented
- [ ] Loading states are included
- [ ] Tests are written/updated
- [ ] Documentation is updated

## 📞 Support & Debugging

### Common Issues
1. **Port conflicts**: Change port in `vite.config.ts` or use `--port` flag
2. **Authentication blocking**: Remember auth is disabled in dev mode
3. **Build failures**: Check TypeScript errors with `npm run build`

### Debug Tools
- **Vue DevTools**: Browser extension for Vue debugging
- **Debug Dashboard**: Navigate to `/debug` for system monitoring
- **Performance**: Use browser DevTools > Performance tab
- **Console**: Most logging is disabled - enable in composables if needed

### Getting Help
- Check existing code patterns for similar implementations
- Review component documentation in files
- Use TypeScript hints in your IDE
- Check the `/debug` route for system status

---

**Ready for development! 🚀**

*Authentication is disabled and logging is minimal for smooth feature development*