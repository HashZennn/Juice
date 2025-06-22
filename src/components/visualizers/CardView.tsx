"use client";

import { JsonValue, JsonObject, JsonArray } from "@/types";
import {
  FiFolder,
  FiList,
  FiType,
  FiHash,
  FiToggleLeft,
  FiMinus,
  FiChevronRight,
} from "react-icons/fi";

interface CardViewProps {
  data: JsonValue;
}

function renderCard(
  key: string,
  value: JsonValue,
  path: string,
  depth: number = 0
): React.ReactElement {
  const type =
    value === null ? "null" : Array.isArray(value) ? "array" : typeof value;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "object":
        return <FiFolder className="w-4 h-4" />;
      case "array":
        return <FiList className="w-4 h-4" />;
      case "string":
        return <FiType className="w-4 h-4" />;
      case "number":
        return <FiHash className="w-4 h-4" />;
      case "boolean":
        return <FiToggleLeft className="w-4 h-4" />;
      case "null":
        return <FiMinus className="w-4 h-4" />;
      default:
        return <FiMinus className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "object":
        return "text-blue-600 dark:text-blue-400";
      case "array":
        return "text-purple-600 dark:text-purple-400";
      case "string":
        return "text-green-600 dark:text-green-400";
      case "number":
        return "text-orange-600 dark:text-orange-400";
      case "boolean":
        return "text-yellow-600 dark:text-yellow-400";
      case "null":
        return "text-gray-600 dark:text-gray-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "object":
        return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "array":
        return "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      case "string":
        return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "number":
        return "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
      case "boolean":
        return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "null":
        return "bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
      default:
        return "bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  if (type === "object" && value !== null) {
    const obj = value as JsonObject;
    const entries = Object.entries(obj);

    return (
      <div
        key={path}
        className={`group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 ${
          depth > 0 ? "ml-4" : ""
        }`}
      >
        {" "}
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`${getTypeColor(
                  type
                )} p-1.5 bg-gray-50 dark:bg-gray-700 rounded`}
              >
                {getTypeIcon(type)}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {key}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {entries.length}{" "}
                  {entries.length === 1 ? "property" : "properties"}
                </p>
              </div>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${getBadgeColor(
                type
              )}`}
            >
              object
            </span>
          </div>
        </div>
        {/* Content */}
        <div className="p-4">
          <div className="space-y-3">
            {entries.map(([propKey, propValue]) => {
              const propType =
                propValue === null
                  ? "null"
                  : Array.isArray(propValue)
                  ? "array"
                  : typeof propValue;

              const isComplexType =
                propType === "object" || propType === "array";

              return (
                <div
                  key={propKey}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group/item hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {" "}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`${getTypeColor(propType)} flex-shrink-0`}>
                      {getTypeIcon(propType)}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {propKey}
                    </span>
                    {isComplexType && (
                      <FiChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${getBadgeColor(
                        propType
                      )}`}
                    >
                      {propType}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-mono max-w-32 truncate">
                      {propType === "object" && propValue !== null
                        ? `{${Object.keys(propValue as JsonObject).length}}`
                        : propType === "array"
                        ? `[${(propValue as JsonArray).length}]`
                        : propType === "string"
                        ? `"${String(propValue).slice(0, 20)}${
                            String(propValue).length > 20 ? "..." : ""
                          }"`
                        : String(propValue)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Nested Objects */}
        {entries.some(
          ([, propValue]) =>
            (propValue !== null && typeof propValue === "object") ||
            Array.isArray(propValue)
        ) && (
          <div className="border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50/30 dark:bg-gray-800/30">
            <div className="space-y-4">
              {entries.map(([propKey, propValue]) => {
                if (
                  (propValue !== null && typeof propValue === "object") ||
                  Array.isArray(propValue)
                ) {
                  return renderCard(
                    propKey,
                    propValue,
                    `${path}.${propKey}`,
                    depth + 1
                  );
                }
                return null;
              })}
            </div>
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
        className={`group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 ${
          depth > 0 ? "ml-4" : ""
        }`}
      >
        {/* Header */}{" "}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`${getTypeColor(
                  type
                )} p-1.5 bg-gray-50 dark:bg-gray-700 rounded`}
              >
                {getTypeIcon(type)}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {key}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {arr.length} {arr.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${getBadgeColor(
                type
              )}`}
            >
              array
            </span>
          </div>
        </div>
        {/* Content */}
        <div className="p-4">
          <div className="space-y-3">
            {arr.map((item, index) => {
              const itemType =
                item === null
                  ? "null"
                  : Array.isArray(item)
                  ? "array"
                  : typeof item;

              const isComplexType =
                itemType === "object" || itemType === "array";

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group/item hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {" "}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`${getTypeColor(itemType)} flex-shrink-0`}>
                      {getTypeIcon(itemType)}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      [{index}]
                    </span>
                    {isComplexType && (
                      <FiChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${getBadgeColor(
                        itemType
                      )}`}
                    >
                      {itemType}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-mono max-w-32 truncate">
                      {itemType === "object" && item !== null
                        ? `{${Object.keys(item as JsonObject).length}}`
                        : itemType === "array"
                        ? `[${(item as JsonArray).length}]`
                        : itemType === "string"
                        ? `"${String(item).slice(0, 20)}${
                            String(item).length > 20 ? "..." : ""
                          }"`
                        : String(item)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Nested Objects */}
        {arr.some(
          (item) =>
            (item !== null && typeof item === "object") || Array.isArray(item)
        ) && (
          <div className="border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50/30 dark:bg-gray-800/30">
            <div className="space-y-4">
              {arr.map((item, index) => {
                if (
                  (item !== null && typeof item === "object") ||
                  Array.isArray(item)
                ) {
                  return renderCard(
                    `[${index}]`,
                    item,
                    `${path}[${index}]`,
                    depth + 1
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Primitive value card
  return (
    <div
      key={path}
      className={`group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 ${
        depth > 0 ? "ml-4" : ""
      }`}
    >
      <div className="p-4">
        {" "}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`${getTypeColor(
                type
              )} p-1.5 bg-gray-50 dark:bg-gray-700 rounded`}
            >
              {getTypeIcon(type)}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {key}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {type} value
              </p>
            </div>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${getBadgeColor(
              type
            )}`}
          >
            {type}
          </span>
        </div>
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <code className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
            {type === "string" ? `"${value}"` : String(value)}
          </code>
        </div>
      </div>
    </div>
  );
}

export default function CardView({ data }: CardViewProps) {
  return <div className="space-y-6">{renderCard("root", data, "root")}</div>;
}
