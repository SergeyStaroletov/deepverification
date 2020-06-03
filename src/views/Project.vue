<template>
  <v-g-editor
    ref="vgEditor"
    :onBeforeCommandExecute="handleBeforeCommand"
    :onAfterCommandExecute="handleAfterCommand"
  >
    <div class="root">
      <div class="header">
        {{ nodesCount }} : {{ edgesCount }}
        <button @click="handleClick">clik</button>
      </div>
      <div class="editor-container">
        <div class="sidebar">
          <item-panel id="items">
            <item
              type="node"
              size="144*72"
              shape="flow-rect"
              :model="{
                // must have model property
                label: 'Step'
              }"
              src="../img/step.svg"
            />
            <item
              type="node"
              size="144*72"
              shape="flow-rhombus"
              :model="{
                // must have model property
                label: 'If'
              }"
              src="../img/if.svg"
            />
            <item
              v-if="startNodeId === false"
              type="node"
              size="72*72"
              shape="flow-start"
              :model="{
                // must have model property
                color: '#FA8C16',
                label: 'Start'
              }"
              src="../img/start.svg"
            />
            <item
              v-if="endNodeId === false"
              type="node"
              size="72*72"
              shape="flow-end"
              :model="{
                // must have model property
                color: '#FA8C16',
                label: 'End'
              }"
              src="../img/end.svg"
            />
          </item-panel>
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
          <register-node
            name="flow-start"
            :config="customNodes.flowStart"
            extend="flow-circle"
          />
          <register-node
            name="flow-end"
            :config="customNodes.flowEnd"
            extend="flow-circle"
          />
        </div>
        <div class="left-bar">
          <detail-panel>
            <template v-slot="{ status }">
              <node-panel :status="status">
                <DetailForm></DetailForm>
              </node-panel>
              <edge-panel :status="status">
                <DetailForm></DetailForm>
              </edge-panel>
            </template>
          </detail-panel>
          {{ selectedItem.label }}
          <minimap :width="200" :height="200" />
        </div>
      </div>
    </div>
  </v-g-editor>
</template>

<script>
import firebase, { db } from "../firebase";
import "firebase/firestore";
import VGEditor, {
  Flow,
  Item,
  ItemPanel,
  RegisterNode,
  Minimap,
  DetailPanel,
  NodePanel,
  EdgePanel,
  CanvasPanel
} from "vg-editor";
import Menu from "../components/Menu";
import DetailForm from "../components/DetailForm";

export default {
  name: "Project",
  components: {
    DetailForm,
    Menu,
    VGEditor,
    Flow,
    Item,
    ItemPanel,
    RegisterNode,
    Minimap,
    DetailPanel,
    NodePanel,
    EdgePanel,
    CanvasPanel
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
    },
    startNodeId() {
      let a = this.data.nodes.filter(e => e.shape === "flow-start");
      if (a.length === 1) {
        return a[0].id;
      } else {
        return false;
      }
    },
    endNodeId() {
      let a = this.data.nodes.filter(e => e.shape === "flow-end");
      if (a.length === 1) {
        return a[0].id;
      } else {
        return false;
      }
    },
    selectedItem() {
      // console.log(this.getSelected());
      // return this.$refs.vgEditor.propsAPI.getSelected()[0].getModel();
      return 1;
    }
  },
  data() {
    return {
      project: {},
      data: {
        nodes: [],
        edges: []
      },
      customNodes: {
        flowStart: {
          name: "flowStart",
          anchor: {
            points: [[0.5, 1]],
            intersectBox: "circle"
          }
        },
        flowEnd: {
          name: "flowEnd",
          anchor: {
            points: [[0.5, 0]],
            intersectBox: "circle"
          }
        }
      }
    };
  },
  methods: {
    getSelected() {
      // console.log(this.$refs.vgEditor.propsAPI.getSelected()[0].getModel())
      return this.$refs.vgEditor.propsAPI.getSelected()[0].getModel();
    },
    handleClick(e) {
      // console.log(e);
      // console.log(this.$refs.vgEditor.propsAPI.getSelected()[0].getModel())
      console.log(this.$refs.vgEditor);
    },
    myClick() {
      let k = this.$refs.vgEditor.propsAPI.find("07de7727");
      this.$refs.vgEditor.propsAPI.find("07de7727").ifAnchorShow = true;
      // console.log(k.getAllAnchors());
      this.$refs.vgEditor.propsAPI.update();
      console.log(this.$refs.vgEditor.propsAPI.find("07de7727"));
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
      console.log("before command execute", command);
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
  background-color: cornsilk;
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
  background-color: bisque;
}
</style>
