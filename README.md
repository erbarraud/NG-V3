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

4. Open your browser to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout/          # Layout components (AppLayout)
│   ├── ui/              # Base UI components (buttons, inputs, etc.)
│   └── error/           # Error handling components
├── views/               # Page components
│   ├── error/           # Error pages (404, 500, network)
│   ├── Dashboard.vue    # Main dashboard
│   ├── ProductionOrders.vue
│   ├── BoardInspector.vue
│   └── ...
├── router/              # Vue Router configuration
├── composables/         # Vue 3 composables for shared logic
├── lib/                 # Utility functions
└── assets/              # Static assets
```

## 🛠 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Key Features

### Production Management
- **Dashboard**: Real-time KPIs, production metrics, and system status
- **Production Orders**: Create, schedule, and manage lumber processing orders
- **Board Inspector**: Detailed board analysis with defect detection
- **Board Finder**: Search and filter boards by various criteria

### Quality Control
- **Live Scanning**: Real-time board scanning with AI grading
- **Line Check**: Camera feeds and equipment monitoring
- **Claims Management**: Handle customer quality claims and resolutions

### Administration
- **User Management**: Role-based access control and permissions
- **Shift Scheduler**: Manage work shifts and holiday schedules
- **System Settings**: Configure grading rules and system parameters

## 🏗 Architecture

### Frontend Stack
- **Vue 3** with Composition API
- **Vue Router** for navigation
- **Tailwind CSS** for styling
- **Lucide Vue** for icons
- **Chart.js** for data visualization

### Key Patterns
- **Composables**: Reusable logic with `useAsyncState`
- **Error Boundaries**: Comprehensive error handling
- **Loading States**: Consistent loading UI patterns
- **Responsive Design**: Mobile-first approach

## 🎯 Component Guidelines

### UI Components (`src/components/ui/`)
Base components following design system principles:
- `Button.vue` - Primary action component
- `Card.vue` - Content containers
- `Badge.vue` - Status indicators
- `LoadingSpinner.vue` - Loading states
- `LoadingSkeleton.vue` - Content placeholders

### Layout Components
- `AppLayout.vue` - Main application shell with navigation

### Error Handling
- `ErrorBoundary.vue` - Catches and displays component errors
- Error pages for different scenarios (404, 500, network issues)

## 🔧 Development Workflow

### Adding New Features
1. Create components in appropriate directories
2. Use TypeScript for type safety
3. Follow existing naming conventions
4. Add proper error handling and loading states
5. Ensure responsive design
6. Test across different screen sizes

### Code Style
- Use Vue 3 Composition API
- Follow single responsibility principle
- Use descriptive variable names
- Add JSDoc comments for complex functions
- Maintain consistent indentation (2 spaces)

### State Management
- Use Vue 3 reactive refs and computed properties
- Implement composables for shared logic
- Handle async operations with `useAsyncState`

## 🎨 Design System

### Colors
- Primary: Emerald green (`#10b981`)
- Secondary: Slate gray
- Success: Green variants
- Warning: Yellow/Orange variants
- Error: Red variants

### Typography
- Font Family: Inter
- Responsive text sizing
- Consistent line heights

### Spacing
- 8px base unit system
- Consistent margins and padding
- Responsive breakpoints

## 🔒 Security & Performance

### Security
- Role-based access control
- Input validation and sanitization
- Secure API communication patterns

### Performance
- Lazy loading for routes
- Optimized bundle splitting
- Efficient re-rendering with Vue 3
- Image optimization

## 🧪 Testing

### Manual Testing Checklist
- [ ] All navigation links work correctly
- [ ] Forms submit and validate properly
- [ ] Loading states display appropriately
- [ ] Error handling works as expected
- [ ] Responsive design functions on all screen sizes
- [ ] Accessibility features work with keyboard navigation

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Configure the following for production:
- API endpoints
- Authentication settings
- Feature flags

## 🤝 Contributing

### Code Standards
- Follow existing patterns and conventions
- Add proper TypeScript types
- Include error handling and loading states
- Test thoroughly before submitting
- Update documentation as needed

### Pull Request Process
1. Create feature branch from main
2. Implement changes following guidelines
3. Test functionality thoroughly
4. Update documentation if needed
5. Submit pull request with clear description

## 📞 Support

For technical support or questions:
- Email: support@neuralgrader.com
- Documentation: [Internal Wiki]
- Issue Tracking: [Project Management Tool]

## 📄 License

[License Information]

---

**Built with ❤️ for precision lumber grading**