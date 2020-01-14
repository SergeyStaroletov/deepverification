import Vue from "vue";
import firebase from "firebase";
import Router from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login
    }
  ]
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next({ name: "login" });
  else if (!requiresAuth && currentUser) next({ name: "home" });
  else next();
});

export default router;
