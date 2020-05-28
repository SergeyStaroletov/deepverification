<template>
  <v-g-editor
    ref="vgEditor"
    :onBeforeCommandExecute="handleBeforeCommand"
    :onAfterCommandExecute="handleAfterCommand"
  >
    <div class="root">
      <div class="header">{{ nodesCount }} : {{ edgesCount }}</div>
      <div class="editor-container">
        <div class="sidebar">
          <item-panel id="items">
            <div>Circle</div>
            <item
              type="node"
              size="72*72"
              shape="flow-circle"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAAwCAYAAAC/gkysAAACT0lEQVRoQ+3bvy+EMRgH8KfImW6xSkTEnyAxMYm/wCSRYMJkETGxiVgMggmTyWQUE7dI/AlikFgNbuGCSi95L72mfZ/26etX8r3x3j699tPnad/hqoiIRg/08fsnzU4MUWtkgOrKfIlPR0AT0cMzNW8eqdbXQ2f3K2pRGbTxQZrZnqJ6rRdaZQKtD6KNK2rePtG5Gt7Xr9cL1A+0uKQxeJMn9KbmLvTL7jTV48LQygisXVJTbTa0Xh4DSIrA4R2R2mpovQS4FDc6AlySV6cx4GRuyDihG+AAJxUQxmGPA5xQQBiGjAOcUEAYhowDnFBAGFZZxp3u7dD86nrXMHzfFQ3MM/NxY8rm4fZX1r/dT2y7FMNvgysGyw2ae14GEBtbLJILk7Jobmw2nDsoM5jUzIjJzJhsCEHEAsf8RtEmG850ZA/MzrTiR3yYklJKXRB7W8jJLh9oNlxsSYZWMzfe12+oNO22uZCVwIVQ7MGFyoWDi0FwDxmuNLnnMSWbDeeWgwsRA8OVMlfWqSX85+B8p1YZXOqE3f00tIdxMNzzH8k4u5TszAllXu7rhW/SvgXgJv/re5yvVH2naWx2cdkQQsqF4KArf4/j9jhfOaXicHucOynf9uB7ZUrFstt/++FQ7EvFycehce9eXHxZZleJVxlczur9x1jACVcNcIATCgjDkHGAEwoIw5BxgBMKCMOQcYATCgjDkHGAEwoIw5BxgBMKCMPaGYe/66frtf+ujwsi6XDtCyK4kpQG17mShEtw8XBdl+BMGK5dluP5rl1+AW7rR6GKRZtdAAAAAElFTkSuQmCC"
            />
            <div>Rect</div>
            <item
              type="node"
              size="72*72"
              shape="flow-rect"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAAwCAYAAAC/gkysAAACT0lEQVRoQ+3bvy+EMRgH8KfImW6xSkTEnyAxMYm/wCSRYMJkETGxiVgMggmTyWQUE7dI/AlikFgNbuGCSi95L72mfZ/26etX8r3x3j699tPnad/hqoiIRg/08fsnzU4MUWtkgOrKfIlPR0AT0cMzNW8eqdbXQ2f3K2pRGbTxQZrZnqJ6rRdaZQKtD6KNK2rePtG5Gt7Xr9cL1A+0uKQxeJMn9KbmLvTL7jTV48LQygisXVJTbTa0Xh4DSIrA4R2R2mpovQS4FDc6AlySV6cx4GRuyDihG+AAJxUQxmGPA5xQQBiGjAOcUEAYhowDnFBAGFZZxp3u7dD86nrXMHzfFQ3MM/NxY8rm4fZX1r/dT2y7FMNvgysGyw2ae14GEBtbLJILk7Jobmw2nDsoM5jUzIjJzJhsCEHEAsf8RtEmG850ZA/MzrTiR3yYklJKXRB7W8jJLh9oNlxsSYZWMzfe12+oNO22uZCVwIVQ7MGFyoWDi0FwDxmuNLnnMSWbDeeWgwsRA8OVMlfWqSX85+B8p1YZXOqE3f00tIdxMNzzH8k4u5TszAllXu7rhW/SvgXgJv/re5yvVH2naWx2cdkQQsqF4KArf4/j9jhfOaXicHucOynf9uB7ZUrFstt/++FQ7EvFycehce9eXHxZZleJVxlczur9x1jACVcNcIATCgjDkHGAEwoIw5BxgBMKCMOQcYATCgjDkHGAEwoIw5BxgBMKCMPaGYe/66frtf+ujwsi6XDtCyK4kpQG17mShEtw8XBdl+BMGK5dluP5rl1+AW7rR6GKRZtdAAAAAElFTkSuQmCC"
            />
            <div>Start</div>
            <item
              type="node"
              size="72*72"
              shape="flow-start"
              :model="{
                // must have model property
                color: '#FA8C16',
                label: 'Start'
              }"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAAwCAYAAAC/gkysAAACT0lEQVRoQ+3bvy+EMRgH8KfImW6xSkTEnyAxMYm/wCSRYMJkETGxiVgMggmTyWQUE7dI/AlikFgNbuGCSi95L72mfZ/26etX8r3x3j699tPnad/hqoiIRg/08fsnzU4MUWtkgOrKfIlPR0AT0cMzNW8eqdbXQ2f3K2pRGbTxQZrZnqJ6rRdaZQKtD6KNK2rePtG5Gt7Xr9cL1A+0uKQxeJMn9KbmLvTL7jTV48LQygisXVJTbTa0Xh4DSIrA4R2R2mpovQS4FDc6AlySV6cx4GRuyDihG+AAJxUQxmGPA5xQQBiGjAOcUEAYhowDnFBAGFZZxp3u7dD86nrXMHzfFQ3MM/NxY8rm4fZX1r/dT2y7FMNvgysGyw2ae14GEBtbLJILk7Jobmw2nDsoM5jUzIjJzJhsCEHEAsf8RtEmG850ZA/MzrTiR3yYklJKXRB7W8jJLh9oNlxsSYZWMzfe12+oNO22uZCVwIVQ7MGFyoWDi0FwDxmuNLnnMSWbDeeWgwsRA8OVMlfWqSX85+B8p1YZXOqE3f00tIdxMNzzH8k4u5TszAllXu7rhW/SvgXgJv/re5yvVH2naWx2cdkQQsqF4KArf4/j9jhfOaXicHucOynf9uB7ZUrFstt/++FQ7EvFycehce9eXHxZZleJVxlczur9x1jACVcNcIATCgjDkHGAEwoIw5BxgBMKCMOQcYATCgjDkHGAEwoIw5BxgBMKCMPaGYe/66frtf+ujwsi6XDtCyK4kpQG17mShEtw8XBdl+BMGK5dluP5rl1+AW7rR6GKRZtdAAAAAElFTkSuQmCC"
            />
            <div>End</div>
            <item
              type="node"
              size="72*72"
              shape="flow-end"
              :model="{
                // must have model property
                color: '#FA8C16',
                label: 'End'
              }"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAAwCAYAAAC/gkysAAACT0lEQVRoQ+3bvy+EMRgH8KfImW6xSkTEnyAxMYm/wCSRYMJkETGxiVgMggmTyWQUE7dI/AlikFgNbuGCSi95L72mfZ/26etX8r3x3j699tPnad/hqoiIRg/08fsnzU4MUWtkgOrKfIlPR0AT0cMzNW8eqdbXQ2f3K2pRGbTxQZrZnqJ6rRdaZQKtD6KNK2rePtG5Gt7Xr9cL1A+0uKQxeJMn9KbmLvTL7jTV48LQygisXVJTbTa0Xh4DSIrA4R2R2mpovQS4FDc6AlySV6cx4GRuyDihG+AAJxUQxmGPA5xQQBiGjAOcUEAYhowDnFBAGFZZxp3u7dD86nrXMHzfFQ3MM/NxY8rm4fZX1r/dT2y7FMNvgysGyw2ae14GEBtbLJILk7Jobmw2nDsoM5jUzIjJzJhsCEHEAsf8RtEmG850ZA/MzrTiR3yYklJKXRB7W8jJLh9oNlxsSYZWMzfe12+oNO22uZCVwIVQ7MGFyoWDi0FwDxmuNLnnMSWbDeeWgwsRA8OVMlfWqSX85+B8p1YZXOqE3f00tIdxMNzzH8k4u5TszAllXu7rhW/SvgXgJv/re5yvVH2naWx2cdkQQsqF4KArf4/j9jhfOaXicHucOynf9uB7ZUrFstt/++FQ7EvFycehce9eXHxZZleJVxlczur9x1jACVcNcIATCgjDkHGAEwoIw5BxgBMKCMOQcYATCgjDkHGAEwoIw5BxgBMKCMPaGYe/66frtf+ujwsi6XDtCyK4kpQG17mShEtw8XBdl+BMGK5dluP5rl1+AW7rR6GKRZtdAAAAAElFTkSuQmCC"
            />
          </item-panel>
        </div>
        <div class="editor">
          <flow :shortcut="{ zoomIn: true, zoomOut: true }" />
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
      </div>
    </div>
  </v-g-editor>
</template>

<script>
import firebase, { db } from "../firebase";
import "firebase/firestore";
import VGEditor, { Flow, Item, ItemPanel, RegisterNode } from "vg-editor";
import Menu from "../components/Menu";

export default {
  name: "Project",
  components: { Menu, VGEditor, Flow, Item, ItemPanel, RegisterNode },
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
          db.collection("projects")
            .doc(this.$route.params.id)
            .collection("edges")
            .doc(command.addId)
            .set(command.addModel);
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
        this.data.edges.map(e => {
          db.collection("projects")
            .doc(this.$route.params.id)
            .collection("edges")
            .doc(e.id)
            .set(e);
        });
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
  padding: 5px;
  background-color: bisque;
}

.editor {
  width: 100%;
}
</style>
