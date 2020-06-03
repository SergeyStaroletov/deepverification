import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { firestorePlugin } from "vuefire";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/ru-RU";
import firebase from "./firebase";
import VueTimeago from "vue-timeago";

firebase.auth().onAuthStateChanged(function(user) {
  Vue.config.productionTip = false;
  Vue.use(ElementUI, { locale });
  Vue.use(firestorePlugin);
  Vue.use(VueTimeago, {
    name: "Timeago", // Component name, `Timeago` by default
    locale: "ru", // Default locale
    // We use `date-fns` under the hood
    // So you can use all locales from it
    locales: {
      ru: require("date-fns/locale/ru")
    }
  });

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
