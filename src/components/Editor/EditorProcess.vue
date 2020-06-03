<template>
  <flow
    :shortcut="{ zoomIn: true, zoomOut: true }"
    :grid="{
      cell: 150,
      type: 'line',
      line: {
        stroke: '#edf3f3',
        lineWidth: 0.5
      }
    }"
  />
</template>

<script>
import { Flow } from "vg-editor";
export default {
  name: "EditorProcess",
  components: { Flow }
};
</script>

<style scoped></style>
