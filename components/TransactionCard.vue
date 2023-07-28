<script setup lang="ts">
import {
  Role,
  Transaction,
  TransactionResponse,
  TransactionType,
} from '../types';
import { getCurrencySymbol } from '../utils';

const { user } = useUser();

const loading = ref(false);
const props = defineProps({
  transaction: {
    type: Object as PropType<Transaction>,
    required: true,
  },
});

const isChild = computed(() => user.value?.role === Role.Child);

const currencySymbol = computed(() =>
  getCurrencySymbol(user.value?.family?.currencyCode)
);

const icon = computed(() => {
  if (props.transaction.type === TransactionType.Credit) {
    if (props.transaction.comment === 'Auto credit') {
      return '💪';
    }

    return '🤑';
  }

  return '😥';
});

const approveTransaction = async () => {
  loading.value = true;
  const { data } = await useFetch<TransactionResponse>(
    `/api/transactions/${props.transaction.id}`,
    {
      method: 'PATCH',
      body: {
        pending: false,
      },
    }
  );

  console.log('response of approveTransaction', data.value);
  if (data.value?.status === 'ok' && !data.value.pending) {
    props.transaction.pending = false;
  }

  loading.value = false;
};
</script>

<template>
  <UCard>
    <div class="flex">
      <div class="text-center">
        <div class="text-3xl md:text-5xl">{{ icon }}</div>
      </div>
      <div class="mx-6 flex-grow">
        <div>
          <div class="text-md dark:text-gray-300">
            {{ transaction.comment }}
          </div>
          <div class="text-sm dark:text-gray-400">
            {{ transaction.jar?.name }}
          </div>
          <div class="flex items-center mt-3">
            <span class="text-xs dark:text-gray-400">
              {{ formatDateTime(transaction.updatedAt) }}
            </span>
          </div>
        </div>
      </div>

      <div class="text-center">
        <div>
          <UIcon
            v-if="transaction.pending"
            name="i-heroicons-exclamation-triangle-solid"
            class="mr-1 text-amber-400"
            color="red"
          />
          <span
            :class="`${
              transaction.type === TransactionType.Credit
                ? 'text-green-400'
                : 'text-red-400'
            }`"
            class="text-2xl md:text-3xl whitespace-nowrap"
          >
            {{ transaction.type === TransactionType.Credit ? '' : '-'
            }}{{ currencySymbol }}{{ transaction.amount }}
          </span>
        </div>
        <UButton
          v-if="transaction.pending && !isChild"
          class="mt-2"
          size="2xs"
          variant="soft"
          :loading="loading"
          @click="approveTransaction"
        >
          Approve
        </UButton>
      </div>
    </div>
  </UCard>
</template>
