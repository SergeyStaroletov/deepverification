<template>
  <div>
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
    >
      <el-menu-item index="1" @click="$router.replace('/')"
        >deepverification</el-menu-item
      >
      <el-menu-item index="4"><slot></slot></el-menu-item>
      <el-submenu index="2" style="float: right;">
        <template slot="title">
          <el-avatar :size="32" :src="user.photoURL"></el-avatar>
          {{ user.displayName }}
        </template>
        <el-menu-item index="2-3" @click="logout">Выйти</el-menu-item>
      </el-submenu>
      <el-menu-item
        index="3"
        style="float: right;"
        @click="dialogFormVisible = true"
        >Новый проект</el-menu-item
      >
    </el-menu>

    <el-dialog title="Новый проект" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item prop="name" label="Название проекта">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCreate('form')">Отмена</el-button>
        <el-button type="primary" @click="createProject('form')"
          >Создать</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import firebase, { db } from "../firebase";

export default {
  name: "Menu",
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
  props: ["user"],
  methods: {
    logout() {
      firebase.auth().signOut();
    },
    createProject(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          db.collection("projects").add({
            name: this.form.name,
            author: { displayName: this.user.displayName, uid: this.user.uid },
            lastEdit: Date.now()
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

<style scoped></style>
