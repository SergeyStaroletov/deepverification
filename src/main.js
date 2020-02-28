import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/ru-RU";
import firebaseConfig from "./firebaseConfig";

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function(user) {
  Vue.config.productionTip = false;
  Vue.use(ElementUI, { locale });

  new Vue({
    router,
    store,
    created() {
      if (!user) {
        router.replace({ name: "login" }).catch(err => {});
      }
    },
    render: h => h(App)
  }).$mount("#app");
});
