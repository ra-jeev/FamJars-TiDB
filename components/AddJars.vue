<script setup lang="ts">
import { OnboardingStep } from '../types';
import { JarsResponse, FamilyResponse } from '../types';

const { user } = useUser();
const { family } = useFamily();

const emit = defineEmits(['jarsCreated']);

if (!family.value || !family.value.members) {
  const { data } = await useFetch<FamilyResponse>('/api/families/me');
  console.log('family response in add jars', data.value);
  if (data.value && data.value.data) {
    family.value = data.value.data;
  }
}

const defaultJar = {
  name: '',
  balance: '',
  autoCreditAmount: '',
  autoCreditSchedule: '',
  ownerId: '',
};

const newJars = ref([{ ...defaultJar }]);

const errors = ref({ form: '', errors: [{ ...defaultJar }] });
const loading = ref(false);

const addJars = async () => {
  loading.value = true;
  try {
    const { data: addJarsRes } = await useFetch<JarsResponse>('/api/jars', {
      method: 'POST',
      body: {
        jars: newJars.value,
      },
    });

    console.log('response of add jars', addJarsRes.value);
    if (addJarsRes.value && addJarsRes.value.data) {
      if (user.value?.onboardingStep === OnboardingStep.Jars) {
        user.value.onboardingStep = OnboardingStep.Completed;
        navigateTo('/dashboard');
      }
    }

    emit('jarsCreated');
  } catch (error) {
    console.log('error is adding members', error);
  }

  loading.value = false;
};

const onAddBtn = () => {
  newJars.value.push({ ...defaultJar });
  errors.value.errors.push({ ...defaultJar });
};

const onDelete = (index: number) => {
  newJars.value.splice(index, 1);
  errors.value.errors.splice(index, 1);
};
</script>

<template>
  <UCard>
    <form id="membersForm" class="space-y-6" @submit.prevent="addJars">
      <div class="flex justify-between items-baseline">
        <h2 class="text-2xl font-medium">Add Jars</h2>

        <UButton
          icon="i-heroicons-plus"
          size="2xs"
          variant="outline"
          @click="onAddBtn"
        >
          Add
        </UButton>
      </div>

      <template v-if="newJars.length">
        <AddJar
          v-for="(jar, index) in newJars"
          :key="`jar-${index}`"
          :jar="jar"
          :errors="errors.errors[index]"
          :members="family?.members || []"
          :index="index"
          @delete-jar="onDelete"
        />

        <Alert
          v-if="errors.form"
          :message="errors.form"
          @alert-dismiss="errors.form = ''"
        />

        <UButton form="membersForm" block :loading="loading" type="submit">
          Add Jars
        </UButton>
      </template>
      <p v-else class="text-center py-4">Please add at least one jar</p>
    </form>
  </UCard>
</template>
