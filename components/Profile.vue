<script setup lang="ts">
import '@passageidentity/passage-elements/passage-profile';

const {
  public: { passageAppId },
} = useRuntimeConfig();
</script>

<template>
  <UCard class="profile-card">
    <passage-profile :app-id="passageAppId" />
  </UCard>
</template>
