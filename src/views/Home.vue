<template>
  <div class="home">
    <h4>Главная</h4>
    <p>{{ user.displayName }}</p>
    <img :src="user.photoURL" width="64" />
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from "firebase";

export default {
  name: "home",
  computed: {
    user() {
      return firebase.auth().currentUser;
    }
  },
  components: {}
};
</script>
