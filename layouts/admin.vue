<script setup lang="ts">
const { auth } = useSupabaseClient();
const user = useSupabaseUser();

const isOpen = ref(false);

const isSuperAdmin = computed(
  () => user.value?.user_metadata.role === 'SuperAdmin'
);

const loading = ref(false);

const signOut = async () => {
  loading.value = true;
  const { error } = await auth.signOut();
  if (error) {
    console.log('failed to sign out', error);
  }

  loading.value = false;
};
</script>

<template>
  <div class="flex flex-col bg-white dark:bg-gray-950 min-h-screen">
    <template v-if="user">
      <template v-if="isSuperAdmin">
        <AppNavbar @drawer-open="isOpen = true" />
        <div class="flex-grow">
          <UContainer :ui="{ constrained: 'max-w-6xl' }" class="flex">
            <AdminDrawer class="hidden md:block" />
            <div class="flex-grow py-4">
              <slot />
            </div>
          </UContainer>
        </div>
        <USlideover
          :ui="{ width: 'max-w-xs' }"
          class="md:hidden"
          v-model="isOpen"
        >
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
          <AdminDrawer @drawer-close="isOpen = false" />
        </USlideover>
      </template>

      <div v-else class="flex flex-col flex-grow items-center justify-center">
        <UCard class="max-w-md w-full text-center">
          <template #header>
            <h2 class="text-2xl">Insufficient Permissions</h2>
          </template>
          <p>You do not have the Super Admin privileges.</p>
          <p class="mt-2">Please sign out, and sign in as a Super Admin.</p>
          <template #footer>
            <UButton block @click="signOut" :loading="loading">
              Sign Out
            </UButton>
          </template>
        </UCard>
      </div>
    </template>
    <div v-else class="flex flex-col flex-grow items-center justify-center">
      <AdminLogin />
    </div>
  </div>
</template>
