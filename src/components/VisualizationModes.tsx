import { VisualizationMode } from "@/types";
import { FiGrid, FiLayers, FiTable, FiEdit3 } from "react-icons/fi";

interface VisualizationModesProps {
  mode: VisualizationMode;
  onModeChange: (mode: VisualizationMode) => void;
}

const modes = [
  { id: "tree" as const, label: "Tree View", Icon: FiLayers },
  { id: "cards" as const, label: "Card View", Icon: FiGrid },
  { id: "table" as const, label: "Table View", Icon: FiTable },
  { id: "form" as const, label: "Form View", Icon: FiEdit3 },
];

export default function VisualizationModes({
  mode,
  onModeChange,
}: VisualizationModesProps) {
  return (
    <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded p-1">
      {modes.map((modeOption) => (
        <button
          key={modeOption.id}
          onClick={() => onModeChange(modeOption.id)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-all cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
            ${
              mode === modeOption.id
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
            }
          `}
          title={modeOption.label}
          aria-label={modeOption.label}
          aria-pressed={mode === modeOption.id}
        >
          <modeOption.Icon size={14} />
          <span className="hidden sm:inline">{modeOption.label}</span>
        </button>
      ))}
    </div>
  );
}
