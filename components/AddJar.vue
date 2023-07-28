<script setup lang="ts">
import { Schedule } from '../types';

defineProps({
  jar: {
    type: Object,
    required: true,
  },
  errors: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  members: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['deleteJar']);

const schedules = Object.values(Schedule);
</script>

<template>
  <UCard
    :ui="{
      background: 'bg-gray-100 dark:bg-gray-800',
    }"
  >
    <div class="space-y-4">
      <div class="flex justify-between items-baseline">
        <span class="font-medium">{{ jar.name || `Jar ${index + 1}:` }}</span>
        <UButton
          icon="i-heroicons-trash"
          size="2xs"
          color="red"
          variant="outline"
          @click="emit('deleteJar', index)"
        />
      </div>
      <UFormGroup name="name" label="Jar's name" :error="errors.name" required>
        <UInput
          v-model.trim="jar.name"
          placeholder="John's jar"
          icon="i-heroicons-wallet"
        />
      </UFormGroup>

      <UFormGroup name="owner" label="Jar owner" :error="errors.ownerId">
        <USelect
          leading-icon="i-heroicons-user"
          v-model="jar.ownerId"
          :options="members"
          option-attribute="name"
          value-attribute="id"
          placeholder="Select"
        />
      </UFormGroup>

      <UFormGroup
        name="balance"
        label="Starting balance"
        :errors="errors.balance"
        required
      >
        <UInput
          v-model.number="jar.balance"
          placeholder="A/c balance"
          icon="i-heroicons-currency-dollar"
          type="number"
          step="0.1"
        />
      </UFormGroup>

      <UFormGroup
        name="autoCreditAmount"
        label="Auto credit amount"
        :error="errors.autoCreditAmount"
      >
        <UInput
          v-model.number="jar.autoCreditAmount"
          placeholder="Amount to be credited"
          icon="i-heroicons-currency-dollar"
          type="number"
          step="0.1"
        />
      </UFormGroup>

      <UFormGroup
        name="schedule"
        label="Auto credit schedule"
        :error="errors.autoCreditSchedule"
      >
        <USelect
          leading-icon="i-heroicons-check-badge"
          v-model="jar.autoCreditSchedule"
          :options="schedules"
          placeholder="Select"
        />
      </UFormGroup>
    </div>
  </UCard>
</template>
