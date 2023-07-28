<script setup lang="ts">
import { FamilyResponse, Role } from '../types';

const { user } = useUser();
const { family } = useFamily();
const isOpen = ref(false);

definePageMeta({
  layout: 'authenticated',
});

const isChild = computed(() => user.value?.role === Role.Child);

const columns = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'role',
    label: 'Role',
  },
];

const { data } = await useFetch<FamilyResponse>('/api/families/me');
if (data.value && data.value.data) {
  family.value = data.value.data;
}

const onMembersAdded = async () => {
  isOpen.value = false;
  const { data: updateFamily } = await useFetch<FamilyResponse>(
    '/api/families/me'
  );

  if (updateFamily.value && updateFamily.value.data) {
    family.value = updateFamily.value.data;
  }
};
</script>

<template>
  <UCard>
    <div class="flex justify-between items-baseline">
      <h2 v-if="family" class="text-lg md:text-2xl mb-4">
        {{ family.name }}
      </h2>
      <UButton
        v-if="!isChild"
        icon="i-heroicons-plus"
        size="xs"
        variant="outline"
        @click="isOpen = true"
      >
        Add Member
      </UButton>
    </div>
    <UTable :rows="family?.members" :columns="columns" />

    <UModal v-model="isOpen">
      <AddMembers @members-added="onMembersAdded" />
    </UModal>
  </UCard>
</template>
