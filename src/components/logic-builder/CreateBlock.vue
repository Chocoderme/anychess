<template>
  <v-rect
    :config="{
      x,
      y,
      width,
      height,
      name: `create-block-${blockType}`,
      fill: 'lightblue',
      stroke: 'black',
      strokeWidth: 4,
      cornerRadius: 5,
    }"
  />
  <v-text
    :config="{
      x: x,
      y: y,
      width: width - 20,
      height,
      listening: false,
      align: 'center',
      verticalAlign: 'middle',
      fontSize: 15,
      text,
    }"
  />
</template>

<script lang="ts" setup>
  import type { LogicBlockType } from "@/stores/pieceLogic";

  export interface Props {
    blockType: LogicBlockType;
    index: number;
  }
  const props = defineProps<Props>();
  const { blockType, index } = toRefs(props);

  const x = 10;
  const y = computed(() => 10 + (height + space) * index.value);
  const width = 180;
  const height = 30;
  const space = 15;
  const text = computed(() =>
    blockType.value.toLocaleLowerCase().replace(/_/g, " ")
  );
</script>
