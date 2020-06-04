<template>
  <detail-panel>
    <template v-slot="{ status }">
      <node-panel :status="status">
        <DetailForm></DetailForm>
      </node-panel>
      <edge-panel :status="status">
        <DetailForm></DetailForm>
      </edge-panel>
      <canvas-panel :status="status">
        <DetailProject></DetailProject>
      </canvas-panel>
    </template>
  </detail-panel>
</template>

<script>
import DetailForm from "../DetailForm";
import { DetailPanel, NodePanel, EdgePanel, CanvasPanel } from "vg-editor";
import DetailProject from "./Detail/DetailProject";
export default {
  name: "EditorDetailPanel",
  components: {
    DetailProject,
    DetailPanel,
    NodePanel,
    EdgePanel,
    CanvasPanel,
    DetailForm
  }
};
</script>

<style scoped></style>
