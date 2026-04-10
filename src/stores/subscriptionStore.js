
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useAuthStore } from "./authStore";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  onSnapshot
} from "firebase/firestore";



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

export const useSubscriptionStore = defineStore("subscription", () => {
  const subscriptions = ref([]);
  let unsubscribe = null;

  const load = async () => {
    const user = useAuthStore().user;
    if (!user?.uid) {
      subscriptions.value = [];
      if (unsubscribe) unsubscribe();
      return;
    }
    if (unsubscribe) unsubscribe();
    const q = query(collection(db, "subscriptions"), where("user_uid", "==", user.uid));
    unsubscribe = onSnapshot(q, (querySnapshot) => {
      const subs = [];
      querySnapshot.forEach((doc) => {
        subs.push({ ...doc.data(), id: doc.id });
      });
      subscriptions.value = subs;
    });
  };

  const addSubscription = async ({ name, category, amount, billingDay }) => {
    const user = useAuthStore().user;
    if (!user?.uid) return;
    await addDoc(collection(db, "subscriptions"), {
      name: String(name || "").trim(),
      category: String(category || "Outros").trim() || "Outros",
      amount: toCurrencyNumber(amount),
      billingDay: Number(billingDay) || 1,
      user_uid: user.uid,
      active: true,
      createdAt: new Date().toISOString()
    });
  };

  const removeSubscription = async (id) => {
    if (!id) return;
    await deleteDoc(doc(db, "subscriptions", id));
  };

  const toggleActive = async (id) => {
    const sub = subscriptions.value.find((s) => s.id === id);
    if (!sub) return;
    await updateDoc(doc(db, "subscriptions", id), { active: !sub.active });
  };

  const updateSubscription = async (id, patch) => {
    if (!id || !patch) return;
    const updateData = { ...patch };
    if (patch?.amount != null) updateData.amount = toCurrencyNumber(patch.amount);
    if (patch?.billingDay != null) updateData.billingDay = Number(patch.billingDay) || 1;
    await updateDoc(doc(db, "subscriptions", id), updateData);
  };

  const list = computed(() => {
    return subscriptions.value.map((s) => {
      const nextChargeDate = nextChargeDateFromBillingDay(s.billingDay);
      return { ...s, nextChargeDate };
    });
  });

  const activeList = computed(() =>
    list.value.filter((s) => s.active && s.user_uid === useAuthStore().user?.uid)
  );

  const activeCount = computed(() => activeList.value.length);

  const monthlyTotal = computed(() =>
    activeList.value.reduce((sum, s) => sum + toCurrencyNumber(s.amount), 0)
  );

  const upcomingCharges = (days = 7) => {
    const now = new Date();
    const limit = new Date(now.getFullYear(), now.getMonth(), now.getDate() + Number(days));
    return activeList.value
      .filter((s) => s.nextChargeDate <= limit)
      .sort((a, b) => a.nextChargeDate - b.nextChargeDate);
  };

  watch(
    () => useAuthStore().user,
    () => {
      load();
    },
    { immediate: true }
  );

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

