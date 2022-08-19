<template>
  <div class="piece-logic-builder" ref="containerRef">
    <v-stage
      :config="configKonva"
      :draggable="true"
      @dragmove="handleStageDrag"
      @click="handleGlobalClick"
      @mousemove="handleStageMouseMove"
    >
      <v-layer :config="{ x: 200 }">
        <!-- <v-circle :config="configCircle" :draggable="true"></v-circle> -->
        <v-rect
          v-for="conf of activeBlocks"
          :config="conf"
          :draggable="true"
        ></v-rect>
      </v-layer>
      <v-layer :config="staticLayerOffset">
        <v-rect
          :config="{
            fill: 'grey',
            x: 0,
            y: 0,
            height: configKonva.height,
            width: 200,
          }"
        ></v-rect>
        <v-circle
          :config="{
            x: 100,
            y: 100,
            name: 'create-block',
            radius: 70,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 4,
          }"
        ></v-circle>
      </v-layer>
    </v-stage>
  </div>
</template>

<script lang="ts" setup>
  import { usePieceLogicStore } from "@/stores/pieceLogic";
  import Konva from "konva";
  import type { VueKonvaConfig } from "@/types/vueKonvaConfig";
  import { v4 as uuid } from "uuid";

  const pieceLogicStore = usePieceLogicStore();

  const activeBlocks = computed(() =>
    pieceLogicStore.active?.blocks?.map(
      (p) =>
        ({
          x: p.position.x,
          y: p.position.y,
          name: p.uuid,
          height: 70,
          width: 120,
          cornerRadius: 10,
          fill: "red",
        } as Konva.RectConfig)
    )
  );

  const configKonva = ref<VueKonvaConfig>({
    width: 300,
    height: 300,
  });
  const staticLayerOffset = ref<Konva.LayerConfig>({
    x: 0,
    y: 0,
  });
  const configCircle = {
    x: 100,
    y: 100,
    radius: 70,
    fill: "red",
    stroke: "black",
    strokeWidth: 4,
  };

  const handleStageMouseMove = (ev: Event) => {
    const target = ev.target;
    if (!containerRef.value) return;
    if (!target) return;
    let wantedPointer = "default";
    if (target instanceof Konva.Node && !(target instanceof Konva.Stage)) {
      if (target.draggable()) {
        wantedPointer = "pointer";
      }
      if (target.name().startsWith("create-")) {
        wantedPointer = "copy";
      }
    }
    containerRef.value.style.cursor = wantedPointer;
  };

  const handleStageDrag = (ev: DragEvent) => {
    const t = ev.target;
    if (t === null) return;
    if (!(t instanceof Konva.Stage)) return;
    staticLayerOffset.value.x = -t.x();
    staticLayerOffset.value.y = -t.y();
  };

  const handleGlobalClick = (ev: Event) => {
    console.log("Hello", ev);
    const t = ev.target;
    if (t === null) return;
    if (t instanceof Konva.Node && t.name().startsWith("create-")) {
      pieceLogicStore.addBlock({
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        uuid: uuid(),
      });
      console.log("FGEW");
    }
  };

  const containerRef = ref<HTMLDivElement>();
  const { height, width } = useElementSize(containerRef, {
    height: 100,
    width: 100,
  });
  watchThrottled(
    [height, width],
    () => {
      configKonva.value = {
        height: height.value,
        width: width.value,
      };
    },
    { throttle: 300, immediate: true }
  );
</script>

<style lang="scss" scoped>
  .piece-logic-builder {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
</style>
