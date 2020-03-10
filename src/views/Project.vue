<template>
  <div>
    <el-container>
      <el-header>
        <Menu :user="this.user">{{ project.name }}</Menu>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-form
            label-position="top"
            :inline="true"
            :model="formInline"
            class="demo-form-inline"
          >
            <el-form-item label="Approved by">
              <el-input
                v-model="formInline.label"
                placeholder="Текст"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="nodeAdd">Добавить</el-button>
            </el-form-item>
          </el-form>
        </el-aside>
        <el-main>
          <simple-flowchart
            :scene.sync="data"
            @nodeDelete="nodeDelete($event)"
            @nodeClick="nodeSelected($event)"
            @linkAdded="linkAdded($event)"
            @linkBreak="linkBreak($event)"
            @moveSelectedNode="moveSelectedNode"
          ></simple-flowchart
        ></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import firebase, { db } from "../firebase";
import "firebase/firestore";
import Menu from "../components/Menu";

import SimpleFlowchart from "../components/simple-flowchart/SimpleFlowchart";
import "vue-simple-flowchart/dist/vue-flowchart.css";

export default {
  name: "Project",
  components: { Menu, SimpleFlowchart },
  computed: {
    user() {
      return firebase.auth().currentUser;
    }
  },
  data() {
    return {
      selectedNode: "",
      formInline: { label: "" },
      project: {},
      data: {
        centerX: 1024,
        centerY: 140,
        scale: 1,
        nodes: [],
        links: []
      }
    };
  },
  methods: {
    nodeAdd() {
      db.collection("projects")
        .doc(this.$route.params.id)
        .collection("nodes")
        .add({
          x: -700,
          y: -69,
          type: "Action",
          label: this.formInline.label
        });
    },
    nodeDelete(id) {
      db.collection("projects")
        .doc(this.project.id)
        .collection("nodes")
        .doc(id)
        .delete()
        .then(function() {
          console.log("Document successfully deleted!");
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
    },
    nodeSelected(e) {
      this.selectedNode = e;
    },
    moveSelectedNode() {
      let index = 0;
      for (; index < this.data.nodes.length; index++) {
        if (this.data.nodes[index].id === this.selectedNode) {
          break;
        }
      }

      db.collection("projects")
        .doc(this.$route.params.id)
        .collection("nodes")
        .doc(this.selectedNode)
        .set(this.data.nodes[index])
        .then(() => {
          console.log("user updated!");
        });
      console.log(this.data.nodes.length);
    },
    linkAdded(e) {
      console.log(e);

      db.collection("projects")
        .doc(this.$route.params.id)
        .collection("links")
        .add({
          from: e.from,
          to: e.to
        });
    },
    linkBreak(e) {
      console.log(e);

      db.collection("projects")
        .doc(this.project.id)
        .collection("links")
        .doc(e.id)
        .delete()
        .then(function() {
          console.log("Document successfully deleted!");
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
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
      "data.links",
      db
        .collection("projects")
        .doc(this.$route.params.id)
        .collection("links")
    );
    this.$bind("project", db.collection("projects").doc(this.$route.params.id));
  }
};
</script>

<style scoped>
body {
  background-color: #42b983;
}
.border {
  background-color: #ccc;
}
</style>
