import { defineStore } from "pinia";
import { auth } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { computed, ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(false);

  const emptyError = () => ({
    email: null,
    password: null,
    confirm_password: null,
    general: null
  });

  const error = ref(emptyError());
  const hasError = computed(() => Object.values(error.value).some(Boolean));

  const clearError = () => {
    error.value = emptyError();
  };

  const setError = (partial) => {
    error.value = { ...error.value, ...partial };
  };

  const normalizeAuthError = (err) => {
    const code = err?.code;

    switch (code) {
      case "auth/invalid-email":
        return { email: "Email invalido." };

      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return { general: "Email ou senha invalidos." };

      case "auth/email-already-in-use":
        return { email: "Nao foi possivel usar este email." };

      case "auth/weak-password":
        return { password: "Senha nao atende aos requisitos." };

      case "auth/missing-password":
        return { password: "A senha e obrigatoria." };

      case "auth/network-request-failed":
        return { general: "Nao foi possivel conectar. Tente novamente." };

      case "auth/too-many-requests":
        return { general: "Muitas tentativas. Tente novamente mais tarde." };

      default:
        return { general: "Nao foi possivel autenticar. Tente novamente." };
    }
  };

  const login = async (email, password) => {
    loading.value = true;
    clearError();

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      user.value = res.user;
    } catch (err) {
      setError(normalizeAuthError(err));
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    user.value = null;
  };

  const register = async (email, password, confirm_password) => {
    loading.value = true;
    clearError();

    try {
      if (!confirm_password) {
        setError({ confirm_password: "A confirmacao de senha e obrigatoria." });
        return;
      }

      if (password !== confirm_password) {
        setError({
          confirm_password: "As senhas digitadas estao diferentes.",
          password: "As senhas digitadas estao diferentes."
        });
        return;
      }

      const res = await createUserWithEmailAndPassword(auth, email, password);
      user.value = res.user;
    } catch (err) {
      setError(normalizeAuthError(err));
    } finally {
      loading.value = false;
    }
  };

  onAuthStateChanged(auth, (u) => {
    user.value = u;
  });

  return { user, error, hasError, loading, clearError, login, logout, register };
});

