<template>
  <div>
    <el-menu class="el-menu-demo" mode="horizontal" router>
      <el-menu-item index="/">deepverification</el-menu-item>
      <el-menu-item v-if="displayAddProcces">{{ project.name }}</el-menu-item>
      <el-submenu index="3" style="float: right;">
        <template slot="title">
          <el-avatar :size="32" :src="user.photoURL"></el-avatar>
          {{ user.displayName }}
        </template>
        <el-menu-item @click="logout">Выйти</el-menu-item>
      </el-submenu>
      <AddProject></AddProject>
      <AddProcess v-if="displayAddProcces"></AddProcess>
    </el-menu>
  </div>
</template>

<script>
import firebase, { db } from "../firebase";
import AddProject from "./AddProject";
import AddProcess from "./AddProcess";

export default {
  name: "Menu",
  components: { AddProcess, AddProject },
  data: () => ({
    dialogFormVisible: false,
    form: {
      name: ""
    },
    rules: {
      name: [
        {
          required: true,
          message: "Пожалуйста, введите название проекта",
          trigger: "blur"
        },
        {
          min: 3,
          max: 50,
          message: "Длинна должна быть от 3 до 50 символов",
          trigger: "blur"
        }
      ]
    }
  }),
  computed: {
    user() {
      return firebase.auth().currentUser;
    },
    displayAddProcces() {
      if (
        this.$route.name === "project" ||
        this.$route.name === "project-tab"
      ) {
        return true;
      }
      return false;
    },
    project() {
      return this.$store.state.project;
    }
  },
  methods: {
    logout() {
      firebase.auth().signOut();
    },
    createProject(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          db.collection("projects")
            .add({
              name: this.form.name,
              author: {
                displayName: this.user.displayName,
                uid: this.user.uid
              },
              lastEdit: Date.now()
            })
            .then(e => {
              console.log(e);
              db.collection("projects")
                .doc(e.id)
                .collection("processes")
                .add({
                  name: "main",
                  type: "cyber"
                });
            });

          this.form.name = "";
          this.dialogFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancelCreate(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    }
  }
};
</script>

<style>
.el-menu-item:first-child {
  font-weight: bold;
}
</style>
