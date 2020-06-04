<template>
  <fragment>
    <el-menu-item style="float: right;" @click="dialogFormVisible = true"
      >Новый проект</el-menu-item
    >
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
  </fragment>
</template>

<script>
import firebase, { db } from "../firebase";

export default {
  name: "AddProject",
  data: () => ({
    dialogFormVisible: false,
    form: {
      name: ""
    },
    rules: {
      name: [
        {
          required: true,
          message: "Пожалуйста, введите название процесса",
          trigger: "blur"
        },
        {
          min: 3,
          max: 25,
          message: "Длинна названия должна быть от 3 до 25 символов",
          trigger: "blur"
        }
      ]
    }
  }),
  computed: {
    user() {
      return firebase.auth().currentUser;
    }
  },
  methods: {
    createProject(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          db.collection("projects")
            .add({
              name: this.form.name,
              collaborators: [],
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
                .doc("main")
                .set({
                  name: "main",
                  type: "cyber",
                  created: Date.now()
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

<style scoped></style>
