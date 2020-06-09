<template>
  <div>
    <EditorVariables></EditorVariables>
    <LTLREquirements></LTLREquirements>
  </div>
</template>

<script>
import EditorVariables from "./Detail/EditorVariables";
import LTLREquirements from "./Detail/LTLREquirements";

export default {
  name: "EditorLTLTab",
  components: {LTLREquirements, EditorVariables },
  computed: {
    variables() {
      return this.$store.state.variables;
    }
  }
};
</script>

<style scoped></style>
