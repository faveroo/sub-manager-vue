<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-dark">
    <div class="col-md-4 bg-light p-4 rounded">
      <h2 class="text-center mb-4">Registrar</h2>

      <form @submit.prevent="handleRegister" novalidate>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input
            v-model="email"
            type="email"
            :class="['form-control', authStore.error.email ? 'is-invalid' : '']"
            placeholder="Digite seu email"
            required
          />
          <div v-if="authStore.error.email" class="invalid-feedback">
            {{ authStore.error.email }}
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Senha</label>
          <input
            v-model="password"
            type="password"
            :class="['form-control', authStore.error.password ? 'is-invalid' : '']"
            placeholder="Digite sua senha"
            required
          />
          <div v-if="authStore.error.password" class="invalid-feedback">
            {{ authStore.error.password }}
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Confirmar Senha</label>
          <input
            v-model="confirm_password"
            type="password"
            :class="['form-control', authStore.error.confirm_password ? 'is-invalid' : '']"
            placeholder="Digite sua senha novamente"
            required
          />
          <div v-if="authStore.error.confirm_password" class="invalid-feedback">
            {{ authStore.error.confirm_password }}
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-primary w-100"
          :disabled="loading"
          :title="loading ? 'Registrando...' : 'Registrar'"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Registrar
        </button>

        <span class="text-muted d-flex justify-content-center mt-2 gap-1">
          Já tem uma conta? <RouterLink to="/login">Entrar</RouterLink>
        </span>

        <div v-if="authStore.error.general" class="alert alert-danger mt-3 text-center">
          {{ authStore.error.general }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const email = ref("");
const password = ref("");
const confirm_password = ref("");
const authStore = useAuthStore();
const router = useRouter();

const loading = authStore.loading;

const handleRegister = async () => {
  await authStore.register(email.value, password.value, confirm_password.value);
  if (!authStore.hasError) {
    router.push("/");
  }
};
</script>
