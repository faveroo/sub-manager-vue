<template>
  <div class="row g-3">
    <div class="col-12">
      <h1 class="h4 mb-0">Dashboard</h1>
      <p class="text-muted mb-0">Resumo das suas assinaturas.</p>
    </div>

    <div class="col-12 col-md-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="text-muted small">Assinaturas ativas</div>
          <div class="display-6">{{ store.activeCount }}</div>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="text-muted small">Total mensal</div>
          <div class="display-6">{{ formatCurrency(store.monthlyTotal) }}</div>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="text-muted small">Próximas cobranças (7 dias)</div>
          <div class="display-6">{{ upcoming.length }}</div>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <div class="fw-semibold">Próximas cobranças</div>
            <RouterLink to="/subscriptions" class="btn btn-sm btn-outline-primary">Ver assinaturas</RouterLink>
          </div>

          <div v-if="upcoming.length === 0" class="text-muted">
            Nenhuma cobrança próxima.
          </div>

          <div v-else class="table-responsive">
            <table class="table table-sm align-middle mb-0">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Próxima cobrança</th>
                  <th class="text-end">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in upcoming.slice(0, 6)" :key="s.id">
                  <td class="fw-semibold">{{ s.name }}</td>
                  <td>{{ s.category }}</td>
                  <td>{{ formatDate(s.nextChargeDate) }}</td>
                  <td class="text-end">{{ formatCurrency(s.amount) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useSubscriptionStore } from "../stores/subscriptionStore";

const store = useSubscriptionStore();

const upcoming = computed(() => store.upcomingCharges(7));

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value) || 0);

const formatDate = (date) =>
  new Intl.DateTimeFormat("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
</script>

