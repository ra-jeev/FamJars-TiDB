<script setup lang="ts">
import { Transaction, TransactionsResponse } from '../types';

const transactions = ref<Transaction[]>([]);

definePageMeta({
  layout: 'authenticated',
});

const { data, pending } = await useFetch<TransactionsResponse>(
  '/api/transactions'
);

if (data.value && data.value.data) {
  transactions.value = data.value.data;
}
</script>

<template>
  <div>
    <h2 class="text-xl md:text-2xl mb-4">Transactions</h2>
    <p v-if="pending" class="text-center">Loading...</p>
    <template v-else>
      <div
        v-for="transaction in transactions"
        :key="transaction.id"
        class="w-full mt-6 mx-auto"
      >
        <TransactionCard :transaction="transaction" />
      </div>
    </template>
  </div>
</template>
