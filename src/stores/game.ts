import { defineStore } from "pinia";

export const useGameStore = defineStore({
  id: "game",
  state: () => ({
    selectionUuid: undefined as undefined | string,
    isBlackTurn: false,
  }),
  getters: {
    get(state) {},
  },
  actions: {
    reset() {},
  },
});
