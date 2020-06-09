<template>
  <fragment>
    <el-menu-item style="float: right;" @click="runGenerate"
      >Генерация кода</el-menu-item
    >
    <el-dialog title="Сгенерированный код" :visible.sync="dialogVisible">
      <el-input
        type="textarea"
        :rows="10"
        placeholder="Please input"
        v-model="code"
      >
      </el-input>
    </el-dialog>
  </fragment>
</template>

<script>
import firebase, { db } from "../firebase";
import "firebase/firestore";

export default {
  name: "GenerateCode",
  data() {
    return {
      code: "",
      dialogVisible: false
    };
  },
  computed: {
    variables() {
      return this.$store.state.variables;
    },
    requirements() {
      return this.$store.state.requirements;
    },
    project() {
      return this.$store.state.project;
    }
  },
  methods: {
    runGenerate() {
      this.code = `// ${this.project.name}\n\n`;
      this.code = this.code + this.generateRequirementsBlock();
      this.dialogVisible = true;
    },
    generateRequirementsBlock() {
      let code = "// Глобальные переменные\n";
      this.variables.map(v => {
        let line = `${v.type} ${v.name} = ${v.initial}; ${
          v.description ? "// " + v.description : ""
        }\n`;
        code = code + line;
      });

      code = code + "\n//Требования\n";

      this.requirements.map(r => {
        let line = `ltl ${r.id} {${r.requirement}} ${
          r.description ? "// " + r.description : ""
        }\n`;
        code = code + line;
      });
      return code;
    }
  }
};
</script>

<style scoped></style>
