<template>
  <div>
    <h3>Каналы <AddEditChanels>Добавить</AddEditChanels></h3>
    <el-table :data="chanels" style="width: 100%">
      <el-table-column label="Name" prop="name"> </el-table-column>
      <el-table-column label="Type" prop="type"> </el-table-column>
      <el-table-column label="Length" prop="lenght"> </el-table-column>
      <el-table-column label="Description" prop="description">
      </el-table-column>
      <el-table-column width="300" align="right">
        <template slot-scope="scope">
          <AddEditChanels :variable="scope.row">Изменить</AddEditChanels>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >Удалить</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import AddEditChanels from "./AddEditChanels";
import firebase, { db } from "../../../firebase";

export default {
  name: "TableChanels",
  components: { AddEditChanels },
  data() {
    return {
      search: ""
    };
  },
  computed: {
    chanels() {
      return this.$store.state.chanels;
    }
  },
  methods: {
    handleDelete(row) {
      db.collection("projects")
        .doc(this.$route.params.id)
        .collection("processes")
        .doc("Требования")
        .collection("chanels")
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
