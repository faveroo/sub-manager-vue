import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import AppLayout from "../layouts/AppLayout.vue";
import Dashboard from "../views/Dashboard.vue";
import Subscriptions from "../views/Subscriptions.vue";
import { useAuthStore } from "../stores/authStore";

const routes = [
  { path: "/", redirect: "/dashboard" },
  { path: "/login", name: "Login", component: Login},
  { path: "/register", name: "Register", component: Register},
  {
    path: "/",
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "dashboard", name: "Dashboard", component: Dashboard },
      { path: "subscriptions", name: "Subscriptions", component: Subscriptions }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);
  if (requiresAuth && !authStore.user) {
    next("/login");
  } else {
    next();
  }
});

export default router;
