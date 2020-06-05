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
    :onNodeClick="clickToNode"
  ></flow>
</template>

<script>
import { Flow } from "vg-editor";
export default {
  name: "EditorProcess",
  components: { Flow },
  methods: {
    clickToNode(e) {
      console.log(e);
      if (e.domEvent.ctrlKey && e.item.model.shape === "flow-run") {
        this.$router.push({
          path: `/project/${this.$route.params.id}/${e.item.model.process}`
        });
      }
    }
  }
};
</script>

<style scoped></style>
