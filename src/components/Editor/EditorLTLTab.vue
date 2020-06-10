<template>
  <div class="tables">
    <TableVariables></TableVariables>
    <TableChanels></TableChanels>
    <TableRequirements></TableRequirements>
  </div>
</template>

<script>
import TableVariables from "./Detail/TableVariables";
import TableRequirements from "./Detail/TableRequirements";
import TableChanels from "./Detail/TableChanels";
export default {
  name: "EditorLTLTab",
  components: { TableChanels, TableRequirements, TableVariables },
  computed: {
    variables() {
      return this.$store.state.variables;
    }
  }
};
</script>

<style>
.tables {
  overflow-y: scroll;
  height: calc(100vh - 61px - 40px);
}
</style>
