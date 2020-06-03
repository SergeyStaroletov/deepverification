<template>
  <minimap :width="200" :height="200" />
</template>

<script>
import { Minimap } from "vg-editor";
export default {
  name: "EditorMiniMap",
  components: {
    Minimap
  }
};
</script>

<style scoped></style>
