import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('@/views/SignupView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue')
      },
      {
        path: 'quizzes',
        name: 'Quizzes',
        component: () => import('@/views/QuizListView.vue')
      },
      {
        path: 'profile',
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
    // Catch all
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
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
  } else if (!to.meta.requiresAuth && authStore.isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
