// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      // lazy loading -> o componente só é carregado quando a rota é visitada.
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/cadastro',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/meus-agendamentos',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true, roles: ['patient'] },
    },
    {
      path: '/agendar',
      name: 'create-appointment',
      component: () => import('../views/CreateAppointmentView.vue'),
      meta: { requiresAuth: true, roles: ['patient'] }, // apenas pacientes podem agendar
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('../views/AdminDashboardView.vue'),
      meta: { requiresAuth: true, roles: ['secretary'] },
    },
  ],
})

// Navigation Guard (o "porteiro" das rotas)
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.meta.requiresAuth
  const requiredRoles = to.meta.roles

  // Se a rota exige autenticação e o usuário não está logado...
  if (requiresAuth && !userStore.isAuthenticated) {
    // ...redireciona para a página de login.
    next('/login')
  }
  // Se a rota exige um papel específico e o usuário não tem esse papel...
  else if (requiresAuth && requiredRoles && !requiredRoles.includes(userStore.userRole)) {
    // ...redireciona para a página inicial (ou uma página de "acesso negado").
    next('/')
  }
  // Se tudo estiver OK...
  else {
    // ...permite o acesso à rota.
    next()
  }
})

export default router
