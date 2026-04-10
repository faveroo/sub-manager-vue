import { defineStore } from "pinia";
import { ref } from "vue";

export const useFlashStore = defineStore("flash", () => {
  const message = ref("");
  const type = ref("success");
  const visible = ref(false);
  let timeoutId = null;

  function show(msg, msgType = "success", duration = 3000) {
    message.value = msg;
    type.value = msgType;
    visible.value = true;
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      visible.value = false;
    }, duration);
  }

  function hide() {
    visible.value = false;
    if (timeoutId) clearTimeout(timeoutId);
  }

  return { message, type, visible, show, hide };
});
