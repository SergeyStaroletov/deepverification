<template>
  <el-tabs type="card" @tab-click="handleClick">
    <el-tab-pane
      v-for="process in processes"
      :label="process.name"
      :key="process.id"
    />
  </el-tabs>
</template>

<script>
import firebase, { db } from "../../firebase";
import "firebase/firestore";
export default {
  name: "EditorTabs",
  components: {},
  data() {
    return {
      activeName: "first"
    };
  },
  computed: {
    processes() {
      return this.$store.state.processes;
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  mounted() {
    this.$bind(
      "process",
      db
        .collection("projects")
        .doc(this.$route.params.id)
        .collection("process")
    );
    // this.$bind(
    //   "data.edges",
    //   db
    //     .collection("projects")
    //     .doc(this.$route.params.id)
    //     .collection("edges")
    // );
    // this.$bind("project", db.collection("projects").doc(this.$route.params.id));
  }
};
</script>

<style>
.el-tabs__header.is-top {
  margin-bottom: 0px;
}
</style>
