import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import firebase, { db } from "../firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    project: {
      name: ""
    },
    projects_i: {},
    projects_c: {},
    processes: null,
    process: {
      nodes: {},
      edges: {},
      root: {}
    },
    variables: {},
    requirements: {},
    chanels: {}
  },
  mutations: vuexfireMutations,
  actions: {
    bindProjectsI: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef(
        "projects_i",
        db
          .collection("projects")
          .where("author.uid", "==", firebase.auth().currentUser.uid)
      );
    }),
    bindProjectsC: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef(
        "projects_c",
        db
          .collection("projects")
          .where(
            "collaborators",
            "array-contains",
            firebase.auth().currentUser.uid
          )
      );
    }),
    bindProject: firestoreAction(({ bindFirestoreRef }, payload) => {
      return bindFirestoreRef(
        "project",
        db.collection("projects").doc(payload.idProject)
      );
    }),
    bindProcesses: firestoreAction(({ bindFirestoreRef }, payload) => {
      return bindFirestoreRef(
        "processes",
        db
          .collection("projects")
          .doc(payload.idProject)
          .collection("processes")
          .orderBy("created")
      );
    }),
    bindProcess: firestoreAction(({ bindFirestoreRef }, payload) => {
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
      return bindFirestoreRef(
        "process.edges",
        db
          .collection("projects")
          .doc(payload.idProject)
          .collection("processes")
          .doc(payload.idProcess)
          .collection("edges")
      );
    }),
    bindVariables: firestoreAction(({ bindFirestoreRef }, payload) => {
      return bindFirestoreRef(
        "variables",
        db
          .collection("projects")
          .doc(payload.idProject)
          .collection("processes")
          .doc("Требования")
          .collection("variables")
      );
    }),
    bindRequirements: firestoreAction(({ bindFirestoreRef }, payload) => {
      return bindFirestoreRef(
        "requirements",
        db
          .collection("projects")
          .doc(payload.idProject)
          .collection("processes")
          .doc("Требования")
          .collection("requirements")
      );
    }),
    bindChanels: firestoreAction(({ bindFirestoreRef }, payload) => {
      return bindFirestoreRef(
        "chanels",
        db
          .collection("projects")
          .doc(payload.idProject)
          .collection("processes")
          .doc("Требования")
          .collection("chanels")
      );
    })
  },
  modules: {}
});
