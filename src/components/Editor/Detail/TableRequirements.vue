<template>
  <div>
    <h3>LTL требования <AddEditRequirements>Добавить</AddEditRequirements></h3>
    <el-table :data="requirements" style="width: 100%">
      <el-table-column label="Предикат" prop="requirement"> </el-table-column>
      <el-table-column label="Description" prop="description">
      </el-table-column>
      <el-table-column label="Class" prop="class"> </el-table-column>
      <el-table-column width="300" align="right">
        <template slot-scope="scope">
          <!--                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"-->
          <!--                      >Edit</el-button-->
          <!--                    >-->
          <AddEditRequirements :variable="scope.row"
            >Изменить</AddEditRequirements
          >
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >Удалить</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import firebase, { db } from "../../../firebase";
import AddEditRequirements from "./AddEditRequirements";

export default {
  name: "TableRequirements",
  components: { AddEditRequirements },
  data() {
    return {
      search: ""
    };
  },
  computed: {
    requirements() {
      return this.$store.state.requirements;
    }
  },
  methods: {
    handleDelete(row) {
      db.collection("projects")
        .doc(this.$route.params.id)
        .collection("processes")
        .doc("Требования")
        .collection("requirements")
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
