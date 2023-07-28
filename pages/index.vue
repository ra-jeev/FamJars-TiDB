<script setup lang="ts">
const user = useSupabaseUser();
</script>

<template>
  <div>
    <section
      class="bg-cover bg-center bg-image bg-no-repeat bg-gray-500 bg-blend-multiply"
    >
      <div class="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-48">
        <h1
          class="mb-6 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl md:px-16 lg:px-36"
        >
          Manage your family money jars digitally
        </h1>
        <p
          class="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-56"
        >
          Family member logins, child mode, multiple jars tracking, and much
          more...
        </p>
        <div v-if="!user">
          <UButton
            icon="i-heroicons-arrow-right-solid"
            trailing
            size="xl"
            to="/register"
          >
            Get started
          </UButton>

          <span class="text-gray-300 ml-4"> It's free! </span>
        </div>
        <UButton
          v-else
          icon="i-heroicons-arrow-right-solid"
          trailing
          size="xl"
          to="/dashboard"
        >
          Your Dashboard
        </UButton>
      </div>
    </section>

    <UContainer class="py-14">
      <h2
        class="text-3xl text-center font-bold tracking-tight leading-none text-white md:text-4xl lg:text-5xl"
      >
        Benefits
      </h2>
      <div class="flex flex-wrap gap-6 justify-center mt-16">
        <UCard class="w-full md:w-1/2 lg:w-1/3">
          <div>
            <UIcon
              name="i-heroicons-user-group-solid"
              class="text-4xl md:text-5xl lg:text-6xl primary-icon"
            />
          </div>
          <h3
            class="mt-4 text-lg font-medium text-white md:text-xl lg:text-2xl"
          >
            Separate members accounts
          </h3>
          <p class="mt-2 text-md text-gray-300">
            Invite your family members. Everyone gets a separate login. Support
            for child mode.
          </p>
        </UCard>
        <UCard class="w-full md:w-1/2 lg:w-1/3">
          <div>
            <UIcon
              name="i-heroicons-circle-stack-solid"
              class="text-4xl md:text-5xl lg:text-6xl primary-icon"
            />
          </div>
          <h3
            class="mt-4 text-lg font-medium text-white md:text-xl lg:text-2xl"
          >
            Multiple jars tracking
          </h3>
          <p class="mt-2 text-md text-gray-300">
            Supprot for creating and managing more than one jar per family
            member.
          </p>
        </UCard>
        <UCard class="w-full md:w-1/2 lg:w-1/3">
          <div>
            <UIcon
              name="i-heroicons-currency-dollar-solid"
              class="text-4xl md:text-5xl lg:text-6xl primary-icon"
            />
          </div>
          <h3
            class="mt-4 text-lg font-medium text-white md:text-xl lg:text-2xl"
          >
            Auto credit option
          </h3>
          <p class="mt-2 text-md text-gray-300">
            Option to configure auto credit amount and corresponding schedule
            for any of your jars.
          </p>
        </UCard>
        <UCard class="w-full md:w-1/2 lg:w-1/3">
          <div>
            <UIcon
              name="i-heroicons-arrows-right-left-solid"
              class="text-4xl md:text-5xl lg:text-6xl primary-icon"
            />
          </div>
          <h3
            class="mt-4 text-lg font-medium text-white md:text-xl lg:text-2xl"
          >
            Ad-hoc credit/debit support
          </h3>
          <p class="mt-2 text-md text-gray-300">
            Do ad-hoc transactions on your jars. Support the transactions with
            appropriate comments.
          </p>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.bg-image {
  background-image: url('~/assets/images/home-page.jpeg');
}

.primary-icon {
  color: var(--app-primary);
}
</style>
