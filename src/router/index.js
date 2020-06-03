import Vue from "vue";
import Router from "vue-router";
import Store from "../store/index";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Project from "../views/Project.vue";

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
    },
    {
      path: "/project/:id",
      name: "project",
      component: Project,
      beforeEnter: (to, from, next) => {
        Store.dispatch("bindProject", { idProject: to.params.id });
        Store.dispatch("bindProcesses", { idProject: to.params.id });
        next();
      }
    },
    {
      path: "/project/:id/:process",
      name: "project-tab",
      component: Project,
      beforeEnter: (to, from, next) => {
        Store.dispatch("bindProject", { idProject: to.params.id });
        Store.dispatch("bindProcesses", { idProject: to.params.id });
        Store.dispatch("bindProcess", {
          idProject: to.params.id,
          idProcess: to.params.process
        });
        Store.dispatch("bindNodes", {
          idProject: to.params.id,
          idProcess: to.params.process
        });
        Store.dispatch("bindEdges", {
          idProject: to.params.id,
          idProcess: to.params.process
        });
        next();
      }
    }
  ]
});

export default router;
