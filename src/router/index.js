import Vue from "vue";
import Router from "vue-router";
import Store from "../store/index";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Project from "../views/Project.vue";
import Share from "../views/Share.vue";
import firebase, { db } from "../firebase";
import "firebase/firestore";

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
      },
      beforeEnter: (to, from, next) => {
        Store.dispatch("bindProjectsI");
        Store.dispatch("bindProjectsC");
        next();
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/share/:id",
      name: "share",
      component: Share,
      beforeEnter: (to, from, next) => {
        db.collection("projects")
          .doc(to.params.id)
          .get()
          .then(snapshot => {
            const project = snapshot.data();
            if (project.author.uid != firebase.auth().currentUser.uid) {
              if (
                !project.collaborators.some(
                  e => firebase.auth().currentUser.uid
                )
              ) {
                let newCollaborators = project.collaborators;
                newCollaborators.push(firebase.auth().currentUser.uid);
                db.collection("projects")
                  .doc(to.params.id)
                  .update({ collaborators: newCollaborators });
              }
            }
          });

        next({ path: `/project/${to.params.id}/main` });
      }
    },
    {
      path: "/project/:id",
      name: "project",
      component: Project,
      beforeEnter: (to, from, next) => {
        // Store.dispatch("bindProject", { idProject: to.params.id });
        // Store.dispatch("bindProcesses", { idProject: to.params.id });
        next({ path: `/project/${to.params.id}/main` });
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
        Store.dispatch("bindVariables", {
          idProject: to.params.id
        });
        Store.dispatch("bindRequirements", {
          idProject: to.params.id
        });
        Store.dispatch("bindChanels", {
          idProject: to.params.id
        });
        next();
      }
    }
  ]
});

export default router;
