<template>
  <minimap class="minimap" :width="190" :height="190" />
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
  /*width: 1px;*/
  /*margin-top: auto;*/
  /*margin-bottom: 5px;*/
}
</style>
