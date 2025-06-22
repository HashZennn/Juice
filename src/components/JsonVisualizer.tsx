"use client";

import { JsonValue, VisualizationMode } from "@/types";
import TreeView from "./visualizers/TreeView";
import CardView from "./visualizers/CardView";
import TableView from "./visualizers/TableView";
import FormView from "./visualizers/FormView";

interface JsonVisualizerProps {
  data: JsonValue;
  mode: VisualizationMode;
  onDataUpdate?: (data: JsonValue) => void;
}

export default function JsonVisualizer({
  data,
  mode,
  onDataUpdate,
}: JsonVisualizerProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data to visualize
      </div>
    );
  }
  return (
    <div
      className="h-full overflow-auto p-4"
      style={{ scrollbarGutter: "stable" }}
    >
      {mode === "tree" && <TreeView data={data} />}
      {mode === "cards" && <CardView data={data} />}
      {mode === "table" && (
        <TableView data={data} onDataUpdate={onDataUpdate} />
      )}
      {mode === "form" && <FormView data={data} onDataUpdate={onDataUpdate} />}
    </div>
  );
}
