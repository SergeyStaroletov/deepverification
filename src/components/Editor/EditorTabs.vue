<template>
  <el-tabs type="card" @tab-click="handleClick">
    <el-tab-pane
      v-for="process in processes"
      :label="process.id"
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
    handleClick(tab) {
      // this.$route.params.id
      this.$router.push({ path: `/project/${this.$route.params.id}/${tab.name}` });
      console.log(tab);
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
  }
};
</script>

<style>
.el-tabs__header.is-top {
  margin-bottom: 0px;
}
</style>
