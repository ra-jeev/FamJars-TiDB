<script setup lang="ts">
import { AddMembersResponse, OnboardingStep } from '../types';

const { user } = useUser();

const emit = defineEmits(['membersAdded']);

const defaultMember = {
  name: '',
  email: '',
  password: '',
  role: '',
};

const members = ref([{ ...defaultMember }]);

const errors = ref({ form: '', errors: [{ ...defaultMember }] });
const loading = ref(false);

const addMembers = async () => {
  loading.value = true;
  try {
    const { data } = await useFetch<AddMembersResponse>(`/api/families`, {
      method: 'POST',
      body: {
        type: 'ADD_MEMBERS',
        familyId: user.value?.familyId,
        members: members.value,
      },
    });

    console.log('response of add members', data.value);
    if (data.value && data.value.status === 'ok') {
      if (user.value?.onboardingStep === OnboardingStep.Members) {
        user.value.onboardingStep = OnboardingStep.Jars;
      }
    }

    emit('membersAdded');
  } catch (error) {
    console.log('error is adding members', error);
  }

  loading.value = false;
};

const onAddBtn = () => {
  members.value.push({ ...defaultMember });
  errors.value.errors.push({ ...defaultMember });
};

const onDelete = (index: number) => {
  members.value.splice(index, 1);
  errors.value.errors.splice(index, 1);
};
</script>

<template>
  <UCard>
    <form id="membersForm" class="space-y-6" @submit.prevent="addMembers">
      <div class="flex justify-between items-baseline">
        <h2 class="text-2xl font-medium">Add family members</h2>
        <UButton
          icon="i-heroicons-plus"
          size="2xs"
          variant="outline"
          @click="onAddBtn"
        >
          Add
        </UButton>
      </div>

      <template v-if="members.length">
        <AddMember
          v-for="(member, index) in members"
          :key="`member-${index}`"
          :member="member"
          :errors="errors.errors[index]"
          :index="index"
          @delete-member="onDelete"
        />

        <Alert
          v-if="errors.form"
          :message="errors.form"
          @alert-dismiss="errors.form = ''"
        />

        <UButton form="membersForm" block :loading="loading" type="submit">
          Add Members
        </UButton>
      </template>
      <p v-else class="text-center py-4">
        Please add at least one family member
      </p>
    </form>
  </UCard>
</template>
