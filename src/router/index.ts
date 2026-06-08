import { createRouter, createWebHistory } from 'vue-router';
import { pinia } from '@/stores';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        guestOnly: true
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to) => {
  const authStore = useAuthStore(pinia);

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return {
      name: 'login'
    };
  }

  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return {
      name: 'dashboard'
    };
  }

  return true;
});

export default router;
