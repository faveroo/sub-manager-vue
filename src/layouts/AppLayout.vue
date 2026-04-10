
<template>
  <div class="container-fluid">
    <FlashMessage />
    <div class="row g-0">
      <aside class="col-12 col-lg-3 col-xl-2 border-end">
        <AppSidebar />
      </aside>
      <main class="col-12 col-lg-9 col-xl-10">
        <div class="container py-4">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import AppSidebar from "../components/AppSidebar.vue";
import FlashMessage from "../components/FlashMessage.vue";
</script>
