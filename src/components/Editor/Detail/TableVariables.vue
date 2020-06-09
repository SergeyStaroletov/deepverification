<template>
  <div>
    <h3>Глобальные переменные <AddEditVariables>Добавить</AddEditVariables></h3>
    <el-table :data="variables" style="width: 100%">
      <el-table-column label="Variable" prop="name"> </el-table-column>
      <el-table-column label="Type" prop="type"> </el-table-column>
      <el-table-column label="Array" prop="isArray">
        <template slot-scope="scope">
          {{ scope.row.isArray === true ? "да" : "нет" }}
        </template>
      </el-table-column>
      <el-table-column label="Description" prop="description">
      </el-table-column>
      <el-table-column label="Initial Value" prop="initial"> </el-table-column>
      <el-table-column width="300" align="right">
        <template slot-scope="scope">
          <AddEditVariables :variable="scope.row">Изменить</AddEditVariables>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >Удалить</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import AddEditVariables from "./AddEditVariables";
import firebase, { db } from "../../../firebase";

export default {
  name: "TableVariables",
  components: { AddEditVariables },
  data() {
    return {
      search: ""
    };
  },
  computed: {
    variables() {
      return this.$store.state.variables;
    }
  },
  methods: {
    handleDelete(row) {
      db.collection("projects")
        .doc(this.$route.params.id)
        .collection("processes")
        .doc("Требования")
        .collection("variables")
        .doc(row.id)
        .delete();
    }
  }
};
</script>

<style scoped>
h3 {
  margin-left: 5px;
}
</style>
