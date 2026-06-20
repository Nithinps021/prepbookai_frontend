import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'

const routes = [
  {
    // Public marketing / onboarding landing page
    path: '/',
    name: 'Landing',
    component: () => import('@/views/LandingView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    // Authenticated app shell. Children declare absolute-style paths so the
    // parent only renders the layout (no index child that would clash with /).
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue')
      },
      {
        path: '/quizzes',
        name: 'Quizzes',
        component: () => import('@/views/QuizListView.vue')
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/ProfileView.vue')
      }
    ]
  },
  {
    // Full screen layout for quiz attempt and results
    path: '/quiz/:id',
    name: 'QuizAttempt',
    component: () => import('@/views/QuizAttemptView.vue'),
    meta: { requiresAuth: true }
  },
  {
    // Results also full screen
    path: '/results/:id',
    name: 'QuizResults',
    component: () => import('@/views/ResultsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    // Catch all -> public landing page
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (authStore.isAuthenticated && (to.name === 'Login' || to.name === 'Landing')) {
    // Logged-in users skip the marketing/login pages and go straight to the app
    next('/dashboard')
  } else {
    next()
  }
})

export default router
