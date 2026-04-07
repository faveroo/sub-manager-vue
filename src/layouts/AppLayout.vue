<template>
  <div class="d-flex" style="min-height: 100vh;">
    <aside style="width: 260px;">
      <AppSidebar />
    </aside>
    <main class="flex-grow-1 bg-body-tertiary">
      <div class="container py-4">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import AppSidebar from "../components/AppSidebar.vue";
</script>

