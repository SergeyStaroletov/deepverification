<template>
  <minimap class="minimap" :width="200" :height="200" />
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

<style scoped>
.minimap {
  margin-top: auto;
  margin-bottom: 5px;
}
</style>
