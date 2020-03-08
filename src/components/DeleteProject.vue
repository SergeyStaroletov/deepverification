<template>
  <div>
    <el-button
      @click.native.prevent="dialogVisible = true"
      type="text"
      size="small"
      >Удалить</el-button
    >

    <el-dialog title="Внимание" :visible.sync="dialogVisible" width="30%">
      <span
        >Вы, действительно хотите удалить проект <b>{{ project.name }}</b
        >?</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Нет</el-button>
        <el-button type="primary" @click="deleteProject">Да</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import firebase, { db } from "../firebase";

export default {
  name: "DeleteProject",
  data: () => ({
    dialogVisible: false
  }),
  props: ["project"],
  methods: {
    deleteProject(id) {
      db.collection("projects")
        .doc(this.project.id)
        .delete()
        .then(function() {
          console.log("Document successfully deleted!");
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
    }
  }
};
</script>

<style scoped></style>
