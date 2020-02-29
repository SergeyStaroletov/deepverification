<template>
  <div class="flex-wrapper">
    <el-card class="box-card">
      <div class="content">
        <h1>deepverification</h1>
        <p>
          Приветственный текст сверху, в двух словах про то какие проблемы
          решает проект и все такое на несколько строк.
        </p>
        <p>
          Да это украдено с медиум.
        </p>
        <el-button @click="login" class="button">
          <img class="google" src="../assets/google.svg" />
          Продолжить с Google</el-button
        >
        <p id="bottom-text">Еще немного текста снизу, может со ссылками или копирайтами.</p>
      </div>
    </el-card>
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

<style scoped>
.flex-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.box-card {
  width: 50%;
  min-width: 500px;
  height: 60vh;
  margin-bottom: 10vh;
  display: flex;
  /*align-items: center;*/
  justify-content: center;
  text-align: center;
}

.content {
  margin: 0 200px 0 200px;
  height: 100%;
  position:relative;
}

.google {
  vertical-align: text-bottom;
  display: inline-block;
  width: 16px;
  height: 16px;
}

.button {
  margin: 20px;
}

#bottom-text {
  position: absolute;
  bottom: 0px;
}
</style>
