<script setup lang="ts">
import { OnboardingStep, UserResponse } from '../types';

definePageMeta({
  middleware: 'auth',
});

const { user } = useUser();
console.log('user.value in onboarding', user.value);
if (!user.value) {
  const { data } = await useFetch<UserResponse>('/api/users/me');
  console.log('fetched user in onboarding', data.value);
  if (data.value && data.value.data) {
    user.value = data.value.data;
  }
}

const onboardingStep = computed(() => user.value?.onboardingStep);
if (onboardingStep.value === OnboardingStep.Completed) {
  navigateTo('/dashboard');
}
</script>

<template>
  <UContainer>
    <div class="max-w-lg mx-auto my-6">
      <FamilyForm v-if="onboardingStep === OnboardingStep.Family" />
      <AddMembers v-else-if="onboardingStep === OnboardingStep.Members" />
      <AddJars v-else-if="onboardingStep === OnboardingStep.Jars" />
    </div>
  </UContainer>
</template>
