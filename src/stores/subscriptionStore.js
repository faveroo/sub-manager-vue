import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useAuthStore } from "./authStore";

const STORAGE_KEY = "sub-manager:subscriptions";

const clampDayToMonth = (year, monthIndex, day) => {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  return Math.max(1, Math.min(Number(day) || 1, lastDay));
};

const nextChargeDateFromBillingDay = (billingDay) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const dayThisMonth = clampDayToMonth(currentYear, currentMonth, billingDay);
  const candidate = new Date(currentYear, currentMonth, dayThisMonth);

  if (candidate >= todayStart) return candidate;

  const nextMonth = new Date(currentYear, currentMonth + 1, 1);
  const dayNextMonth = clampDayToMonth(nextMonth.getFullYear(), nextMonth.getMonth(), billingDay);
  return new Date(nextMonth.getFullYear(), nextMonth.getMonth(), dayNextMonth);
};

const toCurrencyNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export const useSubscriptionStore = defineStore("subscriptions", () => {
  const subscriptions = ref([]);

  const load = () => {
    try {
      const user = useAuthStore().user;
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const filtered = Array.isArray(parsed) ? parsed.filter((s) => s.user_uid === user?.uid) : [];
      subscriptions.value = filtered;
    } catch {
      subscriptions.value = [];
    }
  };

  const persist = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions.value));
  };

  const addSubscription = ({ name, category, amount, billingDay }) => {
    const user = useAuthStore().user;
    const id = crypto?.randomUUID ? crypto.randomUUID() : String(Date.now());

    subscriptions.value.unshift({
      id,
      name: String(name || "").trim(),
      category: String(category || "Outros").trim() || "Outros",
      amount: toCurrencyNumber(amount),
      billingDay: Number(billingDay) || 1,
      user_uid: user?.uid || null,
      active: true,
      createdAt: new Date().toISOString()
    });
  };

  const removeSubscription = (id) => {
    subscriptions.value = subscriptions.value.filter((s) => s.id !== id);
  };

  const toggleActive = (id) => {
    const sub = subscriptions.value.find((s) => s.id === id);
    if (sub) sub.active = !sub.active;
  };

  const updateSubscription = (id, patch) => {
    const sub = subscriptions.value.find((s) => s.id === id);
    if (!sub) return;
    Object.assign(sub, patch);
    if (patch?.amount != null) sub.amount = toCurrencyNumber(patch.amount);
    if (patch?.billingDay != null) sub.billingDay = Number(patch.billingDay) || 1;
  };

  const list = computed(() => {
    return subscriptions.value.map((s) => {
      const nextChargeDate = nextChargeDateFromBillingDay(s.billingDay);
      return {
        ...s,
        nextChargeDate
      };
    });
  });

  const activeList = computed(() => list.value.filter((s) => s.active && s.user_uid === useAuthStore().user?.uid));
  const activeCount = computed(() => activeList.value.length);
  const monthlyTotal = computed(() => activeList.value.reduce((sum, s) => sum + toCurrencyNumber(s.amount), 0));

  const upcomingCharges = (days = 7) => {
    const now = new Date();
    const limit = new Date(now.getFullYear(), now.getMonth(), now.getDate() + Number(days));
    return activeList.value
      .filter((s) => s.nextChargeDate <= limit)
      .sort((a, b) => a.nextChargeDate - b.nextChargeDate);
  };

  load();
  watch(subscriptions, persist, { deep: true });

  return {
    subscriptions,
    list,
    activeList,
    activeCount,
    monthlyTotal,
    upcomingCharges,
    addSubscription,
    removeSubscription,
    toggleActive,
    updateSubscription
  };
});

