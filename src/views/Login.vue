<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
        <div class="card shadow-sm rounded-4">
          <div class="card-body p-4 p-md-4">
            <div class="mb-4">
              <div class="text-body-secondary small">Sub Manager</div>
              <h1 class="h4 mb-1 fw-semibold">Login</h1>
              <p class="mb-0 text-body-secondary">Acesse sua conta para ver suas assinaturas.</p>
            </div>

            <form @submit.prevent="handleLogin" novalidate>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  :class="['form-control', authStore.error.email ? 'is-invalid' : '']"
                  placeholder="voce@exemplo.com"
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
                  autocomplete="current-password"
                  :class="['form-control', authStore.error.password ? 'is-invalid' : '']"
                  placeholder="Sua senha"
                  required
                />
                <div v-if="authStore.error.password" class="invalid-feedback">
                  {{ authStore.error.password }}
                </div>
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                Entrar
              </button>

              <div class="text-center small text-body-secondary mt-3">
                Nao tem uma conta?
                <RouterLink to="/register">Cadastre-se</RouterLink>
              </div>

              <div v-if="authStore.error.general" class="alert alert-danger mt-3 text-center mb-0">
                {{ authStore.error.general }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const email = ref("");
const password = ref("");
const authStore = useAuthStore();
const router = useRouter();

const loading = authStore.loading;

const handleLogin = async () => {
  await authStore.login(email.value, password.value);
  if (!authStore.hasError) router.push("/");
};
</script>
