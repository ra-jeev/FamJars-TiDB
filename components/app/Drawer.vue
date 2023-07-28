<script setup lang="ts">
const emit = defineEmits(['drawerClose']);

const onLinkClick = () => {
  emit('drawerClose');
};

const links = [
  {
    label: 'Dashboard',
    icon: 'i-heroicons-home',
    to: '/dashboard',
    click: onLinkClick,
  },
  {
    label: 'Family',
    icon: 'i-heroicons-user-group',
    to: '/family',
    click: onLinkClick,
  },
  {
    label: 'Transactions',
    icon: 'i-heroicons-arrows-right-left-20-solid',
    to: '/transactions',
    click: onLinkClick,
  },
];
</script>

<template>
  <div class="app-drawer py-4 md:pr-4">
    <UVerticalNavigation
      :links="links"
      :ui="{
        padding: 'px-4 py-3',
        size: 'text-sm',
        icon: { base: 'w-6 h-6' },
        avatar: { size: 'xs' },
      }"
    />
  </div>
</template>

<style scoped>
.app-drawer {
  min-width: 240px;
  height: calc(100vh - 64px);
}
</style>
