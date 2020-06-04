<template>
  <el-input
    v-if="formModel.shape != 'flow-if'"
    v-model="formModel.label"
    @change="change"
  ></el-input>
</template>

<script>
import firebase, { db } from "../../../firebase";
import "firebase/firestore";

export default {
  name: "DetailNode",
  data() {
    return {
      formModel: {}
    };
  },
  created() {
    const formModel = this.$root.propsAPI.getSelected()[0].getModel();
    // // const formModel = this.root.$refs.vgEditor.propsAPI.getSelected()[0].getModel();
    this.formModel = Object.assign({}, { shape: "flow-smooth" }, formModel);
  },
  methods: {
    change(e) {
      let type = this.formModel.type === "node" ? "nodes" : "edges";
      db.collection("projects")
        .doc(this.$route.params.id)
        .collection(type)
        .doc(this.formModel.id)
        .update({ label: this.formModel.label });
      console.log(this.formModel);
    }
  }
};
</script>

<style scoped></style>
