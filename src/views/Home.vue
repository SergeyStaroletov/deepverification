<template>
  <div class="home">
    <h4>Главная</h4>
    <p>{{ user.displayName }}</p>
    <img :src="user.photoURL" width="64" />
    <br />
    <el-form :inline="true" :model="form">
      <el-form-item label="Название проекта">
        <el-input v-model="form.name" placeholder="Название проекта"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="createProject">Создать</el-button>
      </el-form-item>
    </el-form>
    <ul>
      <li v-for="project in projects" :key="project.id">
        <router-link :to="{ name: 'project', params: { id: project.id } }">
          {{ project.name }}
        </router-link>
        <el-button
          type="danger"
          icon="el-icon-delete"
          circle
          @click="deleteProject(project.id)"
        ></el-button>
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase, { db } from "../firebase";
import "firebase/firestore";

const projects = db.collection("projects");

export default {
  name: "home",
  computed: {
    user() {
      return firebase.auth().currentUser;
    }
  },
  components: {},
  methods: {
    createProject() {
      if (this.form.name) {
        db.collection("projects").add({
          name: this.form.name,
          user: this.user.uid
        });
        this.form.name = null;
      } else {
        this.$notify.error({
          title: "Ошибка",
          message: "Новый проект должен иметь название"
        });
      }
    },
    deleteProject(id) {
      db.collection("projects")
        .doc(id)
        .delete()
        .then(function() {
          console.log("Document successfully deleted!");
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
    }
  },
  data: () => ({
    projects: [],
    form: { name: null }
  }),
  mounted() {
    this.$bind("projects", projects.where("user", "==", this.user.uid)).then(
      projects => {
        this.projects = projects;
      }
    );
  }
};
</script>
