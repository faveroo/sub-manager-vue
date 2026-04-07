<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-dark">
    <div class="card shadow-lg p-4" style="width: 100%; max-width: 400px;">
      <div class="text-center mb-4">
        <h2 class="fw-bold">Login</h2>
        <p class="text-muted">Acesse sua conta</p>
      </div>

      <form @submit.prevent="handleLogin" novalidate>
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

        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Entrar
        </button>

        <span class="text-muted d-flex justify-content-center mt-2 gap-1">
          Não tem uma conta? <RouterLink to="/register">Cadastre-se</RouterLink>
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
const authStore = useAuthStore();
const router = useRouter();

const loading = authStore.loading;

const handleLogin = async () => {
  await authStore.login(email.value, password.value);
  if (!authStore.hasError) {
    router.push("/");
  }
};
</script>
