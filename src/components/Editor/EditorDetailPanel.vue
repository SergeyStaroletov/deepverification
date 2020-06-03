<template>
  <detail-panel>
    <template v-slot="{ status }">
      <node-panel :status="status">
        <DetailForm></DetailForm>
      </node-panel>
      <edge-panel :status="status">
        <DetailForm></DetailForm>
      </edge-panel>
    </template>
  </detail-panel>
</template>

<script>
import DetailForm from "../DetailForm";
import { DetailPanel, NodePanel, EdgePanel } from "vg-editor";
export default {
  name: "EditorDetailPanel",
  components: { DetailPanel, NodePanel, EdgePanel, DetailForm }
};
</script>

<style scoped></style>
