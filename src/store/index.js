import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { db } from "../firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    project: null,
    processes: null,
    process: {
      nodes: {},
      edges: {},
      root: {}
    }
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
    }),
    bindProcess: firestoreAction(({ bindFirestoreRef }, payload) => {
      // return the promise returned by `bindFirestoreRef`
      return bindFirestoreRef(
        "process.root",
        db
          .collection("projects")
          .doc(payload.idProject)
          .collection("processes")
          .doc(payload.idProcess)
      );
    }),
    bindNodes: firestoreAction(({ bindFirestoreRef }, payload) => {
      // return the promise returned by `bindFirestoreRef`
      return bindFirestoreRef(
        "process.nodes",
        db
          .collection("projects")
          .doc(payload.idProject)
          .collection("processes")
          .doc(payload.idProcess)
          .collection("nodes")
      );
    }),
    bindEdges: firestoreAction(({ bindFirestoreRef }, payload) => {
      // return the promise returned by `bindFirestoreRef`
      return bindFirestoreRef(
        "process.edges",
        db
          .collection("projects")
          .doc(payload.idProject)
          .collection("processes")
          .doc(payload.idProcess)
          .collection("edges")
      );
    })
  },
  modules: {}
});
