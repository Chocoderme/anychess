import { PieceType } from "@/types/pieceType";
import { defineStore } from "pinia";
import { v4 as uuid } from "uuid";

export enum LogicBlockDataType {
  ACTION,
  NUMBER,
  STRING,
  VECTOR_2D,
  BOOLEAN,
  PIECE_TYPE,
  PIECE_COLOR,
  VECTOR_2D_ARRAY,
}

export enum LogicBlockType {
  START = "START",
  END = "END",
  GET_PIECE_POSITION = "GET_PIECE_POSITION",
  GET_PIECE_TYPE_AT = "GET_PIECE_TYPE_AT",
  TO_VECTOR_2D = "TO_VECTOR_2D",
  FROM_VECTOR_2D = "FROM_VECTOR_2D",
  COMPARE_PIECE_TYPE = "COMPARE_PIECE_TYPE",
  ADD = "ADD",
  MULTIPLY = "MULTIPLY",
  RELATIVE_DIRECTION = "RELATIVE_DIRECTION",
}

export type LogicBlockIO = {
  uuid: string;
  type: "input" | "output";
  dataType: LogicBlockDataType;
  parent?: LogicBlock;
  links: LogicBlockIO[]; // Always an input
  customData?: { [key: string]: any };
};

export type LogicBlock = {
  type: LogicBlockType;
  position: { x: number; y: number };
  uuid: string;
  inputs: LogicBlockIO[];
  outputs: LogicBlockIO[];
};

function makeLogicBlockIO(
  parent: LogicBlock,
  type: LogicBlockIO["type"],
  dataType: LogicBlockDataType,
  customData?: { [key: string]: any }
): LogicBlockIO {
  return {
    uuid: uuid(),
    parent,
    type,
    dataType,
    customData: customData ?? {},
    links: [],
  };
}

function getLinks(block: LogicBlock): Pick<LogicBlock, "inputs" | "outputs"> {
  const type = block.type;
  switch (type) {
    case LogicBlockType.START:
      return {
        inputs: [],
        outputs: [
          makeLogicBlockIO(block, "output", LogicBlockDataType.VECTOR_2D),
          makeLogicBlockIO(block, "output", LogicBlockDataType.PIECE_COLOR),
        ],
      };
    case LogicBlockType.END:
      return {
        inputs: [
          makeLogicBlockIO(block, "input", LogicBlockDataType.VECTOR_2D_ARRAY),
        ],
        outputs: [],
      };
    case LogicBlockType.GET_PIECE_TYPE_AT:
      return {
        inputs: [
          makeLogicBlockIO(block, "input", LogicBlockDataType.VECTOR_2D),
        ],
        outputs: [
          makeLogicBlockIO(block, "output", LogicBlockDataType.PIECE_TYPE),
        ],
      };
    case LogicBlockType.COMPARE_PIECE_TYPE:
      return {
        inputs: [
          makeLogicBlockIO(block, "input", LogicBlockDataType.PIECE_TYPE),
          makeLogicBlockIO(block, "input", LogicBlockDataType.PIECE_TYPE),
        ],
        outputs: [
          makeLogicBlockIO(block, "output", LogicBlockDataType.ACTION),
          makeLogicBlockIO(block, "output", LogicBlockDataType.ACTION),
        ],
      };
    case LogicBlockType.GET_PIECE_POSITION:
      return {
        inputs: [],
        outputs: [
          makeLogicBlockIO(block, "output", LogicBlockDataType.VECTOR_2D),
        ],
      };
    case LogicBlockType.FROM_VECTOR_2D:
      return {
        inputs: [
          makeLogicBlockIO(block, "input", LogicBlockDataType.VECTOR_2D),
        ],
        outputs: [
          makeLogicBlockIO(block, "output", LogicBlockDataType.NUMBER),
          makeLogicBlockIO(block, "output", LogicBlockDataType.NUMBER),
        ],
      };
    case LogicBlockType.TO_VECTOR_2D:
      return {
        inputs: [
          makeLogicBlockIO(block, "input", LogicBlockDataType.NUMBER),
          makeLogicBlockIO(block, "input", LogicBlockDataType.NUMBER),
        ],
        outputs: [
          makeLogicBlockIO(block, "output", LogicBlockDataType.VECTOR_2D),
        ],
      };
    case LogicBlockType.RELATIVE_DIRECTION:
      return {
        inputs: [
          makeLogicBlockIO(block, "input", LogicBlockDataType.PIECE_COLOR),
        ],
        outputs: [makeLogicBlockIO(block, "output", LogicBlockDataType.NUMBER)],
      };
    case LogicBlockType.ADD:
    case LogicBlockType.MULTIPLY:
      return {
        inputs: [
          makeLogicBlockIO(block, "input", LogicBlockDataType.NUMBER),
          makeLogicBlockIO(block, "input", LogicBlockDataType.NUMBER),
        ],
        outputs: [makeLogicBlockIO(block, "output", LogicBlockDataType.NUMBER)],
      };
  }
  return { inputs: [], outputs: [] };
}

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
    getBlockFromUuid(state): (uuid: string) => LogicBlock | undefined {
      return (uuid: string) => {
        if (!state.activeType) return undefined;
        return this.get(state.activeType)?.blocks.find((b) => b.uuid === uuid);
      };
    },
  },
  actions: {
    addBlock(
      block: Omit<LogicBlock, "uuid" | "inputs" | "outputs">,
      parent?: PieceType
    ) {
      const p = parent ? this.get(parent) : this.active;
      const newBlock: LogicBlock = {
        ...block,
        uuid: uuid(),
        inputs: [],
        outputs: [],
      };
      const links = getLinks(newBlock);
      newBlock.inputs = links.inputs;
      newBlock.outputs = links.outputs;
      console.log(p, newBlock);
      if (!p) return;
      p.blocks.push(newBlock);
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
      nextTick(() => {
        this.pieces.forEach((p) => {
          this.addBlock(
            { type: LogicBlockType.START, position: { x: 10, y: 10 } },
            p.type
          );
          this.addBlock(
            { type: LogicBlockType.END, position: { x: 300, y: 10 } },
            p.type
          );
        });
      });
    },
  },
});
