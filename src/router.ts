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

router.addRoute({
  path: '/about',
  name: 'about',
  component: () => import('./view/about.vue'),
})

// By site
router.addRoute({
  path: '/site',
  name: 'by-site',
  component: () => import('./view/site.vue'),
})

// By site
router.addRoute({
  path: '/user',
  name: 'by-user',
  component: () => import('./view/user.vue'),
})

// Recents
router.addRoute({
  path: '/recents',
  name: 'recents',
  component: () => import('./view/recents.vue'),
})

// Recents
router.addRoute({
  path: '/leaderboard',
  name: 'leaderboard',
  component: () => import('./view/leaderboard.vue'),
})

// 404
router.addRoute({
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () => import('./view/404.vue'),
})

router.afterEach(({ name }) => {
  document.body.setAttribute('data-route', name as string)
  // Fix route when modal opened
  document.body.style.overflow = 'visible'
})
