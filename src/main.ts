import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { setupErrorHandler } from './plugins/errorHandler'
import { usePerformance } from './composables/usePerformance'
import './index.css'

const app = createApp(App)
const pinia = createPinia()

// Setup error handling (disabled console logging for development)
setupErrorHandler(app)

// Initialize performance monitoring (but don't auto-log)
const performance = usePerformance()

app.use(pinia)
app.use(router)
app.mount('#app')

// Performance logging is disabled for cleaner development experience
// You can still access it via the /debug route or by calling performance.logReport() manually