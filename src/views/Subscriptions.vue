<template>
  <div>
    <div class="d-flex align-items-end justify-content-between gap-3 mb-3">
      <div>
        <h1 class="h4 mb-1 fw-semibold">Assinaturas</h1>
        <p class="text-body-secondary mb-0">Adicione e acompanhe cobrancas mensais.</p>
      </div>
      <span class="badge text-bg-secondary">{{ filtered.length }} item(ns)</span>
    </div>

    <div class="row g-3">
      <div class="col-12 col-xl-4">
        <div class="card rounded-4">
          <div class="card-body">
            <div class="fw-semibold mb-3">Nova assinatura</div>

            <form @submit.prevent="handleAdd" novalidate>
              <div class="mb-2">
                <label class="form-label">Nome</label>
                <input v-model.trim="form.name" type="text" class="form-control" placeholder="Ex.: Netflix" required />
              </div>

              <div class="mb-2">
                <label class="form-label">Categoria</label>
                <select v-model="form.category" class="form-select">
                  <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>

              <div class="row g-2">
                <div class="col-6">
                  <label class="form-label">Valor (mensal)</label>
                  <input
                    v-model="form.amount"
                    type="number"
                    min="0"
                    step="0.01"
                    class="form-control font-mono"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div class="col-6">
                  <label class="form-label">Dia de cobranca</label>
                  <input v-model="form.billingDay" type="number" min="1" max="31" class="form-control font-mono" required />
                </div>
              </div>

              <button class="btn btn-primary w-100 mt-3" type="submit" :disabled="!canSubmit">Adicionar</button>
            </form>
          </div>
        </div>
      </div>

      <div class="col-12 col-xl-8">
          <div class="card rounded-4">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between gap-3 mb-3">
              <div class="fw-semibold">Filtros</div>
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="resetFilters">Limpar</button>
            </div>

            <div class="row g-2 align-items-end">
              <div class="col-12 col-md-4">
                <label class="form-label">Buscar</label>
                <input v-model.trim="filters.q" type="text" class="form-control" placeholder="Nome..." />
              </div>
              <div class="col-6 col-md-3">
                <label class="form-label">Categoria</label>
                <select v-model="filters.category" class="form-select">
                  <option value="">Todas</option>
                  <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
              <div class="col-6 col-md-3">
                <label class="form-label">Status</label>
                <select v-model="filters.status" class="form-select">
                  <option value="all">Todas</option>
                  <option value="active">Ativas</option>
                  <option value="inactive">Inativas</option>
                </select>
              </div>
              <div class="col-12 col-md-2">
                <label class="form-label">Ordenar</label>
                <select v-model="filters.sort" class="form-select">
                  <option value="nextChargeAsc">Proxima cobranca</option>
                  <option value="amountDesc">Maior valor</option>
                  <option value="amountAsc">Menor valor</option>
                  <option value="nameAsc">Nome (A-Z)</option>
                </select>
              </div>
              <div class="col-12">
                <div class="form-check mt-1">
                  <input id="upcomingOnly" v-model="filters.upcomingOnly" class="form-check-input" type="checkbox" />
                  <label class="form-check-label" for="upcomingOnly">Somente proximas cobrancas (7 dias)</label>
                </div>
              </div>
            </div>

            <hr class="my-3" />

            <div class="d-flex align-items-center justify-content-between gap-3 mb-2">
              <div class="text-body-secondary small">{{ filtered.length }} assinatura(s)</div>
              <div class="text-body-secondary small font-mono">Total mensal (ativas): {{ formatCurrency(store.monthlyTotal) }}</div>
            </div>

            <div v-if="filtered.length === 0" class="text-body-secondary">
              Nenhuma assinatura encontrada.
            </div>

            <div v-else class="table-responsive">
              <table class="table align-middle mb-0">
                <thead>
                  <tr class="text-body-secondary">
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Proxima cobranca</th>
                    <th class="text-end">Valor</th>
                    <th class="text-end">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="s in filtered" :key="s.id">
                    <td class="fw-semibold">
                      {{ s.name }}
                      <span v-if="!s.active" class="badge text-bg-secondary ms-2">Inativa</span>
                    </td>
                    <td class="text-body-secondary">{{ s.category }}</td>
                    <td class="font-mono">{{ formatDate(s.nextChargeDate) }}</td>
                    <td class="text-end font-mono">{{ formatCurrency(s.amount) }}</td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-outline-secondary" type="button" @click="store.toggleActive(s.id)">
                          {{ s.active ? "Desativar" : "Ativar" }}
                        </button>
                        <button class="btn btn-outline-danger" type="button" @click="store.removeSubscription(s.id)">
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";
import { useSubscriptionStore } from "../stores/subscriptionStore";

const store = useSubscriptionStore();

const categories = ["Streaming", "Software", "Jogos", "Educacao", "Outros"];

const form = reactive({
  name: "",
  category: "Streaming",
  amount: "",
  billingDay: 1
});

const canSubmit = computed(() => {
  const nameOk = String(form.name || "").trim().length > 0;
  const amountOk = Number(form.amount) > 0;
  const dayOk = Number(form.billingDay) >= 1 && Number(form.billingDay) <= 31;
  return nameOk && amountOk && dayOk;
});

const filters = reactive({
  q: "",
  category: "",
  status: "all",
  upcomingOnly: false,
  sort: "nextChargeAsc"
});

const resetFilters = () => {
  filters.q = "";
  filters.category = "";
  filters.status = "all";
  filters.upcomingOnly = false;
  filters.sort = "nextChargeAsc";
};

const filtered = computed(() => {
  let items = store.list.slice();

  if (filters.q) {
    const q = filters.q.toLowerCase();
    items = items.filter((s) => String(s.name || "").toLowerCase().includes(q));
  }

  if (filters.category) {
    items = items.filter((s) => s.category === filters.category);
  }

  if (filters.status === "active") items = items.filter((s) => s.active);
  if (filters.status === "inactive") items = items.filter((s) => !s.active);

  if (filters.upcomingOnly) {
    const upcomingIds = new Set(store.upcomingCharges(7).map((s) => s.id));
    items = items.filter((s) => upcomingIds.has(s.id));
  }

  switch (filters.sort) {
    case "amountDesc":
      items.sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0));
      break;
    case "amountAsc":
      items.sort((a, b) => (Number(a.amount) || 0) - (Number(b.amount) || 0));
      break;
    case "nameAsc":
      items.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
      break;
    case "nextChargeAsc":
    default:
      items.sort((a, b) => a.nextChargeDate - b.nextChargeDate);
      break;
  }

  return items;
});

const handleAdd = () => {
  if (!canSubmit.value) return;

  store.addSubscription({
    name: form.name,
    category: form.category,
    amount: form.amount,
    billingDay: form.billingDay
  });

  form.name = "";
  form.amount = "";
  form.billingDay = 1;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value) || 0);

const formatDate = (date) =>
  new Intl.DateTimeFormat("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
</script>
