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
      this.code = this.code + "init{\nmain()\n}\n";
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
      let code = "";
      let fi = false;

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

      let visited = {};
      let vue = this;

      // function dfsIf(id){
      //
      // }

      function dfs(id) {
        function getNextNodes(id) {
          let targets = vue.edges.filter(e => e.source === id);
          let result = [];
          targets.map(e => {
            result.push(e.target);
          });
          console.log(result);
          return result;
        }

        visited[id] = true;
        let nextNodes = getNextNodes(id);
        for (let i = 0; i < nextNodes.length; i++) {
          if (visited[vue.nodes[nextNodes[i]]] != true) {
            console.log(vue.nodes.find(e => e.id === nextNodes[i]));
            let curNode = vue.nodes.find(e => e.id === nextNodes[i]);
            let line = "";
            if (curNode.shape === "flow-step") {
              line = vue.printStep(curNode);
            } else if (curNode.shape === "flow-run") {
              line = vue.printRun(curNode);
            } else if (curNode.shape === "flow-send") {
              line = vue.printSend(curNode);
            } else if (curNode.shape === "flow-get") {
              line = vue.printGet(curNode);
            } else if (curNode.shape === "flow-end") {
              if (fi) {
                line = "fi\n";
              }
              fi = true;
            } else if (curNode.shape === "flow-if") {
              // line = "if\n";
              // let ifSource = vue.edges.filter(e => e.source === curNode.id);
              // ifSource.map(e => {
              //   line = line + "::(" + e.label + ") -> ";
              //   let n2 = "";
              //   let tmpN = vue.nodes.find(e2 => {
              //     n2 = e2.id;
              //     return e2.id === e.target;
              //   });
              //   line = line + tmpN.label + "; ";
              //   visited[tmpN.id] = true;
              //
              //   let n3 = vue.edges.find(e => e.source === n2);
              //
              //   tmpN = vue.nodes.find(e2 => {
              //     // n2 = e2.id;
              //     return e2.id === n3.target;
              //   });
              //   line = line + tmpN.label + ";\n";
              //   visited[tmpN.id] = true;
              // });
              // line = line + "fi\n";

              line = "if\n";
            } else if (curNode.shape === "flow-end") {
              //
            }
            code = code + line;
            dfs(nextNodes[i]);
          } else {
            //слияние
          }
        }
      }

      let start = this.nodes.find(e => e.shape === "flow-start");
      dfs(start.id);

      // code = code + this.printStep(start);

      return code;
    },
    printStep(node) {
      let lastNode = this.nodes.find(
        e1 => e1.id === this.edges.find(e => e.target === node.id).source
      );
      if (lastNode.shape === "flow-if") {
        return (
          "::" +
          "(" +
          this.edges.find(e => e.target === node.id).label +
          ")->" +
          node.label +
          ";\n"
        );
      } else {
        return node.label + ";\n";
      }
    },
    printIf(node) {
      return "if\n::";
    },
    printSend(node) {
      return node.variable + " ! " + node.chanelName + "\n";
    },
    printGet(node) {
      return node.variable + " ? " + node.chanelName + "\n";
    },
    printRun(node) {
      return "run " + node.label.substr(4) + "()\n";
    }
  }
};
</script>

<style scoped></style>
