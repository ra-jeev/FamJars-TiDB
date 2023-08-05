<script setup lang="ts">
definePageMeta({
  layout: 'auth',
});

const { auth } = useSupabaseClient();

const showPassword = ref(false);
const form = ref({ name: '', email: '', password: '' });
const errors = ref({ name: '', email: '', password: '', form: '' });
const loading = ref(false);

const onSubmit = async () => {
  const name = form.value.name;
  const email = form.value.email;
  const password = form.value.password;

  errors.value = { name: '', email: '', password: '', form: '' };

  let hasError = false;

  if (!name || name.length < 3) {
    errors.value.name = 'Please enter your full name';
    hasError = true;
  }

  if (!email) {
    errors.value.email = 'Please enter a valid email address';
    hasError = true;
  }

  if (!password || password.length < 8) {
    errors.value.password = 'Password should be minimum 8 characters long';
    hasError = true;
  }

  if (hasError) {
    return;
  }

  loading.value = true;
  try {
    const res = await auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (res.error) {
      errors.value.form =
        'Failed to create your account. Pleases try again later.';

      console.log(res.error);
    } else {
      console.log('got some user', res.data);
      const { data } = await useFetch('/api/users', {
        method: 'POST',
      });

      console.log('response from the /api/users call', data);
      navigateTo('/onboarding');
    }
  } catch (error) {
    errors.value.form =
      'Failed to create your account. Pleases try again later.';

    console.log(error);
  }

  loading.value = false;
};
</script>

<template>
  <UCard class="max-w-md w-full mt-10">
    <h2 class="text-2xl font-medium text-center">Sign up for a new account</h2>

    <form class="my-8" @submit.prevent="onSubmit">
      <UFormGroup name="name" label="Your name" :error="errors.name" required>
        <UInput
          v-model.trim="form.name"
          placeholder="John Doe"
          icon="i-heroicons-user"
        />
      </UFormGroup>

      <UFormGroup
        name="email"
        label="Your email"
        :error="errors.email"
        class="mt-6"
        required
      >
        <UInput
          v-model.trim="form.email"
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
        Create your account
      </UButton>
    </form>

    <div
      class="text-sm font-medium text-gray-500 dark:text-gray-300 text-center"
    >
      Already have an account?
      <UButton variant="link" :padded="false" to="/login"> Login here </UButton>
    </div>
  </UCard>
</template>
