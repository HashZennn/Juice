"use client";

import { JsonValue, JsonObject, JsonArray } from "@/types";

interface CardViewProps {
  data: JsonValue;
}

function renderCard(
  key: string,
  value: JsonValue,
  path: string
): React.ReactElement {
  const type =
    value === null ? "null" : Array.isArray(value) ? "array" : typeof value;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "object":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg";
      case "array":
        return "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg";
      case "string":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg";
      case "number":
        return "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg";
      case "boolean":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg";
      case "null":
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg";
    }
  };

  const getCardBorder = (type: string) => {
    switch (type) {
      case "object":
        return "border-l-4 border-blue-500 shadow-blue-100 dark:shadow-blue-900/50";
      case "array":
        return "border-l-4 border-purple-500 shadow-purple-100 dark:shadow-purple-900/50";
      case "string":
        return "border-l-4 border-green-500 shadow-green-100 dark:shadow-green-900/50";
      case "number":
        return "border-l-4 border-orange-500 shadow-orange-100 dark:shadow-orange-900/50";
      case "boolean":
        return "border-l-4 border-yellow-500 shadow-yellow-100 dark:shadow-yellow-900/50";
      case "null":
        return "border-l-4 border-gray-500 shadow-gray-100 dark:shadow-gray-900/50";
      default:
        return "border-l-4 border-gray-500 shadow-gray-100 dark:shadow-gray-900/50";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "object":
        return "📦";
      case "array":
        return "📋";
      case "string":
        return "📝";
      case "number":
        return "🔢";
      case "boolean":
        return value ? "✅" : "❌";
      case "null":
        return "⭕";
      default:
        return "❓";
    }
  };

  if (type === "object" && value !== null) {
    const obj = value as JsonObject;
    const entries = Object.entries(obj);

    return (
      <div
        key={path}
        className={`bg-white dark:bg-gray-800 rounded-xl ${getCardBorder(
          type
        )} p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {getTypeIcon(type)}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              {key}
            </h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                type
              )}`}
            >
              Object • {entries.length} properties
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {entries.map(([propKey, propValue]) => {
            const propType =
              propValue === null
                ? "null"
                : Array.isArray(propValue)
                ? "array"
                : typeof propValue;
            return (
              <div
                key={propKey}
                className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="text-lg p-1 bg-white dark:bg-gray-800 rounded">
                    {getTypeIcon(propType)}
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {propKey}
                  </span>
                </div>
                <span className="text-sm font-mono text-gray-600 dark:text-gray-400 max-w-xs truncate">
                  {propType === "object" && propValue !== null
                    ? `{...${
                        Object.keys(propValue as JsonObject).length
                      } props}`
                    : propType === "array"
                    ? `[...${(propValue as JsonArray).length} items]`
                    : propType === "string"
                    ? `"${propValue}"`
                    : String(propValue)}
                </span>
              </div>
            );
          })}
        </div>

        {entries.some(
          ([, propValue]) =>
            (propValue !== null && typeof propValue === "object") ||
            Array.isArray(propValue)
        ) && (
          <div className="mt-6 space-y-4">
            {entries.map(([propKey, propValue]) => {
              if (
                (propValue !== null && typeof propValue === "object") ||
                Array.isArray(propValue)
              ) {
                return renderCard(propKey, propValue, `${path}.${propKey}`);
              }
              return null;
            })}
          </div>
        )}
      </div>
    );
  }

  if (type === "array") {
    const arr = value as JsonArray;

    return (
      <div
        key={path}
        className={`bg-white dark:bg-gray-800 rounded-xl ${getCardBorder(
          type
        )} p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {getTypeIcon(type)}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              {key}
            </h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                type
              )}`}
            >
              Array • {arr.length} items
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {arr.map((item, index) => {
            const itemType =
              item === null
                ? "null"
                : Array.isArray(item)
                ? "array"
                : typeof item;
            return (
              <div
                key={index}
                className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="text-lg p-1 bg-white dark:bg-gray-800 rounded">
                    {getTypeIcon(itemType)}
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    [{index}]
                  </span>
                </div>
                <span className="text-sm font-mono text-gray-600 dark:text-gray-400 max-w-xs truncate">
                  {itemType === "object" && item !== null
                    ? `{...${Object.keys(item as JsonObject).length} props}`
                    : itemType === "array"
                    ? `[...${(item as JsonArray).length} items]`
                    : itemType === "string"
                    ? `"${item}"`
                    : String(item)}
                </span>
              </div>
            );
          })}
        </div>

        {arr.some(
          (item) =>
            (item !== null && typeof item === "object") || Array.isArray(item)
        ) && (
          <div className="mt-6 space-y-4">
            {arr.map((item, index) => {
              if (
                (item !== null && typeof item === "object") ||
                Array.isArray(item)
              ) {
                return renderCard(`[${index}]`, item, `${path}[${index}]`);
              }
              return null;
            })}
          </div>
        )}
      </div>
    );
  }

  // Primitive value card
  return (
    <div
      key={path}
      className={`bg-white dark:bg-gray-800 rounded-xl ${getCardBorder(
        type
      )} p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="text-2xl p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
          {getTypeIcon(type)}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
            {key}
          </h3>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
              type
            )}`}
          >
            {type}
          </span>
        </div>
      </div>
      <div className="text-xl font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
        {type === "string" ? `"${value}"` : String(value)}
      </div>
    </div>
  );
}

export default function CardView({ data }: CardViewProps) {
  return <div className="space-y-6">{renderCard("root", data, "root")}</div>;
}
