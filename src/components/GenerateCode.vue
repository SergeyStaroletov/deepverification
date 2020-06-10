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
      dialogVisible: false,
      edges: {},
      nodes: {}
    };
  },
  computed: {
    variables() {
      return this.$store.state.variables;
    },
    requirements() {
      return this.$store.state.requirements;
    },
    chanels() {
      return this.$store.state.chanels;
    },
    project() {
      return this.$store.state.project;
    },
    processes() {
      return this.$store.state.processes;
    }
  },
  methods: {
    async runGenerate() {
      this.code = `// ${this.project.name}\n\n`;
      this.code = this.code + this.generateRequirementsBlock();
      this.code = this.code + (await this.generateProcessBlock());
      this.dialogVisible = true;
    },
    generateRequirementsBlock() {
      let code = "// Глобальные переменные\n";
      this.variables.map(v => {
        let line = `${v.type} ${v.name}${v.isArray ? `[${v.length}]` : ""}${
          v.initial ? " = " + v.initial : ""
        }; ${v.description ? "// " + v.description : ""}\n`;
        code = code + line;
      });

      code = code + "\n// Каналы\n";

      this.chanels.map(c => {
        let line = `chan ${c.name}=[{${c.length}}] of {${c.type}} ${
          c.description ? "// " + c.description : ""
        }\n`;
        code = code + line;
      });

      code = code + "\n// Требования\n";

      this.requirements.map(r => {
        let line = `ltl ${r.name} {${r.requirement}} ${
          r.description ? "// " + r.description : ""
        }\n`;
        code = code + line;
      });
      return code;
    },
    async generateProcessBlock() {
      let code = "\n";

      for (let i = 0; i < this.processes.length; i++) {
        let p = this.processes[i];
        if (p.type === "cyber") {
          // code = code + 'active proctype ' + p.name + '(){';
          // code = code + await this.generateProcess(p.id) + '\n}\n\n';
          code =
            code +
            `active proctype ${p.name}(){\n${await this.generateProcess(
              p.id
            )}}\n\n`;
        }
      }

      // await this.processes.map(async p => {
      //   console.log(p);
      //
      //   if (p.type === "cyber") {
      //     // code = code + 'active proctype ' + p.name + '(){';
      //     // code = code + await this.generateProcess(p.id) + '\n}\n\n';
      //     code =
      //       code +
      //       `active proctype ${p.name}(){\n${await this.generateProcess(
      //         p.id
      //       )}}\n\n`;
      //   }
      // });
      return code;
    },
    async generateProcess(id) {
      let code = "init{\nmain()\n}\n";

      await this.$bind(
        "nodes",
        db
          .collection("projects")
          .doc(this.$route.params.id)
          .collection("processes")
          .doc(id)
          .collection("nodes")
      );

      await this.$bind(
        "edges",
        db
          .collection("projects")
          .doc(this.$route.params.id)
          .collection("processes")
          .doc(id)
          .collection("edges")
      );

      let start = this.nodes.find(e => e.shape === "flow-start");

      console.log(111, start);

      let nextNodes = this.getNextNodes(start);


      code = code + this.printStep(start);

      return code;
    },
    printStep(node) {
      // console.log(this.nodes[id])
      return node.label + "\n";
    },
    printIf(node, edges) {
      return 1;
    },
    printSend(node) {
      return "send\n";
    },
    printGet(node) {
      return "get\n";
    },
    printRun(node) {
      return "run" + node.label + "()\n";
    },
    getNextNodes(node) {
      let targets = this.edges.filter(e => e.source === node.id);
      for (let i = 0; i < targets.length; i++) {
        targets[i] = this.nodes[i];
      }
      return targets;
    }
  }
};
</script>

<style scoped></style>
