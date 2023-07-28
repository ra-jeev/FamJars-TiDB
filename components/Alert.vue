<script setup lang="ts">
defineProps({
  message: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'red',
  },
});
</script>

<template>
  <div
    :class="`text-${color}-800 border-${color}-300 bg-${color}-50 dark:text-${color}-400 dark:border-${color}-800`"
    class="flex items-center p-4 mb-4 border rounded-lg dark:bg-gray-900"
    role="alert"
  >
    <UIcon name="i-heroicons-information-circle-solid" />
    <span class="sr-only">Info</span>

    <span class="text-sm ml-3">
      {{ message }}
    </span>

    <UButton
      icon="i-heroicons-x-mark"
      :padded="false"
      :color="color"
      variant="link"
      class="ml-auto"
      @click="$emit('alertDismiss')"
    />
  </div>
</template>
