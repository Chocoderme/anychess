<template>
  <v-rect :config="getBlockConfig(block)" :draggable="true" />
  <v-text :config="getTextConfig(block)" />
  <v-text
    v-if="block.type === 'START'"
    :config="{
      x: block.position.x,
      y: block.position.y,
      width: width - 20,
      height: height,
      listening: false,
      align: 'right',
      verticalAlign: 'middle',
      fontSize: 15,
      text: `Position:\n\nColor:`,
    }"
  />
</template>

<script lang="ts" setup>
  import { LogicBlockType, type LogicBlock } from "@/stores/pieceLogic";
  import type Konva from "konva";
  import { v4 as uuid } from "uuid";

  export interface Props {
    block: LogicBlock;
  }
  const props = defineProps<Props>();
  const { block } = toRefs(props);

  const width = Math.random() > 0.5 ? 250 : 300;
  const height = Math.max(
    30,
    10 + Math.max(block.value.inputs.length, block.value.outputs.length) * 30
  );

  const getBlockConfig = (block: LogicBlock): Konva.RectConfig => ({
    x: block.position.x,
    y: block.position.y,
    id: block.uuid,
    name: `block-${block.type}`,
    height,
    width,
    cornerRadius: 10,
    fill: "red",
    stroke: "black",
    strokeWidth: 4,
  });

  const getTextConfig = (block: LogicBlock): Konva.TextConfig => ({
    x: block.position.x,
    y: block.position.y,
    width,
    height,
    padding: 30,
    id: uuid(),
    name: `text-${block.type}`,
    text: `${block.type.replace(/_/g, " ")}`,
    fontSize: 18,
    fill: "black",
    align:
      block.type === LogicBlockType.START
        ? "left"
        : block.type === LogicBlockType.END
        ? "right"
        : "center",
    verticalAlign: "middle",
    fontStyle:
      block.type === LogicBlockType.START || block.type === LogicBlockType.END
        ? "bold"
        : "normal",
    listening: false,
  });
</script>
