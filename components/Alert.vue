<script setup lang="ts">
defineProps({
  message: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div
    class="flex items-center p-4 mb-4 border rounded-lg bg-transparent text-red-500 border-red-500"
    role="alert"
  >
    <UIcon name="i-heroicons-exclamation-triangle-solid" />
    <span class="sr-only">Alert</span>

    <span class="text-sm ml-3">
      {{ message }}
    </span>

    <UButton
      icon="i-heroicons-x-mark"
      :padded="false"
      color="red"
      variant="link"
      class="ml-auto"
      @click="$emit('alertDismiss')"
    />
  </div>
</template>
