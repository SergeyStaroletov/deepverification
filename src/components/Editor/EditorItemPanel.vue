<template>
  <item-panel class="items">
    <register-node
      name="flow-start"
      :config="customNodes.flowStart"
      extend="flow-circle"
    />
    <register-node
      name="flow-end"
      :config="customNodes.flowEnd"
      extend="flow-circle"
    />
    <register-node
      name="flow-if"
      :config="customNodes.flowIf"
      extend="flow-rhombus"
    />
    <register-node
      name="flow-step"
      :config="customNodes.flowStep"
      extend="flow-rect"
    />
    <register-node
      name="flow-label"
      :config="customNodes.flowLabel"
      extend="flow-rect"
    />
    <register-node
      name="flow-run"
      :config="customNodes.flowRun"
      extend="flow-capsule"
    />
    <register-node
      name="flow-send"
      :config="customNodes.flowSend"
      extend="flow-rect"
    />
    <register-node
      name="flow-get"
      :config="customNodes.flowGet"
      extend="flow-rect"
    />
    <item
      class="item"
      type="node"
      size="144*72"
      shape="flow-step"
      :model="{
        label: 'Step',
        color: '#1890FF'
      }"
      src="/img/step.svg"
    />
    <item
      type="node"
      size="144*72"
      shape="flow-if"
      :model="{
        label: 'If',
        color: '#5CDBD3'
      }"
      src="/img/if.svg"
    />
    <item
      v-if="startNodeId === false"
      type="node"
      size="72*72"
      shape="flow-start"
      :model="{
        color: '#FA8C16',
        label: 'Start'
      }"
      src="/img/start.svg"
    />
    <item
      v-if="endNodeId === false"
      type="node"
      size="72*72"
      shape="flow-end"
      :model="{
        color: '#FA8C16',
        label: 'End'
      }"
      src="/img/end.svg"
    />
    <item
      class="item"
      type="node"
      size="70*30"
      shape="flow-label"
      :model="{
        label: 'Label'
      }"
      src="/img/label.svg"
    />
    <item
      class="item"
      type="node"
      size="144*72"
      shape="flow-run"
      :model="{
        color: '#a15be8',
        label: 'Run',
        process: ''
      }"
      src="/img/run.svg"
    />
    <item
      class="item"
      type="node"
      size="144*72"
      shape="flow-send"
      :model="{
        label: 'Send',
        chanel: ''
      }"
      src="/img/send.svg"
    />
    <item
      class="item"
      type="node"
      size="144*72"
      shape="flow-get"
      :model="{
        label: 'Get',
        chanel: ''
      }"
      src="/img/get.svg"
    />
  </item-panel>
</template>

<script>
import firebase, { db } from "../../firebase";
import "firebase/firestore";
import { Item, ItemPanel, RegisterNode } from "vg-editor";

export default {
  name: "EditorItemPanel",
  components: { Item, ItemPanel, RegisterNode },
  mounted() {
    // todo кажется монтировать биндинг к firebase в каждом компоненте не очень хорошо
    // this.$bind(
    //   "data.nodes",
    //   db
    //     .collection("projects")
    //     .doc(this.$route.params.id)
    //     .collection("nodes")
    // );
    // this.$bind(
    //   "data.edges",
    //   db
    //     .collection("projects")
    //     .doc(this.$route.params.id)
    //     .collection("edges")
    // );
    // this.$bind("project", db.collection("projects").doc(this.$route.params.id));
  },
  data() {
    return {
      project: {},
      data: {
        nodes: [],
        edges: []
      },
      customNodes: {
        flowStart: {
          name: "flowStart",
          anchor: {
            points: [[0.5, 1]],
            intersectBox: "circle"
          }
        },
        flowEnd: {
          name: "flowEnd",
          anchor: {
            points: [[0.5, 0]],
            intersectBox: "circle"
          }
        },
        flowIf: {
          name: "flowIf"
        },
        flowStep: {
          name: "flowStep"
        },
        flowLabel: {
          name: "flowLabel",
          anchor: {
            points: []
          },
          draw(item) {
            const group = item.getGraphicGroup();
            const model = item.getModel();
            let str = "";
            for (let i = 0; i < model.label.length; i++) {
              str = str + "  ";
            }
            group.addShape("text", {
              attrs: {
                x: 0,
                y: 0,
                fill: "#333",
                hover: "#333",
                text: model.label
              }
            });
            return group.addShape("text", {
              attrs: {
                x: 0,
                y: 0,
                text: str
              }
            });
          }
        },
        flowRun: {
          name: "flowRun"
        },
        flowSend: {
          name: "flowSend"
        },
        flowGet: {
          name: "flowGet"
        }
      }
    };
  },
  computed: {
    startNodeId() {
      let a = this.process.nodes.filter(e => e.shape === "flow-start");
      if (a.length === 1) {
        return a[0].id;
      } else {
        return false;
      }
    },
    endNodeId() {
      let a = this.process.nodes.filter(e => e.shape === "flow-end");
      if (a.length === 1) {
        return a[0].id;
      } else {
        return false;
      }
    },
    process() {
      return this.$store.state.process;
    }
  }
};
</script>

<style scoped>
.items {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
}
.item {
  width: 100px;
}
</style>
