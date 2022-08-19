<template>
  <div class="board">
    <div class="cells">
      <template v-for="i in 8">
        <div
          class="cell"
          :class="{ colored: ((i % 2) + j) % 2 === 1 }"
          v-for="j in 8"
        />
      </template>
    </div>
    <div class="row-headers">
      <div class="row-header" v-for="i in 8">
        {{ 9 - i }}
      </div>
    </div>
    <div class="row-headers reverse">
      <div class="row-header reverse" v-for="i in 8">
        {{ 9 - i }}
      </div>
    </div>
    <div class="column-headers">
      <div class="row-header" v-for="i in 8">
        {{ String.fromCharCode("A".charCodeAt(0) + i - 1) }}
      </div>
    </div>
    <div class="column-headers reverse">
      <div class="row-header reverse" v-for="i in 8">
        {{ String.fromCharCode("A".charCodeAt(0) + i - 1) }}
      </div>
    </div>

    <div class="pieces">
      <ChessPiece
        @click="handleChessPieceClick(p)"
        v-for="p of pieceStore.pieces"
        :uuid="p.uuid"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { usePieceStore } from "@/stores/piece";
  import { useGameStore } from "@/stores/game";
  import ChessPiece from "./ChessPiece.vue";

  const pieceStore = usePieceStore();
  const gameStore = useGameStore();

  // if (pieceStore.pieces.length === 0) {
  pieceStore.reset();
  // }

  const handleChessPieceClick = (piece: typeof pieceStore.pieces[number]) => {
    if (gameStore.selectionUuid === piece.uuid) {
      gameStore.selectionUuid = undefined;
    } else {
      if (piece.black === gameStore.isBlackTurn) {
        gameStore.selectionUuid = piece.uuid;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .board {
    box-sizing: border-box;
    border: 4px solid #43464b;
    border-radius: 5px;
    width: 100%;
    height: 100%;
    min-width: 200px;
    min-height: 200px;
    aspect-ratio: 1;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(10, 1fr);
    justify-content: stretch;
    align-content: stretch;
    justify-items: stretch;
    align-items: stretch;
    column-gap: 0;
    row-gap: 0;
    background-color: #482114;
    background: url("/wood-texture.jpeg");
    // background-repeat: repeat;
    // background-size: 250px 250px;

    .cell {
      background: #f5f6fa;
      border-radius: 0;

      &.colored {
        background-color: rgba(59, 117, 192, 0.4);
      }
    }

    .cells,
    .pieces {
      grid-column-start: 2;
      grid-row-start: 2;
      grid-column-end: span 8;
      grid-row-end: span 8;
      border: 3px solid white;

      display: grid;
      grid-template-columns: repeat(8, 1fr);
      grid-template-rows: repeat(8, 1fr);
      justify-content: stretch;
      align-content: stretch;
      justify-items: stretch;
      align-items: stretch;
      column-gap: 0;
      row-gap: 0;
    }

    .row-headers {
      grid-column-start: 1;
      grid-row-start: 2;
      grid-column-end: span 1;
      grid-row-end: span 8;

      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: repeat(8, 1fr);
      justify-content: stretch;
      align-content: stretch;
      justify-items: stretch;
      align-items: stretch;
      column-gap: 0;
      row-gap: 0;
      position: relative;

      &.reverse {
        grid-column-start: 10;
      }
    }

    .column-headers {
      grid-column-start: 2;
      grid-row-start: 10;
      grid-column-end: span 8;
      grid-row-end: span 1;
      position: relative;

      display: grid;
      grid-template-columns: repeat(8, 1fr);
      grid-template-rows: 1fr;
      justify-content: stretch;
      align-content: stretch;
      justify-items: stretch;
      align-items: stretch;
      column-gap: 0;
      row-gap: 0;

      &.reverse {
        grid-row-start: 1;
      }
    }

    .row-header,
    .column-header {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #d9ddee;
      font-weight: bold;
      font-size: max(8px, 2.3vmin);
      user-select: none;
      touch-action: none;

      &.reverse {
        transform: rotate(180deg);
      }
    }
  }
</style>
