<template>
  <div class="d-flex flex-column h-100 p-3 border-end bg-light">
    <div class="mb-3">
      <div class="fw-bold">Sub Manager</div>
      <small class="text-muted">Assinaturas</small>
    </div>

    <ul class="nav nav-pills flex-column gap-1">
      <li class="nav-item">
        <RouterLink class="nav-link" :class="{ active: isActive('/dashboard') }" to="/dashboard">
          Dashboard
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" :class="{ active: isActive('/subscriptions') }" to="/subscriptions">
          Assinaturas
        </RouterLink>
      </li>
    </ul>

    <div class="mt-auto pt-3">
      <div class="small text-muted mb-2" v-if="email">
        {{ email }}
      </div>
      <button class="btn btn-outline-secondary w-100" type="button" :disabled="authStore.loading" @click="handleLogout">
        Sair
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const email = computed(() => authStore.user?.email || "");

const isActive = (path) => route.path === path;

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login");
};
</script>

