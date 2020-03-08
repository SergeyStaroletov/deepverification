<template>
  <div>
    <Menu :user="this.user">{{ project.name }}</Menu>
    <el-button @click="add">Добавить</el-button>
    <div class="border">
      <v-stage
        :config="configKonva"
        @dragstart="handleDragstart"
        @dragend="handleDragend"
      >
        <v-layer>
          <v-circle
            v-for="circle in shapes"
            :config="{
              ...circle,
              id: circle.id
            }"
            :x="lala"
            :key="circle.id"
          ></v-circle>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script>
import firebase, { db } from "../firebase";
import "firebase/firestore";
import Menu from "../components/Menu";

const width = window.innerWidth;
const height = window.innerHeight;

export default {
  name: "Project",
  components: { Menu },
  computed: {
    user() {
      return firebase.auth().currentUser;
    }
  },
  data() {
    return {
      dragItemId: null,
      shapes: {},
      project: {},
      configKonva: {
        width: width,
        height: height
      }
    };
  },
  methods: {
    handleDragstart(e) {},
    handleDragend(e) {
      console.log(e.target);
      db.collection("projects")
        .doc(this.$route.params.id)
        .collection("shapes")
        .doc(e.target.attrs.id)
        .set(e.target.attrs)
        .then(() => {
          console.log("user updated!");
        });
    },
    add() {
      db.collection("projects")
        .doc(this.$route.params.id)
        .collection("shapes")
        .add({
          x: 100,
          y: 100,
          radius: 70,
          fill: "red",
          stroke: "black",
          strokeWidth: 4,
          draggable: true
        });
    }
  },
  mounted() {
    this.$bind(
      "shapes",
      db
        .collection("projects")
        .doc(this.$route.params.id)
        .collection("shapes")
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
