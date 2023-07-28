<script setup lang="ts">
import { getCurrencySymbol } from '../utils';

const props = defineProps({
  jar: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['refreshDashboard']);

const { user } = useUser();
const isOpen = ref(false);
const isCredit = ref(true);

const currencySymbol = computed(() =>
  getCurrencySymbol(user.value?.family?.currencyCode)
);

const autoCredit = computed(() => {
  if (props.jar) {
    return (
      currencySymbol.value +
      (props.jar.autoCreditAmount || 0) +
      (props.jar.autoCreditSchedule ? ', ' + props.jar.autoCreditSchedule : '')
    );
  }

  return '';
});

const openModal = (credit: boolean) => {
  isCredit.value = credit;
  isOpen.value = true;
};

const onTransactionDone = () => {
  isOpen.value = false;
  emit('refreshDashboard');
};
</script>

<template>
  <UCard>
    <div class="flex items-center">
      <div class="text-center">
        <div class="text-5xl md:text-7xl">💰</div>
        <div class="text-xs dark:text-gray-400 mt-2">Credit:</div>
        <div class="text-xs dark:text-gray-300">{{ autoCredit }}</div>
      </div>
      <div class="ml-6">
        <div class="text-md dark:text-gray-300">
          {{ jar.name }} <small>({{ jar.owner.name }})</small>
        </div>

        <div class="text-medium text-3xl mt-3 mb-4">
          {{ currencySymbol }}{{ jar.balance }}
        </div>
        <div v-if="jar.nextMoneyAt" class="text-sm dark:text-amber-400 mb-4">
          Next credit: {{ new Date(jar.nextMoneyAt).toLocaleString() }}
        </div>
        <div>
          <UButton size="2xs" variant="outline" @click="openModal(false)">
            Deduct Money
          </UButton>
          <UButton class="ml-4" size="2xs" @click="openModal(true)">
            Add Money
          </UButton>
        </div>
      </div>
    </div>

    <UModal :model-value="isOpen">
      <TransactionForm
        :isCredit="isCredit"
        :jar="jar"
        @transaction-cancel="isOpen = false"
        @transaction-done="onTransactionDone"
      />
    </UModal>
  </UCard>
</template>
