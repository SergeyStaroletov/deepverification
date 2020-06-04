<template>
  <el-input
    v-if="visibleLabelEdit"
    v-model="formModel.label"
    @change="change"
  ></el-input>
</template>

<script>
import firebase, { db } from "../../../firebase";
import "firebase/firestore";

export default {
  name: "DetailEdge",
  data() {
    return {
      formModel: {}
    };
  },
  computed: {
    edges() {
      return this.$store.state.process.edges;
    },
    nodes() {
      return this.$store.state.process.nodes;
    },
    visibleLabelEdit() {
      let nodes_if = this.nodes.filter(e => e.shape === "flow-if");
      return nodes_if.some(e => this.formModel.source === e.id);
    }
  },
  created() {
    const formModel = this.$root.propsAPI.getSelected()[0].getModel();
    this.formModel = Object.assign({}, {}, formModel);
  },
  methods: {
    change(e) {
      db.collection("projects")
        .doc(this.$route.params.id)
        .collection("processes")
        .doc(this.$route.params.process)
        .collection("edges")
        .doc(this.formModel.id)
        .update({ label: this.formModel.label });
    }
  }
};
</script>

<style scoped></style>
