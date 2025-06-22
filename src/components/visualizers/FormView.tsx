"use client";

import { useState, useEffect } from "react";
import { JsonValue, JsonObject, JsonArray } from "@/types";
import {
  FiType,
  FiHash,
  FiToggleLeft,
  FiMinus,
  FiList,
  FiFolder,
} from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormViewProps {
  data: JsonValue;
  onDataUpdate?: (data: JsonValue) => void;
}

interface FormFieldProps {
  label: string;
  value: JsonValue;
  path: string;
  onUpdate: (path: string, value: JsonValue) => void;
  onLabelUpdate: (path: string, newLabel: string) => void;
  onTypeUpdate: (path: string, newType: string) => void;
  fullData: JsonValue;
}

// Helper function to set value at path
function setValueAtPath(
  obj: JsonValue,
  path: string,
  value: JsonValue
): JsonValue {
  if (path === "root") return value;

  const clone = JSON.parse(JSON.stringify(obj));
  const parts = path
    .replace(/^root\./, "")
    .split(/\.|\[|\]/)
    .filter(Boolean);
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
}

function FormField({
  label,
  value,
  path,
  onUpdate,
  onLabelUpdate,
  onTypeUpdate,
  fullData,
}: FormFieldProps) {
  const getType = (value: JsonValue): string => {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
  };

  const type = getType(value);

  const getTypeIcon = (type: string, value: JsonValue) => {
    switch (type) {
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
      case "object":
        return <FiFolder className="text-blue-600 dark:text-blue-400" />;
      case "array":
        return <FiList className="text-purple-600 dark:text-purple-400" />;
      default:
        return <FiMinus className="text-gray-600 dark:text-gray-400" />;
    }
  };

  const handleInputChange = (newValue: string) => {
    let convertedValue: JsonValue;

    switch (type) {
      case "number":
        const numValue = parseFloat(newValue);
        convertedValue = isNaN(numValue) ? 0 : numValue;
        break;
      case "boolean":
        convertedValue = newValue === "true";
        break;
      case "null":
        convertedValue = null;
        break;
      default:
        convertedValue = newValue;
    }

    onUpdate(path, convertedValue);
  };

  const handleTypeChange = (newType: string) => {
    let convertedValue: JsonValue;

    switch (newType) {
      case "number":
        convertedValue = Number(value) || 0;
        break;
      case "boolean":
        convertedValue = Boolean(value);
        break;
      case "string":
        convertedValue = String(value);
        break;
      case "null":
        convertedValue = null;
        break;
      default:
        convertedValue = value;
    }

    onTypeUpdate(path, newType);
    onUpdate(path, convertedValue);
  };
  if (type === "object" && value !== null) {
    const obj = value as JsonObject;
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-800/5 border-2 border-blue-200 dark:border-blue-700/50 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-4 mb-5">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <FiFolder className="text-blue-600 dark:text-blue-400 text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {label}
            </h3>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                Object
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                {Object.keys(obj).length}{" "}
                {Object.keys(obj).length === 1 ? "property" : "properties"}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {Object.entries(obj).map(([key, val]) => (
            <FormField
              key={key}
              label={key}
              value={val}
              path={`${path}.${key}`}
              onUpdate={onUpdate}
              onLabelUpdate={onLabelUpdate}
              onTypeUpdate={onTypeUpdate}
              fullData={fullData}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === "array") {
    const arr = value as JsonArray;
    return (
      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/10 dark:to-purple-800/5 border-2 border-purple-200 dark:border-purple-700/50 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-4 mb-5">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <FiList className="text-purple-600 dark:text-purple-400 text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {label}
            </h3>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-500 text-white text-sm font-medium rounded-full">
                Array
              </span>
              <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                {arr.length} {arr.length === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {arr.map((item, index) => (
            <FormField
              key={index}
              label={`[${index}]`}
              value={item}
              path={`${path}[${index}]`}
              onUpdate={onUpdate}
              onLabelUpdate={onLabelUpdate}
              onTypeUpdate={onTypeUpdate}
              fullData={fullData}
            />
          ))}
        </div>
      </div>
    );
  }
  // Primitive field with reimagined modern styling
  return (
    <div className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600">
      {/* Field Name and Type Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`p-2 rounded-lg ${
              type === "string"
                ? "bg-green-50 dark:bg-green-900/20"
                : type === "number"
                ? "bg-blue-50 dark:bg-blue-900/20"
                : type === "boolean"
                ? "bg-yellow-50 dark:bg-yellow-900/20"
                : "bg-gray-50 dark:bg-gray-700"
            }`}
          >
            {getTypeIcon(type, value)}
          </div>
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={label}
              onChange={(e) => onLabelUpdate(path, e.target.value)}
              className="text-lg font-semibold text-gray-900 dark:text-gray-100 bg-transparent border-0 border-b-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 outline-none w-full transition-colors"
              disabled
              placeholder="Field name"
            />
          </div>
        </div>{" "}
        {/* Type Selector */}
        <div className="flex items-center gap-2">
          <Select value={type} onValueChange={handleTypeChange}>
            <SelectTrigger
              className={`px-3 py-1.5 text-sm font-medium border-0 cursor-pointer transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                type === "string"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                  : type === "number"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                  : type === "boolean"
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="null">Null</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Value Input Row */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block">
          Value
        </label>
        <div className="relative">
          {type === "boolean" ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleInputChange("true")}
                className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                  value === true
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                }`}
              >
                ✓ True
              </button>
              <button
                type="button"
                onClick={() => handleInputChange("false")}
                className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                  value === false
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                }`}
              >
                ✗ False
              </button>
            </div>
          ) : type === "null" ? (
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-lg">
              <span className="text-gray-500 dark:text-gray-400 font-mono text-sm">
                null
              </span>
            </div>
          ) : (
            <>
              {type === "string" ? (
                <textarea
                  value={String(value)}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full min-h-[44px] px-4 py-3 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all font-mono text-sm resize-y"
                  placeholder="Enter text value..."
                  rows={Math.max(1, String(value).split("\n").length)}
                  style={{
                    minHeight: "44px",
                    height: "auto",
                  }}
                />
              ) : (
                <input
                  type={type === "number" ? "number" : "text"}
                  value={String(value)}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all font-mono text-sm"
                  placeholder={
                    type === "number"
                      ? "Enter numeric value..."
                      : "Enter value..."
                  }
                />
              )}
            </>
          )}
        </div>

        {/* Value Preview/Info */}
        {type !== "null" && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 font-mono">
            {type === "string" && `Length: ${String(value).length} characters`}
            {type === "number" && (
              <>
                {isNaN(Number(value))
                  ? "Invalid number"
                  : `Value: ${Number(value)}`}
              </>
            )}
            {type === "boolean" && `Boolean: ${value}`}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FormView({ data, onDataUpdate }: FormViewProps) {
  const [formData, setFormData] = useState<JsonValue>(data);
  const [isInternalUpdate, setIsInternalUpdate] = useState(false);

  // Only update formData when external data changes (not from internal updates)
  useEffect(() => {
    if (!isInternalUpdate) {
      setFormData(data);
    } else {
      // Reset the flag after a short delay
      const timeout = setTimeout(() => {
        setIsInternalUpdate(false);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [data, isInternalUpdate]);

  const handleFieldUpdate = (path: string, value: JsonValue) => {
    setIsInternalUpdate(true);
    const updatedData = setValueAtPath(formData, path, value);
    setFormData(updatedData);
    onDataUpdate?.(updatedData);
  };

  const handleLabelUpdate = (path: string, newLabel: string) => {
    // For now, we don't support changing property names in this implementation
    // This would require more complex object manipulation
    console.log("Label update requested:", path, newLabel);
  };

  const handleTypeUpdate = (path: string, newType: string) => {
    // This is handled within the field's type change logic
    console.log("Type update requested:", path, newType);
  };
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-sm">
      <FormField
        label="root"
        value={formData}
        path="root"
        onUpdate={handleFieldUpdate}
        onLabelUpdate={handleLabelUpdate}
        onTypeUpdate={handleTypeUpdate}
        fullData={formData}
      />
    </div>
  );
}
