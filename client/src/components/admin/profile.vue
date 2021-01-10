<template>
  <div>
    <div
      v-if="
        $store.state.isAdminLoggedIn && $store.state.admin.actor == 'supper'
      "
    >
      <p>Account Management</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>