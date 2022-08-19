import type Konva from "konva";

export type VueKonvaConfig = {
  [key in keyof Konva.StageConfig]+?: Konva.StageConfig[key];
};
