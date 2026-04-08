<template>
  <div>
    <div class="d-flex align-items-end justify-content-between gap-3 mb-3">
      <div>
        <h1 class="h4 mb-1 fw-semibold">Dashboard</h1>
        <p class="text-body-secondary mb-0">Resumo das suas assinaturas.</p>
      </div>
      <RouterLink class="btn btn-outline-secondary btn-sm" to="/subscriptions">Gerenciar</RouterLink>
    </div>

    <div class="row g-3">
      <div class="col-12 col-lg-4">
        <div class="card rounded-4">
          <div class="card-body">
            <div class="text-body-secondary small">Assinaturas ativas</div>
            <div class="display-6 font-mono fw-semibold">{{ store.activeCount }}</div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <div class="card rounded-4">
          <div class="card-body">
            <div class="text-body-secondary small">Total mensal</div>
            <div class="display-6 font-mono fw-semibold">{{ formatCurrency(store.monthlyTotal) }}</div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <div class="card rounded-4">
          <div class="card-body">
            <div class="text-body-secondary small">Proximas cobrancas (7 dias)</div>
            <div class="display-6 font-mono fw-semibold">{{ upcoming.length }}</div>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="card rounded-4">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between gap-3 mb-2">
              <div class="fw-semibold">Proximas cobrancas</div>
              <RouterLink class="btn btn-outline-secondary btn-sm" to="/subscriptions">Ver tudo</RouterLink>
            </div>

            <div v-if="upcoming.length === 0" class="text-body-secondary">
              Nenhuma cobranca proxima.
            </div>

            <div v-else class="table-responsive">
              <table class="table table-sm align-middle mb-0">
                <thead>
                  <tr class="text-body-secondary">
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Proxima cobranca</th>
                    <th class="text-end">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="s in upcoming.slice(0, 6)" :key="s.id">
                    <td class="fw-semibold">{{ s.name }}</td>
                    <td class="text-body-secondary">{{ s.category }}</td>
                    <td class="font-mono">{{ formatDate(s.nextChargeDate) }}</td>
                    <td class="text-end font-mono">{{ formatCurrency(s.amount) }}</td>
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
