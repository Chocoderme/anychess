<template>
  <div class="piece-logic-builder" ref="containerRef">
    <v-stage
      :config="configKonva"
      :draggable="true"
      @dragstart="handleStageDragStart"
      @dragmove="handleStageDrag"
      @click="handleGlobalClick"
      @pointermove="handleStagePointerMove"
      @pointerdown="handleGlobalPointerDown"
      @pointerup="handleGlobalPointerUp"
      @wheel="handleWheel"
      ref="stageRef"
    >
      <v-layer
        :config="{
          id: 'object-layer',
          x: 200,
          scale: { x: layerScale, y: layerScale },
        }"
      >
        <template v-for="block of activeBlocks">
          <BlockRect :block="block" />
          <BlockIO v-for="(output, i) of block.outputs" :io="output" />
          <BlockIO v-for="(input, i) of block.inputs" :io="input" />
        </template>
        <v-line
          v-if="isCreatingLine"
          :config="{
            x: linePoints[0],
            y: linePoints[1],
            points: linePoints.map((v, i) =>
              i % 2 === 0 ? v - linePoints[0] : v - linePoints[1]
            ),
            stroke: 'white',
            strokeWidth: 4,
            lineCap: 'round',
            tension: 0,
            listening: false,
          }"
        />
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
        <CreateBlock
          v-for="(logicBlockType, index) of sideMenuBlocks"
          :block-type="logicBlockType"
          :index="index"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script lang="ts" setup>
  import {
    usePieceLogicStore,
    LogicBlockType,
    type LogicBlockIO,
  } from "@/stores/pieceLogic";
  import Konva from "konva";
  import type { VueKonvaConfig } from "@/types/vueKonvaConfig";

  const pieceLogicStore = usePieceLogicStore();

  const stageRef = ref<{ getStage: () => Konva.Stage }>();
  const isCreatingLine = ref(false);
  const startPoint = ref<LogicBlockIO | undefined>(undefined);
  const endPoint = ref<LogicBlockIO | undefined>(undefined);
  const linePoints = ref<number[]>([]);
  const activeBlocks = computed(() => pieceLogicStore.active?.blocks);

  const sideMenuBlocks = Object.values(LogicBlockType).filter(
    (t) => t !== LogicBlockType.START && t !== LogicBlockType.END
  );

  provide("stageRefKey", readonly(stageRef));

  const configKonva = ref<VueKonvaConfig>({
    width: 300,
    height: 300,
  });
  const staticLayerOffset = ref<Konva.LayerConfig>({
    x: 0,
    y: 0,
  });
  const layerScale = ref(1);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    // stop default scrolling
    e.evt.preventDefault();

    const stage = stageRef.value?.getStage();
    const layer = stage?.findOne("#object-layer");
    if (!stage || !layer) return;

    const oldScale = layer.scaleX();
    const pointer = layer.getRelativePointerPosition();

    const mousePointTo = {
      x: ((pointer?.x ?? 0) - layer.x()) / oldScale,
      y: ((pointer?.y ?? 0) - layer.y()) / oldScale,
    };

    // how to scale? Zoom in? Or zoom out?
    let direction = e.evt.deltaY > 0 ? 1 : -1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
      direction = -direction;
    }

    const scaleBy = 1.05;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    layerScale.value = newScale;
    const newPos = {
      x: (pointer?.x ?? 0) - mousePointTo.x * newScale,
      y: (pointer?.y ?? 0) - mousePointTo.y * newScale,
    };
    layer.position(newPos);
  };

  const handleStagePointerMove = (ev: Konva.KonvaEventObject<PointerEvent>) => {
    const target = ev.target;
    if (!containerRef.value) return;
    if (!target) return;
    let wantedPointer = "default";
    if (target instanceof Konva.Node && !(target instanceof Konva.Stage)) {
      if (target.draggable()) {
        wantedPointer = "move";
      }
      if (
        target.name().startsWith("input-") ||
        target.name().startsWith("output-")
      ) {
        wantedPointer = "pointer";
      }
      if (target.name().startsWith("create-block-")) {
        wantedPointer = "copy";
      }
    }

    if (isCreatingLine.value) {
      wantedPointer = "default";
      // console.log(ev);

      if (
        (target.name().startsWith("input-") ||
          target.name().startsWith("output-")) &&
        startPoint.value !== undefined
      ) {
        const blockUuid = target.name().split("-").slice(1).join("-");
        if (blockUuid !== startPoint.value.parent?.uuid) {
          const block = activeBlocks.value?.find((b) => b.uuid === blockUuid);
          const endIO = (
            startPoint.value?.type === "input" ? block?.outputs : block?.inputs
          )?.find((io) => io.uuid === target.id());
          if (endIO?.dataType === startPoint.value?.dataType) {
            wantedPointer = "pointer";
            endPoint.value = endIO;
          }
        }
      }
      if (wantedPointer !== "pointer") {
        endPoint.value = undefined;
      }

      // Update line position
      const stage = stageRef.value?.getStage();
      const layer = stage?.findOne("#object-layer");
      if (!stage || !layer) return;
      const pointerRelativePosition = layer.getRelativePointerPosition();
      const p = linePoints.value.slice(0, 4);
      p.push(pointerRelativePosition.x, pointerRelativePosition.y);
      linePoints.value = p;
    }
    containerRef.value.style.cursor = wantedPointer;
  };

  const handleStageDragStart = (ev: Konva.KonvaEventObject<DragEvent>) => {
    const t = ev.target;
    if (t === null) return;
  };

  const handleStageDrag = (ev: Konva.KonvaEventObject<DragEvent>) => {
    const t = ev.target;
    if (t === null) return;
    const block = activeBlocks.value?.find((b) => b.uuid === t.id());
    // Target is a block, update X and Y
    if (block) {
      block.position.x = t.x();
      block.position.y = t.y();
      return;
    }
    if (!(t instanceof Konva.Stage)) return;
    staticLayerOffset.value.x = -t.x();
    staticLayerOffset.value.y = -t.y();
  };

  const handleGlobalPointerDown = (
    ev: Konva.KonvaEventObject<PointerEvent>
  ) => {
    const t = ev.target;
    if (t === null) return;
    if (t instanceof Konva.Node) {
      if (t.name().startsWith("input-") || t.name().startsWith("output-")) {
        // Prevents drag to happen
        ev.cancelBubble = true;
        ev.evt.preventDefault();

        isCreatingLine.value = true;
        startPoint.value = activeBlocks.value
          ?.map((b) => [...(b.inputs ?? []), ...(b.outputs ?? [])])
          .flat(1)
          .find((io) => io.uuid === t.id());
        const direction = t.name().startsWith("input-") ? -1 : 1;
        linePoints.value = [t.x(), t.y(), t.x() + 25 * direction, t.y()];

        return false;
      }
    }
  };

  const handleGlobalPointerUp = (ev: Konva.KonvaEventObject<PointerEvent>) => {
    if (isCreatingLine.value) {
      console.log(startPoint.value, endPoint.value);
      if (startPoint.value && endPoint.value) {
        // if (startPoint.value.link !== undefined) {
        //   startPoint.value.link.link = undefined;
        // }
        // if (endPoint.value.link !== undefined) {
        //   endPoint.value.link.link = undefined;
        // }
        startPoint.value.links.push(endPoint.value);
        endPoint.value.links = [startPoint.value];
        console.log("CREATED LINK", endPoint.value.type);
      }
      isCreatingLine.value = false;
      linePoints.value = [];
      startPoint.value = undefined;
      endPoint.value = undefined;
    }
  };

  const handleGlobalClick = (ev: Konva.KonvaEventObject<MouseEvent>) => {
    const t = ev.target;
    if (t === null) return;
    if (t instanceof Konva.Node) {
      if (t.name().startsWith("create-block-")) {
        const blockType = Object.entries(LogicBlockType).find(
          (lbt) => lbt[1] === t.name().slice("create-block-".length)
        );
        if (!blockType) return;
        pieceLogicStore.addBlock({
          type: blockType[1],
          position: { x: Math.random() * 400, y: Math.random() * 400 },
        });
      }
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

  onMounted(() => {
    console.log(stageRef.value?.getStage().getChildren());
  });
</script>

<style lang="scss" scoped>
  .piece-logic-builder {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
</style>
