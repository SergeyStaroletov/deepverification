<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane
      v-for="process in processes"
      :label="process.name"
      :key="process.id"
      :name="process.id"
    />
    <el-tab-pane name="plus">
      <span slot="label"><i class="el-icon-plus"></i></span>
    </el-tab-pane>
    <AddProcess ref="addProcess" :tab="true"></AddProcess>
  </el-tabs>
</template>

<script>
import firebase, { db } from "../../firebase";
import "firebase/firestore";
import AddProcess from "../AddProcess";
export default {
  name: "EditorTabs",
  components: { AddProcess },
  computed: {
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
      if (tab.name === "plus") {
        this.$refs.addProcess.dialogFormVisible = true;
      } else {
        this.$router.push({
          path: `/project/${this.$route.params.id}/${tab.name}`
        });
      }
    }
  },
  mounted() {
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
