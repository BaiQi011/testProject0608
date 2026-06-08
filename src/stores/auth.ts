import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { UserRole } from '@/types/workOrder';

export const useAuthStore = defineStore('auth', () => {
  const username = ref('');
  const role = ref<UserRole | ''>('');

  const isLoggedIn = computed(() => Boolean(username.value));
  const isAdmin = computed(() => role.value === 'admin');

  function login(nextUsername: string) {
    const normalizedUsername = nextUsername.trim();

    username.value = normalizedUsername;
    role.value = normalizedUsername === 'admin' ? 'admin' : 'user';
  }

  function logout() {
    username.value = '';
    role.value = '';
  }

  return {
    username,
    role,
    isLoggedIn,
    isAdmin,
    login,
    logout
  };
});
