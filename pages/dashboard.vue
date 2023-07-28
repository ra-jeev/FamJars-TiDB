<script setup lang="ts">
import {
  Jar,
  JarsResponse,
  Transaction,
  TransactionsResponse,
  Role,
} from '../types';

definePageMeta({
  middleware: 'auth',
  layout: 'authenticated',
});

const { user } = useUser();
const jars = ref<Jar[]>([]);
const transactions = ref<Transaction[]>([]);

const { data } = await useFetch<JarsResponse>('/api/jars');
if (data.value && data.value.data) {
  jars.value = data.value.data;
}

const { data: transactionsRes } = await useFetch<TransactionsResponse>(
  '/api/transactions',
  { query: { limit: 10 } }
);
if (transactionsRes.value && transactionsRes.value.data) {
  transactions.value = transactionsRes.value.data;
}

const isOpen = ref(false);
const isChild = computed(() => user.value?.role === Role.Child);

const refreshData = async () => {
  isOpen.value = false;
  const { data: updatedJars } = await useFetch<JarsResponse>('/api/jars');
  if (updatedJars.value && updatedJars.value.data) {
    jars.value = updatedJars.value.data;
  }

  const { data: updatedTransactions } = await useFetch<TransactionsResponse>(
    '/api/transactions',
    { query: { limit: 10 } }
  );
  if (updatedTransactions.value && updatedTransactions.value.data) {
    transactions.value = updatedTransactions.value.data;
  }
};
</script>

<template>
  <div>
    <div class="flex justify-between items-baseline">
      <h2 class="text-lg md:text-2xl">
        {{ isChild ? 'Your jars' : 'All family jars' }}
      </h2>
      <UButton
        v-if="!isChild"
        icon="i-heroicons-plus"
        size="xs"
        variant="outline"
        @click="isOpen = true"
      >
        Add Jar
      </UButton>
    </div>

    <div v-for="jar in jars" :key="jar.id" class="w-full mt-6 mx-auto">
      <JarCard :jar="jar" @refresh-dashboard="refreshData" />
    </div>

    <h3 class="text-lg md:text-xl mt-6">Recent Transactions</h3>
    <div
      v-for="transaction in transactions"
      :key="transaction.id"
      class="w-full mt-6 mx-auto"
    >
      <TransactionCard
        :transaction="transaction"
        @transaction-approved="refreshData"
      />
    </div>
    <UModal v-model="isOpen">
      <AddJars @jars-created="refreshData" />
    </UModal>
  </div>
</template>
