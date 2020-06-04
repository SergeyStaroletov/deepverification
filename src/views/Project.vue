<template>
  <v-g-editor
    ref="vgEditor"
    :onBeforeCommandExecute="handleBeforeCommand"
    :onAfterCommandExecute="handleAfterCommand"
  >
    <div class="root">
      <Menu></Menu>
      <!--<div class="header"></div>-->
      <div class="editor-container">
        <div class="sidebar">
          <EditorItemPanel></EditorItemPanel>
        </div>
        <div class="editor">
          <EditorTabs></EditorTabs>
          <EditorProcess></EditorProcess>
        </div>
        <div class="left-bar">
          <EditorDetailPanel></EditorDetailPanel>
          <EditorMiniMap>{{ nodesCount }} $ {{ edgesCount }}</EditorMiniMap>
        </div>
      </div>
    </div>
  </v-g-editor>
</template>

<script>
import firebase, { db } from "../firebase";
import "firebase/firestore";
import VGEditor, { Flow } from "vg-editor";
import EditorItemPanel from "../components/Editor/EditorItemPanel";
import EditorMiniMap from "../components/Editor/EditorMiniMap";
import EditorDetailPanel from "../components/Editor/EditorDetailPanel";
import EditorProcess from "../components/Editor/EditorProcess";
import EditorTabs from "../components/Editor/EditorTabs";
import AddProcess from "../components/AddProcess";
import Menu from "../components/Menu";

export default {
  name: "Project",
  components: {
    AddProcess,
    EditorTabs,
    EditorProcess,
    EditorDetailPanel,
    EditorMiniMap,
    EditorItemPanel,
    VGEditor,
    Flow,
    Menu
  },
  beforeRouteUpdate(to, from, next) {
    // todo в router/index.js есть такой же кусок кода, возможно стоит выкинуть там его
    this.$store.dispatch("bindProject", { idProject: to.params.id });
    this.$store.dispatch("bindProcesses", { idProject: to.params.id });
    this.$store.dispatch("bindProcess", {
      idProject: to.params.id,
      idProcess: to.params.process
    });
    this.$store.dispatch("bindNodes", {
      idProject: to.params.id,
      idProcess: to.params.process
    });
    this.$store.dispatch("bindEdges", {
      idProject: to.params.id,
      idProcess: to.params.process
    });
    this.update();
    next();
  },
  computed: {
    user() {
      return firebase.auth().currentUser;
    },
    nodesCount() {
      return this.process.nodes.length;
    },
    edgesCount() {
      return this.process.edges.length;
    },
    processes() {
      return this.$store.state.processes;
    },
    process(){
      return this.$store.state.process;
    },
    project(){
      return this.$store.state.project;
    }
  },
  data() {
    return {
    };
  },
  methods: {
    _downloadImage(data, filename = "flowchart.png") {
      const a = document.createElement("a");
      a.href = data;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
    },
    downloadImage() {
      const page = this.$refs.vgEditor.propsAPI.editor.getCurrentPage();
      this._downloadImage(page.saveImage().toDataURL("image/png"));
    },
    getSelected() {
      // console.log(this.$refs.vgEditor.propsAPI.getSelected()[0].getModel())
      return this.$refs.vgEditor.propsAPI.getSelected()[0].getModel();
    },
    update() {
      this.$refs.vgEditor.propsAPI.read(this.process);
    },
    updateLastEdit() {
      db.collection("projects")
        .doc(this.$route.params.id)
        .update({
          lastEdit: Date.now()
        })
        .then(function() {
          console.log("Document successfully updated!");
        });
    },
    handleBeforeCommand({ command }) {
      // console.log("before command execute", command);
    },
    handleAfterCommand({ command }) {
      console.log("after command execute", command);
      if (command.name === "add") {
        if (command.type === "node") {
          db.collection("projects")
            .doc(this.$route.params.id).collection('processes').doc(this.$route.params.process)
            .collection("nodes")
            .doc(command.addId)
            .set(command.addModel);
        } else if (command.type === "edge") {
          console.log("start end", {
            command,
            s: this.startNodeId,
            e: this.endNodeId
          });

          if (
            command.addModel.target === this.startNodeId ||
            command.addModel.source === this.endNodeId
          ) {
            this.$notify({
              title: "Внимание",
              message: "Start и End необычные вершины)",
              type: "warning"
            });
            command.back();
          } else {
            db.collection("projects")
              .doc(this.$route.params.id).collection('processes').doc(this.$route.params.process)
              .collection("edges")
              .doc(command.addId)
              .set(command.addModel);
          }
        }
      } else if (command.name === "delete") {
        db.collection("projects")
          .doc(this.$route.params.id).collection('processes').doc(this.$route.params.process)
          .collection("nodes")
          .doc(command.itemIds[0])
          .delete()
          .then(function() {
            console.log("Document successfully deleted!");
          })
          .catch(function(error) {
            console.error("Error removing document: ", error);
          });
        this.process.edges.map(e => {
          if (
            e.source === command.itemIds[0] ||
            e.target === command.itemIds[0]
          ) {
            db.collection("projects")
              .doc(this.$route.params.id).collection('processes').doc(this.$route.params.process)
              .collection("edges")
              .doc(e.id)
              .delete()
              .then(function() {
                console.log("Document successfully deleted!");
              })
              .catch(function(error) {
                console.error("Error removing document: ", error);
              });
          }
        });
        db.collection("projects")
          .doc(this.$route.params.id).collection('processes').doc(this.$route.params.process)
          .collection("edges")
          .doc(command.itemIds[0])
          .delete()
          .then(function() {
            console.log("Document successfully deleted!");
          })
          .catch(function(error) {
            console.error("Error removing document: ", error);
          });
      } else {
        this.process.nodes.map(e => {
          db.collection("projects")
            .doc(this.$route.params.id).collection('processes').doc(this.$route.params.process)
            .collection("nodes")
            .doc(e.id)
            .set(e);
        });
        if (
          command.name === "update" &&
          command.updateModel.target === this.startNodeId
        ) {
          this.$notify({
            title: "Внимание",
            message: "Start и End необычные вершины)",
            type: "warning"
          });
          command.back();
        } else {
          this.process.edges.map(e => {
            db.collection("projects")
              .doc(this.$route.params.id).collection('processes').doc(this.$route.params.process)
              .collection("edges")
              .doc(e.id)
              .set(e);
          });
        }
      }

      this.updateLastEdit();
    }
  },
  mounted() {
    // this.$bind(
    //   "data.nodes",
    //   db
    //     .collection("projects")
    //     .doc(this.$route.params.id)
    //     .collection("nodes")
    // );
    // this.$bind(
    //   "data.edges",
    //   db
    //     .collection("projects")
    //     .doc(this.$route.params.id)
    //     .collection("edges")
    // );
    // this.$bind("project", db.collection("projects").doc(this.$route.params.id));

    // Чтобы из корня был доступ к редактору
    this.$root.propsAPI = this.$refs.vgEditor.propsAPI;
  },
  updated() {
    this.update();
  }
};
</script>

<style>
body {
  overflow: hidden;
}

.root {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  width: 100vw;
  /*background-color: cornsilk;*/
}

.editor-container {
  width: 100vw;
  height: calc(100vh - 61px);
  display: flex;
  flex-direction: row;
}

.sidebar {
  background-color: darkturquoise;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
  height: calc(100vh - 61px);
  padding: 5px;
  background-color: #fafafa;
  border-right: 1px solid #e6e9ed;
}

.editor {
  width: calc(100vw - 200px - 100px);
  height: calc(100vh - 61px - 40px);
}

.left-bar {
  width: 200px;
  height: calc(100vh - 61px);
  background-color: #fafafa;
  padding: 5px;
  border-left: 1px solid #e6e9ed;
}
</style>
