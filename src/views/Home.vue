<template>
  <div class="home">
    Главная
    <p>{{ user.displayName }}</p>
    <img :src="user.photoURL" />
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "home",
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  components: {}
};
</script>
