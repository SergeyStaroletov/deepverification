<template>
  <div>
    <TableVariables></TableVariables>
    <TableRequirements></TableRequirements>
  </div>
</template>

<script>
import TableVariables from "./Detail/TableVariables";
import TableRequirements from "./Detail/TableRequirements";
export default {
  name: "EditorLTLTab",
  components: { TableRequirements, TableVariables },
  computed: {
    variables() {
      return this.$store.state.variables;
    }
  }
};
</script>

<style scoped></style>
