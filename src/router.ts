import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [],
  scrollBehavior(to, from) {
    if (to === from) return
    return { top: 0 }
  },
})

// Home
router.addRoute({
  path: '/',
  name: 'index',
  component: () => import('./view/index.vue'),
})
