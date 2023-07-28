<script setup lang="ts">
import { currencies, getLocalCurrency } from '../utils';
import { FamilyResponse, Currency, OnboardingStep } from '../types';

const { user } = useUser();
const { family } = useFamily();

const familyName = ref('');
const errors = ref({ family: '', currency: '', form: '' });
const loading = ref(false);

const selectedCurrency = ref<Currency>();

onMounted(() => {
  const localCurrency = getLocalCurrency();
  if (localCurrency) {
    selectedCurrency.value = localCurrency;
  }
});

const onSubmit = async () => {
  let hasError = false;
  errors.value = { family: '', currency: '', form: '' };

  if (!familyName.value) {
    errors.value.family = 'Please enter a family name';
    hasError = true;
  }

  if (!selectedCurrency.value) {
    errors.value.currency = 'Please select your currency';
    hasError = true;
  }

  if (hasError) {
    return;
  }

  loading.value = true;
  try {
    const { data } = await useFetch<FamilyResponse>(`/api/families`, {
      method: 'POST',
      body: {
        type: 'CREATE',
        name: familyName.value,
        currencyCode: selectedCurrency.value?.code,
      },
    });

    console.log('create family response', data.value);
    if (data.value && data.value.data) {
      family.value = data.value.data;
      if (user.value) {
        user.value.familyId = data.value.data.id;
        user.value.onboardingStep = OnboardingStep.Members;
      }
    }
  } catch (error) {
    console.log(error);
    errors.value.form = 'Failed to create family. Pleases try again later.';
  }

  loading.value = false;
};
</script>

<template>
  <UCard>
    <form id="familyForm" class="space-y-6" @submit.prevent="onSubmit">
      <h2 class="text-2xl font-medium">Hi {{ user?.name }} 👋,</h2>

      <p>
        Welcome to <strong>FamJars</strong>. Let's get started by creating your
        family.
      </p>

      <UFormGroup
        name="family"
        label="Your family name"
        :error="errors.family"
        required
      >
        <UInput
          v-model.trim="familyName"
          placeholder="Give your family a name"
          icon="i-heroicons-user-group"
        />
      </UFormGroup>

      <UFormGroup
        name="currency"
        label="Your currency"
        :error="errors.currency"
        required
      >
        <USelectMenu
          v-model="selectedCurrency"
          :options="currencies"
          option-attribute="name"
          searchable
        >
          <template #label>
            <span v-if="selectedCurrency" class="truncate">
              {{
                selectedCurrency.name +
                ' (' +
                selectedCurrency.symbolNative +
                ')'
              }}
            </span>
            <span v-else>Select</span>
          </template>
        </USelectMenu>
      </UFormGroup>

      <Alert
        v-if="errors.form"
        :message="errors.form"
        @alert-dismiss="errors.form = ''"
      />

      <UButton form="familyForm" block :loading="loading" type="submit">
        Create your family
      </UButton>
    </form>
  </UCard>
</template>
