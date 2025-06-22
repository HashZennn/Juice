"use client";

import { JsonValue, JsonObject, JsonArray } from "@/types";
import {
  FiFolder,
  FiList,
  FiType,
  FiHash,
  FiToggleLeft,
  FiMinus,
  FiMapPin,
} from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableViewProps {
  data: JsonValue;
  onDataUpdate?: (data: JsonValue) => void;
}

function flattenObject(
  obj: JsonValue,
  prefix = "",
  result: Record<string, JsonValue> = {}
): Record<string, JsonValue> {
  if (obj === null || typeof obj !== "object") {
    result[prefix || "value"] = obj;
    return result;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      flattenObject(item, `${prefix}[${index}]`, result);
    });
  } else {
    Object.entries(obj as JsonObject).forEach(([key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (value === null || typeof value !== "object") {
        result[newKey] = value;
      } else {
        flattenObject(value, newKey, result);
      }
    });
  }

  return result;
}

function getValueType(value: JsonValue): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function getTypeIcon(value: JsonValue) {
  const type = getValueType(value);
  switch (type) {
    case "object":
      return <FiFolder className="text-blue-600 dark:text-blue-400" />;
    case "array":
      return <FiList className="text-purple-600 dark:text-purple-400" />;
    case "string":
      return <FiType className="text-green-600 dark:text-green-400" />;
    case "number":
      return <FiHash className="text-blue-600 dark:text-blue-400" />;
    case "boolean":
      return (
        <FiToggleLeft
          className={
            value
              ? "text-green-600 dark:text-green-400"
              : "text-gray-600 dark:text-gray-400"
          }
        />
      );
    case "null":
      return <FiMinus className="text-gray-600 dark:text-gray-400" />;
    default:
      return <FiMinus className="text-gray-600 dark:text-gray-400" />;
  }
}

function formatValue(value: JsonValue): string {
  const type = getValueType(value);
  if (type === "string") return `"${value}"`;
  if (type === "object" && value !== null) {
    const obj = value as JsonObject;
    return `{...${Object.keys(obj).length} props}`;
  }
  if (type === "array") {
    const arr = value as JsonArray;
    return `[...${arr.length} items]`;
  }
  return String(value);
}

export default function TableView({ data, onDataUpdate }: TableViewProps) {
  const flattened = flattenObject(data);
  const entries = Object.entries(flattened);

  const handleCellEdit = (
    path: string,
    newValue: string,
    currentType: string
  ) => {
    if (!onDataUpdate) return;

    let convertedValue: JsonValue;
    try {
      if (currentType === "number") {
        convertedValue = parseFloat(newValue);
        if (isNaN(convertedValue)) convertedValue = 0;
      } else if (currentType === "boolean") {
        convertedValue = newValue.toLowerCase() === "true";
      } else if (currentType === "null") {
        convertedValue = null;
      } else {
        convertedValue = newValue;
      }

      // Update the data using the path
      const updatedData = setValueAtPath(data, path, convertedValue);
      onDataUpdate(updatedData);
    } catch (error) {
      console.error("Error updating value:", error);
    }
  };

  const setValueAtPath = (
    obj: JsonValue,
    path: string,
    value: JsonValue
  ): JsonValue => {
    const clone = JSON.parse(JSON.stringify(obj));
    const parts = path.split(/\.|\[|\]/).filter(Boolean);
    let current = clone;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (Array.isArray(current)) {
        const index = parseInt(part);
        current = current[index];
      } else {
        current = current[part];
      }
    }

    const lastPart = parts[parts.length - 1];
    if (Array.isArray(current)) {
      const index = parseInt(lastPart);
      current[index] = value;
    } else {
      current[lastPart] = value;
    }

    return clone;
  };

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data to display in table view
      </div>
    );
  }
  return (
    <div className="overflow-auto rounded border border-gray-200 dark:border-gray-700">
      <table className="w-full border-collapse bg-white dark:bg-gray-900">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <th className="px-4 py-3 text-left font-medium text-sm text-gray-600 dark:text-gray-300">
              Path
            </th>
            <th className="px-4 py-3 text-left font-medium text-sm text-gray-600 dark:text-gray-300">
              Type
            </th>
            <th className="px-4 py-3 text-left font-medium text-sm text-gray-600 dark:text-gray-300">
              Value
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {entries.map(([path, value]) => {
            const type = getValueType(value);

            return (
              <tr
                key={path}
                className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-gray-400" size={14} />
                    {path}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {" "}
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getTypeIcon(value)}</span>
                    {onDataUpdate ? (
                      <Select
                        value={type}
                        onValueChange={(newType) => {
                          let convertedValue: JsonValue = value;

                          if (newType === "string")
                            convertedValue = String(value);
                          else if (newType === "number")
                            convertedValue = Number(value) || 0;
                          else if (newType === "boolean")
                            convertedValue = Boolean(value);
                          else if (newType === "null") convertedValue = null;

                          handleCellEdit(path, String(convertedValue), newType);
                        }}
                      >
                        <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 px-2 py-1 rounded text-xs font-medium focus:ring-2 focus:ring-blue-500 w-fit">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="null">Null</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          type === "string"
                            ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                            : type === "number"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                            : type === "boolean"
                            ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                            : type === "null"
                            ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            : type === "object"
                            ? "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
                            : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                        }`}
                      >
                        {type}
                      </span>
                    )}
                  </div>
                </td>{" "}
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {onDataUpdate && type !== "object" && type !== "array" ? (
                    type === "boolean" ? (
                      <Select
                        value={String(value)}
                        onValueChange={(newValue) =>
                          handleCellEdit(path, newValue, type)
                        }
                      >
                        <SelectTrigger className="w-full font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">true</SelectItem>
                          <SelectItem value="false">false</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : type === "null" ? (
                      <input
                        type="text"
                        value="null"
                        disabled
                        className="w-full font-mono text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-gray-500"
                      />
                    ) : (
                      <input
                        type={type === "number" ? "number" : "text"}
                        value={String(value)}
                        onChange={(e) =>
                          handleCellEdit(path, e.target.value, type)
                        }
                        className="w-full font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    )
                  ) : (
                    <div
                      className="font-mono text-sm px-3 py-2 max-w-md truncate"
                      title={formatValue(value)}
                    >
                      {formatValue(value)}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 text-center border-t border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          📊 {entries.length} properties
        </span>
      </div>
    </div>
  );
}
