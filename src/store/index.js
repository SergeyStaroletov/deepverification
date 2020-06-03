import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { db } from "../firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    project: null,
    processes: null
  },
  mutations: vuexfireMutations,
  actions: {
    bindProject: firestoreAction(({ bindFirestoreRef }, payload) => {
      // return the promise returned by `bindFirestoreRef`
      return bindFirestoreRef(
        "project",
        db.collection("projects").doc(payload.idProject)
      );
    }),
    bindProcesses: firestoreAction(({ bindFirestoreRef }, payload) => {
      // return the promise returned by `bindFirestoreRef`
      return bindFirestoreRef(
        "processes",
        db
          .collection("projects")
          .doc(payload.idProject)
          .collection("processes")
      );
    })
  },
  modules: {}
});
