<template>
  <ul class="piece-navigator">
    <li
      v-for="pieceType of pieceTypes"
      @click="handlePieceClick($event, pieceType)"
      class="piece"
      :class="{ active: pieceLogicStore.activeType === pieceType }"
    >
      {{ pieceType }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
  import { usePieceLogicStore } from "@/stores/pieceLogic";
  import type { PieceType } from "@/types/pieceType";

  const emit = defineEmits<{
    (e: "click", value: PieceType): void;
  }>();

  const pieceLogicStore = usePieceLogicStore();

  const pieceTypes = computed(() => pieceLogicStore.pieces.map((p) => p.type));

  const handlePieceClick = (ev: MouseEvent, type: PieceType) => {
    ev.preventDefault();
    ev.stopPropagation();
    emit("click", type);
    pieceLogicStore.activeType = type;
  };
</script>

<style lang="scss" scoped>
  .piece-navigator {
    list-style: none;
    padding: 0;
    margin: 0;
    .piece {
      cursor: pointer;
      user-select: none;
      -moz-user-select: none;
      transition: color 0.2s ease-in-out;

      &.active {
        color: cyan;
      }
    }
  }
</style>
