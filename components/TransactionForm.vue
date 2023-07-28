<script setup lang="ts">
import { TransactionResponse, TransactionType } from '../types';

const form = ref({ amount: '', comment: '' });
const errors = ref({ amount: '', comment: '', form: '' });
const loading = ref(false);

const props = defineProps({
  isCredit: {
    type: Boolean,
    default: true,
  },
  jar: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['transactionCancel', 'transactionDone']);

const onSubmit = async () => {
  errors.value = { amount: '', comment: '', form: '' };

  if (!form.value.amount) {
    errors.value.amount = 'Please enter the amount';
    return;
  }

  if (!form.value.comment) {
    errors.value.comment = 'Please add transaction comment';
    return;
  }

  loading.value = true;
  try {
    const { data } = await useFetch<TransactionResponse>('/api/transactions', {
      method: 'POST',
      body: {
        amount: form.value.amount,
        comment: form.value.comment,
        type: props.isCredit ? TransactionType.Credit : TransactionType.Debit,
        jarId: props.jar.id,
      },
    });

    console.log('transaction res', data.value);

    if (data.value?.status === 'ok') {
      emit('transactionDone');
    }
  } catch (error) {
    console.log('failed to create transaction', error);
    errors.value.form =
      'Failed to create transaction. Pleases try again later.';
  }

  loading.value = false;
};
</script>

<template>
  <UCard>
    <form class="space-y-6" @submit.prevent="onSubmit">
      <div class="text-lg md:text-2xl">
        {{ isCredit ? 'Add Money' : 'Deduct Money' }}
        <small class="dark:text-gray-400">({{ jar.name }})</small>
      </div>

      <UFormGroup
        name="amount"
        :label="`Amount to ${isCredit ? 'Add' : 'Deduct'}`"
        required
      >
        <UInput
          v-model.number="form.amount"
          placeholder="Amount"
          icon="i-heroicons-currency-dollar"
          type="number"
          step="0.1"
        />
      </UFormGroup>
      <UFormGroup name="comment" label="Transaction comment" required>
        <UInput
          v-model.trim="form.comment"
          placeholder="Add a comment"
          icon="i-heroicons-document-text"
        />
      </UFormGroup>

      <Alert
        v-if="errors.form"
        :message="errors.form"
        @alert-dismiss="errors.form = ''"
      />

      <div class="flex gap-4">
        <UButton
          :disabled="loading"
          class="flex-grow justify-center"
          variant="outline"
          @click="$emit('transactionCancel')"
        >
          Cancel
        </UButton>
        <UButton
          class="flex-grow justify-center"
          :loading="loading"
          type="submit"
        >
          Confirm
        </UButton>
      </div>
    </form>
  </UCard>
</template>
