export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export type VisualizationMode = "tree" | "cards" | "table" | "form";

export interface JsonNode {
  key: string;
  value: JsonValue;
  type: "string" | "number" | "boolean" | "null" | "object" | "array";
  path: string;
  depth: number;
}
