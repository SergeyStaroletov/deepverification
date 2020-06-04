<template>
  <div>
    project
    <el-input v-model="project.name" @change="changeProjectName"></el-input>
    process
    <el-input v-model="process.name" :disabled="process.id === 'main'" @change="changeProcessName"></el-input>
  </div>
</template>

<script>
import firebase, { db } from "../../../firebase";

export default {
  name: "DetailProject",
  computed: {
    project() {
      return this.$store.state.project;
    },
    process() {
      return this.$store.state.process.root;
    }
  },
  methods: {
    changeProjectName(e) {
      db.collection("projects")
        .doc(this.$route.params.id)
        .update({ name: this.project.name });
    },
    changeProcessName(e) {
      db.collection("projects")
        .doc(this.$route.params.id)
        .collection("processes")
        .doc(this.process.id)
        .update({ name: this.process.name });
    }
  }
};
</script>

<style scoped></style>
