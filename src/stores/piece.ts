import { PieceType } from "@/types/pieceType";
import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

// Pawn images
import WhitePawnImage from "@/assets/pieces/w_pawn.svg?url";
import BlackPawnImage from "@/assets/pieces/b_pawn.svg?url";

// King images
import WhiteKingImage from "@/assets/pieces/w_king.svg?url";
import BlackKingImage from "@/assets/pieces/b_king.svg?url";

// Queen images
import WhiteQueenImage from "@/assets/pieces/w_queen.svg?url";
import BlackQueenImage from "@/assets/pieces/b_queen.svg?url";

// Rook images
import WhiteRookImage from "@/assets/pieces/w_rook.svg?url";
import BlackRookImage from "@/assets/pieces/b_rook.svg?url";

// Bishop images
import WhiteBishopImage from "@/assets/pieces/w_bishop.svg?url";
import BlackBishopImage from "@/assets/pieces/b_bishop.svg?url";

// Knight images
import WhiteKnightImage from "@/assets/pieces/w_knight.svg?url";
import BlackKnightImage from "@/assets/pieces/b_knight.svg?url";

export const usePieceStore = defineStore({
  id: "piece",
  state: () => ({
    pieces: [] as {
      uuid: string;
      name: string;
      type: PieceType;
      img: string;
      size: number;
      position: { x: number; y: number };
      black: boolean;
    }[],
  }),
  getters: {
    get(state) {
      return (uuid: string) => {
        return state.pieces.find((p) => p.uuid === uuid);
      };
    },
  },
  actions: {
    reset() {
      // 8 pawns
      for (let i = 1; i < 9; i++) {
        this.pieces.push({
          uuid: uuidv4(),
          name: PieceType.PAWN as string,
          type: PieceType.PAWN,
          img: WhitePawnImage,
          size: 0.8,
          position: { x: i, y: 2 },
          black: false,
        });
        this.pieces.push({
          uuid: uuidv4(),
          name: PieceType.PAWN as string,
          type: PieceType.PAWN,
          img: BlackPawnImage,
          size: 0.8,
          position: { x: i, y: 7 },
          black: true,
        });
      }

      // 1 King
      this.pieces.push({
        uuid: uuidv4(),
        name: PieceType.KING as string,
        type: PieceType.KING,
        img: WhiteKingImage,
        size: 0.8,
        position: { x: 5, y: 1 },
        black: false,
      });
      this.pieces.push({
        uuid: uuidv4(),
        name: PieceType.KING as string,
        type: PieceType.KING,
        img: BlackKingImage,
        size: 0.8,
        position: { x: 4, y: 8 },
        black: true,
      });

      // 1 Queen
      this.pieces.push({
        uuid: uuidv4(),
        name: PieceType.QUEEN as string,
        type: PieceType.QUEEN,
        img: WhiteQueenImage,
        size: 0.8,
        position: { x: 4, y: 1 },
        black: false,
      });
      this.pieces.push({
        uuid: uuidv4(),
        name: PieceType.QUEEN as string,
        type: PieceType.QUEEN,
        img: BlackQueenImage,
        size: 0.8,
        position: { x: 5, y: 8 },
        black: true,
      });

      // 2 Rooks
      for (let i = 0; i < 9; i += 7) {
        this.pieces.push({
          uuid: uuidv4(),
          name: PieceType.ROOK as string,
          type: PieceType.ROOK,
          img: WhiteRookImage,
          size: 0.8,
          position: { x: 1 + i, y: 1 },
          black: false,
        });
        this.pieces.push({
          uuid: uuidv4(),
          name: PieceType.ROOK as string,
          type: PieceType.ROOK,
          img: BlackRookImage,
          size: 0.8,
          position: { x: 1 + i, y: 8 },
          black: true,
        });
      }

      // 2 Bishops
      for (let i = 3; i < 9; i += 3) {
        this.pieces.push({
          uuid: uuidv4(),
          name: PieceType.BISHOP as string,
          type: PieceType.BISHOP,
          img: WhiteBishopImage,
          size: 0.8,
          position: { x: i, y: 1 },
          black: false,
        });
        this.pieces.push({
          uuid: uuidv4(),
          name: PieceType.BISHOP as string,
          type: PieceType.BISHOP,
          img: BlackBishopImage,
          size: 0.8,
          position: { x: i, y: 8 },
          black: true,
        });
      }

      // 2 Knights
      for (let i = 2; i < 9; i += 5) {
        this.pieces.push({
          uuid: uuidv4(),
          name: PieceType.KNIGHT as string,
          type: PieceType.KNIGHT,
          img: WhiteKnightImage,
          size: 0.8,
          position: { x: i, y: 1 },
          black: false,
        });
        this.pieces.push({
          uuid: uuidv4(),
          name: PieceType.ROOK as string,
          type: PieceType.ROOK,
          img: BlackKnightImage,
          size: 0.8,
          position: { x: i, y: 8 },
          black: true,
        });
      }
    },
  },
});
