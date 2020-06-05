<template>
  <fragment>
    <el-input
      v-if="visibleLabelEdit"
      v-model="formModel.label"
      @change="change"
    ></el-input>
    <el-select
      v-if="this.formModel.shape === 'flow-run'"
      @change="changeProcess"
      v-model="formModel.process"
      placeholder="Выбирете процесс"
    >
      <el-option
        v-for="item in processes.filter(e => e.type === 'cyber')"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </fragment>
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
  computed: {
    visibleLabelEdit() {
      return this.formModel.shape === "flow-if" ||
        this.formModel.shape === "flow-start" ||
        this.formModel.shape === "flow-end" ||
        this.formModel.shape === "flow-run"
        ? false
        : true;
    },
    processes() {
      console.log(this.$store.state.processes);
      return this.$store.state.processes;
    }
  },
  created() {
    const formModel = this.$root.propsAPI.getSelected()[0].getModel();
    // // const formModel = this.root.$refs.vgEditor.propsAPI.getSelected()[0].getModel();
    this.formModel = Object.assign({}, {}, formModel);
  },
  methods: {
    change(e) {
      let type = this.formModel.type === "node" ? "nodes" : "edges";
      db.collection("projects")
        .doc(this.$route.params.id)
        .collection("processes")
        .doc(this.$route.params.process)
        .collection(type)
        .doc(this.formModel.id)
        .update({ label: this.formModel.label });
      console.log(this.formModel);
    },
    changeProcess(e) {
      let newLabel =
        "Run " + this.processes.find(e => e.id === this.formModel.process).name;
      db.collection("projects")
        .doc(this.$route.params.id)
        .collection("processes")
        .doc(this.$route.params.process)
        .collection("nodes")
        .doc(this.formModel.id)
        .update({
          label: newLabel,
          process: this.formModel.process
        });
    }
  }
};
</script>

<style scoped></style>
