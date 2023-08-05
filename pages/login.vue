<script setup lang="ts">
definePageMeta({
  layout: 'auth',
});

const client = useSupabaseClient();

const showPassword = ref(false);
const form = ref({ email: '', password: '' });
const errors = ref({ email: '', password: '', form: '' });
const loading = ref(false);

const onSubmit = async () => {
  const email = form.value.email;
  const password = form.value.password;

  errors.value = { email: '', password: '', form: '' };

  let hasError = false;

  if (!email) {
    errors.value.email = 'Please enter a valid email address';
    hasError = true;
  }

  if (!password || password.length < 8) {
    errors.value.password = 'Password should at least be 8 characters';
    hasError = true;
  }

  if (hasError) {
    return;
  }

  loading.value = true;
  try {
    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      errors.value.form =
        error.message || 'Failed to sign in. Pleases try again later.';
    }
  } catch (error) {
    errors.value.form = 'Failed to sign in. Pleases try again later.';

    console.log(error);
  }

  loading.value = false;
};
</script>

<template>
  <UCard class="max-w-md w-full mt-10">
    <h2 class="text-2xl font-medium text-center">Sign in to your account</h2>

    <form class="my-8" @submit.prevent="onSubmit">
      <UFormGroup
        name="email"
        label="Your email"
        :error="errors.email"
        required
      >
        <UInput
          v-model="form.email"
          placeholder="you@example.com"
          icon="i-heroicons-envelope"
          type="email"
        />
      </UFormGroup>

      <UFormGroup
        name="password"
        label="Your password"
        :error="errors.password"
        class="mt-6"
        required
      >
        <UInput
          v-model.trim="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="password"
          icon="i-heroicons-key"
          :ui="{ icon: { trailing: { pointer: '' } } }"
        >
          <template #trailing>
            <UButton
              v-if="showPassword"
              icon="i-heroicons-eye-slash-solid"
              :padded="false"
              color="gray"
              variant="link"
              @click="showPassword = false"
            />
            <UButton
              v-else
              icon="i-heroicons-eye-solid"
              :padded="false"
              color="gray"
              variant="link"
              @click="showPassword = true"
            />
          </template>
        </UInput>
      </UFormGroup>

      <Alert
        v-if="errors.form"
        :message="errors.form"
        class="mt-6"
        @alert-dismiss="errors.form = ''"
      />

      <UButton class="mt-8" block :loading="loading" type="submit">
        Sign in
      </UButton>
    </form>

    <div
      class="text-sm font-medium text-gray-500 dark:text-gray-300 text-center"
    >
      Don't have an account?
      <UButton variant="link" :padded="false" to="/register">
        Create one now
      </UButton>
    </div>
  </UCard>
</template>
