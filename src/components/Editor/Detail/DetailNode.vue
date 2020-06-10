<template>
  <fragment>
    <div v-if="visibleLabelEdit">
      Шаг
      <el-input v-model="formModel.label" @change="change"></el-input>
    </div>
    <div v-if="this.formModel.shape === 'flow-run'">
      Запуск процесса
      <el-select
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
    </div>
    <div v-if="this.formModel.shape === 'flow-send'">
      Канал для передачи
      <el-select
        @change="changeChanel('Send')"
        v-model="formModel.chanel"
        placeholder="Выбирете канал"
      >
        <el-option
          v-for="item in chanels"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      Выражение для передачи
      <el-input
        v-model="formModel.variable"
        @change="changeChanel('Send')"
      ></el-input>
    </div>
    <div v-if="this.formModel.shape === 'flow-get'">
      Отправка сообщения
      <el-select
        @change="changeChanel('Receive')"
        v-model="formModel.chanel"
        placeholder="Выбирете канал"
      >
        <el-option
          v-for="item in chanels"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      Переменная для сохранения
      <el-input
        v-model="formModel.variable"
        @change="changeChanel('Receive')"
      ></el-input>
    </div>
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
        this.formModel.shape === "flow-run" ||
        this.formModel.shape === "flow-send" ||
        this.formModel.shape === "flow-get"
        ? false
        : true;
    },
    processes() {
      console.log(this.$store.state.processes);
      return this.$store.state.processes;
    },
    chanels() {
      console.log(this.$store.state.chanels);
      return this.$store.state.chanels;
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
    },
    changeChanel(type) {
      let name = this.chanels.find(e => e.id === this.formModel.chanel).name;
      let newLabel =
        type +
        " " +
        this.formModel.variable +
        (type === "Send" ? " -> " : " <- ") +
        name;
      db.collection("projects")
        .doc(this.$route.params.id)
        .collection("processes")
        .doc(this.$route.params.process)
        .collection("nodes")
        .doc(this.formModel.id)
        .update({
          label: newLabel,
          chanel: this.formModel.chanel,
          chanelName: name,
          variable: this.formModel.variable
        });
    }
  }
};
</script>

<style scoped></style>
