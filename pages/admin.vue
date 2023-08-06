<script setup lang="ts">
import { AdminResponse } from '../types';

definePageMeta({ layout: 'admin' });
console.log('inside the admin page');

const loading = ref(false);
const prompt = ref('');
const result = ref();
const errors = ref({ prompt: '', result: '' });

const onSubmit = async () => {
  errors.value.prompt = '';
  errors.value.result = '';

  if (!prompt.value) {
    errors.value.prompt = 'Please enter your prompt';
    return;
  }

  loading.value = true;
  try {
    const { data } = await useFetch<AdminResponse>('/api/admin', {
      method: 'POST',
      body: { prompt: prompt.value },
    });

    console.log('response from the query', data.value);
    if (data.value?.data) {
      result.value = data.value.data.data;
    } else {
      errors.value.result =
        'Failed to perform the request. Please try again later';
    }
  } catch (error) {
    console.log('failed to fetch the result', error);
    errors.value.result =
      'Failed to perform the request. Please try again later';
  }

  loading.value = false;
};
</script>

<template>
  <UCard>
    <h2 class="text-lg md:text-xl">Make DB query</h2>
    <form class="mt-4" @submit.prevent="onSubmit">
      <UFormGroup
        name="query"
        label="Your query prompt"
        :error="errors.prompt"
        required
      >
        <UInput
          v-model.trim="prompt"
          placeholder="what's on your mind?"
          icon="i-heroicons-chat-bubble-left-ellipsis-solid"
        />
      </UFormGroup>
      <Alert
        v-if="errors.result"
        :message="errors.result"
        class="mt-6"
        @alert-dismiss="errors.result = ''"
      />
      <UButton class="mt-6" block :loading="loading" type="submit">
        Make request
      </UButton>
    </form>
  </UCard>
  <UCard class="mt-6 card-content">
    <h2 class="text-lg md:text-xl mb-4">Query response</h2>
    <p v-if="!result" class="mt-8">
      Please make a request by typing your prompt in the above text box.
    </p>
    <div v-else>
      <p class="mb-8">
        <strong class="mr-2">Executed Query:</strong>{{ result.result.sql }}
      </p>
      <UTable :rows="result.rows" />
    </div>
  </UCard>
</template>

<style scoped>
.card-content {
  max-width: calc(72rem - 240px);
  overflow-x: auto;
}
</style>
