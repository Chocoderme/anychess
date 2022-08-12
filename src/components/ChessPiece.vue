<template>
  <div
    class="chess-piece"
    :style="{
      gridColumnStart: piece?.position?.x ?? 1,
      gridRowStart: 9 - (piece?.position?.y ?? 1),
    }"
  >
    <img
      v-if="imgUrl"
      :src="imgUrl"
      :style="{ transform: `scale(${pieceSize})` }"
    />
  </div>
</template>

<script lang="ts" setup>
  import { usePieceStore } from "@/stores/piece";

  export interface Props {
    uuid: string;
  }

  const props = defineProps<Props>();
  const { uuid } = toRefs(props);

  const pieceStore = usePieceStore();

  const piece = computed(() => pieceStore.get(uuid.value));
  const imgUrl = computed(() => piece.value?.img);
  const pieceSize = computed(() => piece.value?.size ?? 1);
</script>

<style lang="scss" scoped>
  .chess-piece {
    position: relative;
    user-select: none;
    touch-action: none;

    img {
      position: absolute;
      inset: 0;
      height: 100%;
      width: 100%;
    }
  }
</style>
