<template>
  <fragment>
    <el-button size="mini" @click="dialogFormVisible = true"
      ><slot></slot
    ></el-button>
    <el-dialog
      align="left"
      title="Новый канал"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item prop="name" label="Название">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="type" label="Тип">
          <el-select v-model="form.type" placeholder="выберите тип">
            <el-option label="int" value="int"></el-option>
            <el-option label="bool" value="bool"></el-option>
            <el-option label="byte" value="byte"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="length" label="Длина">
          <el-input v-model="form.length" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="Описание">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCreate('form')">Отмена</el-button>
        <el-button type="primary" @click="createProcess('form')"
          >Добавить канал</el-button
        >
      </span>
    </el-dialog>
  </fragment>
</template>

<script>
import firebase, { db } from "../../../firebase";

export default {
  name: "AddEditChanels",
  data() {
    return {
      dialogFormVisible: false,
      form: {},
      rules: {
        name: [
          {
            required: true,
            message: "Пожалуйста, введите название",
            trigger: "blur"
          },
          {
            min: 1,
            max: 250,
            message: "Длинна названия должна быть от 1 до 250 символов",
            trigger: "blur"
          }
        ]
      }
    };
  },
  props: ["variable"],
  mounted() {
    this.form = Object.assign(this.variable, {});
  },
  methods: {
    createProcess(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          db.collection("projects")
            .doc(this.$route.params.id)
            .collection("processes")
            .doc("Требования")
            .collection("chanels")
            .add(this.form);
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
