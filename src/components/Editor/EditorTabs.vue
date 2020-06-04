<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane
      v-for="process in processes"
      :label="process.name"
      :key="process.id"
      :name="process.id"
    />
  </el-tabs>
</template>

<script>
import firebase, { db } from "../../firebase";
import "firebase/firestore";
export default {
  name: "EditorTabs",
  computed: {
    // processes() {
    //   return this.$store.state.processes;
    // },
    activeName() {
      return this.$route.params.process;
    }
  },
  data() {
    return {
      processes: []
    };
  },
  methods: {
    handleClick(tab) {
      this.$router.push({
        path: `/project/${this.$route.params.id}/${tab.name}`
      });
    }
  },
  mounted() {
    // this.$bind(
    //   "process",
    //   db
    //     .collection("projects")
    //     .doc(this.$route.params.id)
    //     .collection("process")
    // );
    this.$bind(
      "processes",
      db
        .collection("projects")
        .doc(this.$route.params.id)
        .collection("processes")
        .orderBy("created")
    );
  }
};
</script>

<style>
.el-tabs__header.is-top {
  margin-bottom: 0px;
}
</style>
