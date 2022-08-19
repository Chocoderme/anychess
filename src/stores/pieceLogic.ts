import { PieceType } from "@/types/pieceType";
import { defineStore } from "pinia";

export type LogicBlock = {
  position: { x: number; y: number };
  uuid: string;
};

export const usePieceLogicStore = defineStore({
  id: "pieceLogic",
  state: () => ({
    pieces: [] as {
      type: PieceType;
      blocks: LogicBlock[];
    }[],
    activeType: undefined as undefined | PieceType,
  }),
  getters: {
    get(state): (type: PieceType) => typeof state.pieces[number] | undefined {
      return (type: PieceType) => {
        return state.pieces.find((p) => p.type === type);
      };
    },
    active(state): typeof state.pieces[number] | undefined {
      return state.activeType ? this.get(state.activeType) : undefined;
    },
  },
  actions: {
    addBlock(block: LogicBlock, parent?: PieceType) {
      const p = parent ? this.get(parent) : this.active;
      console.log(p);
      if (!p) return;
      p.blocks.push(block);
    },
    reset() {
      const p = [] as typeof this.pieces;
      Object.values(PieceType).forEach((v) => {
        p.push({
          type: v,
          blocks: [],
        });
      });
      this.pieces = p;
    },
  },
});
