<template>
  <v-circle
    v-if="block"
    :config="{
      id: io.uuid,
      name: `${type}-${block.uuid}`,
      x: x,
      y: y,
      radius: 10,
      fill: getIOColor(io),
      stroke: 'black',
      strokeWidth: 4,
    }"
    :draggable="false"
  />
  <v-line
    v-if="linePoints.length > 0"
    :config="{
      x: x,
      y: y,
      points: linePoints,
      stroke: 'white',
      strokeWidth: 4,
      lineCap: 'round',
      tension: 0,
      listening: false,
    }"
  />
</template>

<script lang="ts" setup>
  import { LogicBlockDataType, type LogicBlockIO } from "@/stores/pieceLogic";
  import type Konva from "konva";
  import type { DeepReadonly, Ref } from "vue";

  export interface Props {
    io: LogicBlockIO;
  }

  const stageRef = inject<
    DeepReadonly<Ref<{ getStage: () => Konva.Stage } | undefined>>
  >("stageRefKey", ref(undefined));

  const props = defineProps<Props>();
  const { io } = toRefs(props);
  const block = computed(() => io.value.parent);
  const parentRect = ref<Konva.Rect | undefined>(undefined);
  const type = computed(() => io.value.type);
  const ios = computed(() =>
    type.value === "input" ? block?.value?.inputs : block?.value?.outputs
  );
  const index = computed(
    () => ios.value?.findIndex((v) => v.uuid === io.value.uuid) ?? 0
  );

  onMounted(() => {
    parentRect.value = stageRef.value
      ?.getStage()
      .findOne(`#${block.value?.uuid}`) as Konva.Rect | undefined;
  });

  const x = computed(() =>
    type.value === "input"
      ? block.value?.position.x ?? 0
      : (block.value?.position.x ?? 0) + (parentRect.value?.width() ?? 120)
  );
  const y = computed(
    () => (block.value?.position.y ?? 0) + 20 + 30 * index.value
  );

  const linePoints = computed(() => {
    if (io.value.type !== "input" || io.value.links.length !== 1) return [];
    const targetUuid = io.value.links[0]?.uuid;
    if (!targetUuid) return [];
    const inputIndex = io.value.links[0].parent?.outputs.findIndex(
      (i) => i.uuid === targetUuid
    );
    const linkTargetPosition = stageRef.value
      ?.getStage()
      ?.findOne(`#${targetUuid}`)
      ?.position();
    if (!linkTargetPosition) return [];
    return [
      0,
      0,
      -10,
      0,
      linkTargetPosition.x - x.value + 10,
      linkTargetPosition.y - y.value,
      linkTargetPosition.x - x.value,
      linkTargetPosition.y - y.value,
    ];
  });

  watch(linePoints, () =>
    console.log(
      "NOW HAS LINE",
      block.value?.uuid,
      index.value,
      linePoints.value
    )
  );

  const getIOColor = (io: LogicBlockIO): string => {
    switch (io.dataType) {
      case LogicBlockDataType.NUMBER:
        return "cyan";
      case LogicBlockDataType.PIECE_TYPE:
        return "orange";
      case LogicBlockDataType.PIECE_COLOR:
        return "orangered";
      case LogicBlockDataType.STRING:
        return "green";
      case LogicBlockDataType.VECTOR_2D:
        return "purple";
      case LogicBlockDataType.BOOLEAN:
        return "magenta";
      default:
        return "grey";
    }
  };
</script>
