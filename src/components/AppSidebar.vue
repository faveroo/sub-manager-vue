<template>
  <div class="p-3 p-lg-4 sticky-top vh-100 overflow-auto">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <div>
        <div class="fw-semibold">Sub Manager</div>
        <div class="text-body-secondary small">Assinaturas</div>
      </div>
      <span class="badge text-bg-secondary">v1</span>
    </div>

    <div class="list-group list-group-flush">
      <RouterLink
        class="list-group-item list-group-item-action rounded-3 mb-2"
        :class="{ active: isActive('/dashboard') }"
        to="/dashboard"
      >
        Dashboard
      </RouterLink>
      <RouterLink
        class="list-group-item list-group-item-action rounded-3"
        :class="{ active: isActive('/subscriptions') }"
        to="/subscriptions"
      >
        Assinaturas
      </RouterLink>
    </div>

    <div class="mt-4 pt-3 border-top">
      <div v-if="email" class="text-body-secondary small text-truncate" :title="email">{{ email }}</div>
      <button class="btn btn-outline-secondary w-100 mt-2" type="button" :disabled="authStore.loading" @click="handleLogout">
        <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
        Sair
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
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
