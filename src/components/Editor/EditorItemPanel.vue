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
    this.$bind(
      "data.nodes",
      db
        .collection("projects")
        .doc(this.$route.params.id)
        .collection("nodes")
    );
    this.$bind(
      "data.edges",
      db
        .collection("projects")
        .doc(this.$route.params.id)
        .collection("edges")
    );
    this.$bind("project", db.collection("projects").doc(this.$route.params.id));
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
          // options: {
          //   style: {
          //     opacity: true,
          //     fillOpacity: true,
          //     color: "#ef0b0b"
          //   }
          // },
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

            // const group = item.getGraphicGroup();
            // const model = item.getModel();
            // group.addShape("text", {
            //   attrs: {
            //     x: 0,
            //     y: 0,
            //     fill: "#333",
            //     text:
            //       "I am a custom node, \ncomposed by the red rect and the blue point"
            //   }
            // });
            // group.addShape("text", {
            //   attrs: {
            //     x: 0,
            //     y: 0,
            //     fill: "#333",
            //     text:
            //       " (" +
            //       model.x +
            //       ", " +
            //       model.y +
            //       ") \n the origin is the coordinate of the group",
            //     textBaseline: "top"
            //   }
            // });
            // group.addShape("circle", {
            //   attrs: {
            //     x: 0,
            //     y: 0,
            //     r: 4,
            //     fill: "blue"
            //   }
            // });
            // return group.addShape("rect", {
            //   attrs: {
            //     x: 0,
            //     y: 0,
            //     width: 100,
            //     height: 100,
            //     stroke: "red"
            //   }
            // });
          }
        }
      }
    };
  },
  computed: {
    startNodeId() {
      let a = this.data.nodes.filter(e => e.shape === "flow-start");
      if (a.length === 1) {
        return a[0].id;
      } else {
        return false;
      }
    },
    endNodeId() {
      let a = this.data.nodes.filter(e => e.shape === "flow-end");
      if (a.length === 1) {
        return a[0].id;
      } else {
        return false;
      }
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
