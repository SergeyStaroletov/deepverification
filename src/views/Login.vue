<template>
  <div>
    <h3>Login</h3>
    <button @click="login">Войти</button>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  name: "login",
  methods: {
    login() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          this.$router.replace({ name: "home" });
        })
        .catch(err => {
          alert("Oops. " + err.message);
        });
    }
  }
};
</script>
