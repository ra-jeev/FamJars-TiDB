<script setup lang="ts">
import { OnboardingStep, UserResponse } from '../types';

const { user } = useUser();
const isOpen = ref(false);

const { data } = await useFetch<UserResponse>('/api/users/me');
console.log('fetched user in authenticated layout', data.value);
if (data.value && data.value.data) {
  user.value = data.value.data;
}

if (user.value?.onboardingStep !== OnboardingStep.Completed) {
  navigateTo('/onboarding');
}
</script>

<template>
  <div class="flex flex-col bg-white dark:bg-gray-950 min-h-screen">
    <AppNavbar @drawer-open="isOpen = true" />
    <div class="flex-grow">
      <UContainer :ui="{ constrained: 'max-w-5xl' }">
        <div class="flex">
          <AppDrawer class="hidden md:block" />
          <div class="w-full lg:px-6 py-6">
            <slot />
          </div>
        </div>
      </UContainer>
    </div>
    <USlideover :ui="{ width: 'max-w-xs' }" class="md:hidden" v-model="isOpen">
      <div class="flex justify-between items-center p-4">
        <AppLogo @click="isOpen = false" />
        <UButton
          icon="i-heroicons-x-mark-solid"
          size="xs"
          :padding="false"
          color="white"
          variant="soft"
          @click="isOpen = false"
        />
      </div>
      <AppDrawer @drawer-close="isOpen = false" />
    </USlideover>
  </div>
</template>
