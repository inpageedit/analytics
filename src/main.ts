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

// Mount
app.mount('#app')
