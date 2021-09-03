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

// import ECharts modules manually to reduce bundle size
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  ToolboxComponent,
  DataZoomComponent,
  MarkPointComponent,
  MarkLineComponent,
  LegendComponent,
  TitleComponent,
} from 'echarts/components'
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  LegendComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  DataZoomComponent,
  MarkPointComponent,
  MarkLineComponent,
])

import VChart from 'vue-echarts'
app.component('v-chart', VChart)

// Icon
import { Icon } from '@vicons/utils'
app.component('icon', Icon)

// External link
import ExternalLink from './components/ExternalLink.vue'
app.component('e-link', ExternalLink)
app.component('external-link', ExternalLink)

// Mount
app.mount('#app')
