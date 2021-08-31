import { createApp } from 'vue'

// Create App
import App from './App.vue'
const app = createApp(App)

// Router
import { router } from './router'
app.use(router)

// Styles
import './styles/index.sass'

// ECharts
import 'echarts'
import VChart from 'vue-echarts'
app.component('v-chart', VChart)

// External link
import ExternalLink from './components/ExternalLink.vue'
app.component('e-link', ExternalLink)
app.component('external-link', ExternalLink)

// Mount
app.mount('#app')
