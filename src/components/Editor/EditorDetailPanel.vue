<template>
  <detail-panel>
    <template v-slot="{ status }">
      <node-panel :status="status">
        <DetailNode />
      </node-panel>
      <edge-panel :status="status">
        <DetailEdge />
      </edge-panel>
      <canvas-panel :status="status">
        <DetailProject />
      </canvas-panel>
    </template>
  </detail-panel>
</template>

<script>
import DetailForm from "../DetailForm";
import { DetailPanel, NodePanel, EdgePanel, CanvasPanel } from "vg-editor";
import DetailProject from "./Detail/DetailProject";
import DetailNode from "./Detail/DetailNode";
import DetailEdge from "./Detail/DetailEdge";
export default {
  name: "EditorDetailPanel",
  components: {
    DetailEdge,
    DetailNode,
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
