<template>
  <v-g-editor
    ref="vgEditor"
    :onBeforeCommandExecute="handleBeforeCommand"
    :onAfterCommandExecute="handleAfterCommand"
  >
    <div class="root">
      <Menu></Menu>
      <div class="header">
        {{nodesCount}} $ {{edgesCount}}
      </div>
      <div class="editor-container">
        <div class="sidebar">
          <EditorItemPanel></EditorItemPanel>
        </div>
        <div class="editor">
          <flow
            :onAnchorDragStart="handleClick"
            :shortcut="{ zoomIn: true, zoomOut: true }"
            :grid="{
              cell: 150,
              type: 'line',
              line: {
                stroke: '#edf3f3',
                lineWidth: 0.5
              }
            }"
          />
        </div>
        <div class="left-bar">
          <EditorDetailPanel></EditorDetailPanel>
          <EditorMiniMap></EditorMiniMap>
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

export default {
  name: "Project",
  components: {
    EditorDetailPanel,
    EditorMiniMap,
    EditorItemPanel,
    VGEditor,
    Flow
  },
  computed: {
    user() {
      return firebase.auth().currentUser;
    },
    nodesCount() {
      return this.data.nodes.length;
    },
    edgesCount() {
      return this.data.edges.length;
    }
  },
  data() {
    return {
      project: {},
      data: {
        nodes: [],
        edges: []
      }
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
    handleClick(e) {
      // console.log(e);
      // console.log(this.$refs.vgEditor.propsAPI.getSelected()[0].getModel())
      console.log(this.$refs.vgEditor);
    },
    update() {
      this.$refs.vgEditor.propsAPI.read(this.data);
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
            .doc(this.$route.params.id)
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
              .doc(this.$route.params.id)
              .collection("edges")
              .doc(command.addId)
              .set(command.addModel);
          }
        }
      } else if (command.name === "delete") {
        db.collection("projects")
          .doc(this.$route.params.id)
          .collection("nodes")
          .doc(command.itemIds[0])
          .delete()
          .then(function() {
            console.log("Document successfully deleted!");
          })
          .catch(function(error) {
            console.error("Error removing document: ", error);
          });
        this.data.edges.map(e => {
          if (
            e.source === command.itemIds[0] ||
            e.target === command.itemIds[0]
          ) {
            db.collection("projects")
              .doc(this.$route.params.id)
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
          .doc(this.$route.params.id)
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
        this.data.nodes.map(e => {
          db.collection("projects")
            .doc(this.$route.params.id)
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
          this.data.edges.map(e => {
            db.collection("projects")
              .doc(this.$route.params.id)
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
    this.$bind(
      "data.nodes",
      db
        .collection("projects")
        .doc(this.$route.params.id)
        .collection("nodes")
    );
    this.$bind(
      "data.edges",
      db
        .collection("projects")
        .doc(this.$route.params.id)
        .collection("edges")
    );
    this.$bind("project", db.collection("projects").doc(this.$route.params.id));

    // Чтобы из корня был доступ к редактору
    this.$root.propsAPI = this.$refs.vgEditor.propsAPI;
  },
  updated() {
    this.update();
  }
};
</script>

<style scoped>
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
  height: 100%;
  display: flex;
  flex-direction: row;
}

.sidebar {
  width: 100px;
  padding: 5px;
  background-color: #fafafa;
  border-right: 1px solid #e6e9ed;
}

.editor {
  width: 100%;
}

.left-bar {
  width: 200px;
  background-color: #fafafa;
  padding: 5px;
  border-left: 1px solid #e6e9ed;
}
</style>
