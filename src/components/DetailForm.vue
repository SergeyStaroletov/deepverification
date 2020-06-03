<template>
  <div>
    <!--    <el-form-item label="Действие">-->
    <el-input v-model="formModel.label" @change="change"></el-input>
    <!--    </el-form-item>-->
  </div>
</template>

<script>
import firebase, { db } from "../firebase";
import "firebase/firestore";

export default {
  name: "DetailForm",
  data() {
    return {
      formModel: {}
    };
  },
  created() {
    console.log(this.$root.propsAPI);
    const formModel = this.$root.propsAPI.getSelected()[0].getModel();
    // // const formModel = this.root.$refs.vgEditor.propsAPI.getSelected()[0].getModel();
    this.formModel = Object.assign({}, { shape: "flow-smooth" }, formModel);
  },
  methods: {
    change(e) {
      db.collection("projects")
        .doc(this.$route.params.id)
        .collection("nodes")
        .doc(this.formModel.id)
        .update({ label: this.formModel.label });
      console.log(e);
    }
  }
};
</script>

<style scoped></style>
