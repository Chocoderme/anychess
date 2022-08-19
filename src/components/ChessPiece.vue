<template>
  <div
    class="chess-piece"
    :style="{
      gridColumnStart: piece?.position?.x ?? 1,
      gridRowStart: 9 - (piece?.position?.y ?? 1),
    }"
    :class="{
      selected: gameStore.selectionUuid === uuid,
      selectable: gameStore.isBlackTurn === piece?.black,
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
  import { useGameStore } from "@/stores/game";
  import { usePieceStore } from "@/stores/piece";

  export interface Props {
    uuid: string;
  }

  const props = defineProps<Props>();
  const { uuid } = toRefs(props);

  const pieceStore = usePieceStore();
  const gameStore = useGameStore();

  const piece = computed(() => pieceStore.get(uuid.value));
  const imgUrl = computed(() => piece.value?.img);
  const pieceSize = computed(() => piece.value?.size ?? 1);
</script>

<style lang="scss" scoped>
  .chess-piece {
    position: relative;
    user-select: none;
    touch-action: none;
    transition: transform 0.2s ease-in-out;

    img {
      position: absolute;
      inset: 0;
      height: 100%;
      width: 100%;
      transition: outline 0.2s ease-in-out;
    }

    &.selectable {
      cursor: pointer;
    }

    &.selected {
      transform: scale(1.1);
      img {
        outline: 4px solid purple;
        outline-offset: -4px;
      }
    }
  }
</style>
