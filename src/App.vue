
<template>
  <div v-if="authStore.loading" class="d-flex justify-content-center align-items-center vh-100">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Carregando...</span>
    </div>
  </div>
  <router-view v-else />
</template>

<script setup>
import { useAuthStore } from "./stores/authStore";
import { onMounted } from "vue";
const authStore = useAuthStore();
onMounted(async () => {
  await authStore.init();
});
</script>
