<template>
  <div>
    <el-menu class="el-menu-demo" mode="horizontal" router>
      <el-menu-item index="/">deepverification</el-menu-item>
      <el-menu-item v-if="displayAddProcess">{{ project.name }}</el-menu-item>
      <el-submenu index="3" style="float: right;">
        <template slot="title">
          <el-avatar :size="32" :src="user.photoURL"></el-avatar>
          {{ user.displayName }}
        </template>
        <el-menu-item @click="logout">Выйти</el-menu-item>
      </el-submenu>
      <AddProject v-if="$route.name === 'home'"></AddProject>
      <!--      <AddProcess v-if="displayAddProcess"></AddProcess>-->
      <ShareProject
        v-if="displayAddProcess"
        :project="project"
        menu="true"
      ></ShareProject>
      <GenerateCode v-if="displayAddProcess"> </GenerateCode>
    </el-menu>
  </div>
</template>

<script>
import firebase, { db } from "../firebase";
import AddProject from "./AddProject";
import AddProcess from "./AddProcess";
import ShareProject from "./ShareProject";
import GenerateCode from "./GenerateCode";

export default {
  name: "Menu",
  components: { GenerateCode, ShareProject, AddProcess, AddProject },
  computed: {
    user() {
      return firebase.auth().currentUser;
    },
    displayAddProcess() {
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
    }
  }
};
</script>

<style>
.el-menu-item:first-child {
  font-weight: bold;
}
</style>
