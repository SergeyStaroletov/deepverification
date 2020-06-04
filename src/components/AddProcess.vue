<template>
  <fragment>
    <el-menu-item style="float: right;" @click="dialogFormVisible = true"
      >Новый процесс</el-menu-item
    >
    <el-dialog title="Новый процесс" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item prop="name" label="Название процесса">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCreate('form')">Отмена</el-button>
        <el-button type="primary" @click="createProcess('form')"
          >Создать новый процесс</el-button
        >
      </span>
    </el-dialog>
  </fragment>
</template>

<script>
import firebase, { db } from "../firebase";

export default {
  name: "AddProcess",
  data() {
    var validateUniqueProcessname = (rule, value, callback) => {
      console.log(this.processes);

      let a = this.processes.some(e => e.id === value);
      console.log(a);
      if (a) {
        callback(new Error("Пожалуйста, введите новое имя процесса"));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      form: {
        name: ""
      },
      rules: {
        name: [
          {
            validator: validateUniqueProcessname,
            // message: "Такой процесс уже существует",
            trigger: "blur"
          },
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
    };
  },
  computed: {
    processes() {
      return this.$store.state.processes;
    }
  },
  methods: {
    createProcess(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          db.collection("projects")
            .doc(this.$route.params.id)
            .collection("processes")
            .add({
              type: "cyber",
              name: this.form.name
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
