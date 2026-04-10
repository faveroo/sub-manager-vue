<template>
  <div v-if="visible" :class="['alert', alertClass, 'position-fixed', 'top-0', 'start-50', 'translate-middle-x', 'mt-3', 'shadow']" style="z-index: 2000; min-width: 300px; max-width: 90vw;">
    {{ message }}
    <button type="button" class="btn-close float-end" aria-label="Fechar" @click="hide"></button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useFlashStore } from "../stores/flashStore";

const flash = useFlashStore();
const visible = computed(() => flash.visible);
const message = computed(() => flash.message);
const type = computed(() => flash.type);
const hide = flash.hide;

const alertClass = computed(() => {
  switch (type.value) {
    case "success":
      return "alert-success";
    case "error":
      return "alert-danger";
    case "warning":
      return "alert-warning";
    default:
      return "alert-info";
  }
});
</script>
