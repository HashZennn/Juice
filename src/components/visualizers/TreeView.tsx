"use client";

import { useState } from "react";
import { JsonValue, JsonObject, JsonArray } from "@/types";
import {
  FiFolder,
  FiList,
  FiType,
  FiHash,
  FiToggleLeft,
  FiMinus,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

interface TreeViewProps {
  data: JsonValue;
  path?: string;
  depth?: number;
}

interface TreeNodeProps {
  label: string;
  value: JsonValue;
  path: string;
  depth: number;
  isLast?: boolean;
}

function getValueType(value: JsonValue): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function getValueIcon(value: JsonValue) {
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

function TreeNode({
  label,
  value,
  path,
  depth,
  isLast = false,
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const type = getValueType(value);
  const isExpandable = type === "object" || type === "array";

  const indent = "  ".repeat(depth);
  const connector = isLast ? "└─ " : "├─ ";

  const toggleExpanded = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded);
    }
  };

  const renderValue = () => {
    if (type === "object" && value !== null) {
      const obj = value as JsonObject;
      const entries = Object.entries(obj);
      return (
        <div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded px-2 py-1 ${
              isExpandable ? "cursor-pointer" : "cursor-default"
            }`}
            onClick={toggleExpanded}
          >
            {" "}
            <span className="text-gray-400 font-mono text-xs">
              {indent}
              {connector}
            </span>
            {isExpandable && (
              <span className="text-gray-400 text-xs">
                {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
              </span>
            )}
            <span className="text-xs">{getValueIcon(value)}</span>
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {label}
            </span>
            <span className="text-xs text-gray-500">
              {isExpanded ? "{" : `{ ${entries.length} properties }`}
            </span>
          </div>

          {isExpanded && (
            <div className="ml-4">
              {entries.map(([key, val], index) => (
                <TreeNode
                  key={key}
                  label={key}
                  value={val}
                  path={`${path}.${key}`}
                  depth={depth + 1}
                  isLast={index === entries.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    if (type === "array") {
      const arr = value as JsonArray;
      return (
        <div>
          <div
            className={`flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded px-2 py-1 ${
              isExpandable ? "cursor-pointer" : "cursor-default"
            }`}
            onClick={toggleExpanded}
          >
            {" "}
            <span className="text-gray-400 font-mono text-xs">
              {indent}
              {connector}
            </span>
            {isExpandable && (
              <span className="text-gray-400 text-xs">
                {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
              </span>
            )}
            <span className="text-xs">{getValueIcon(value)}</span>
            <span className="font-medium text-purple-600 dark:text-purple-400">
              {label}
            </span>
            <span className="text-xs text-gray-500">
              {isExpanded ? "[" : `[ ${arr.length} items ]`}
            </span>
          </div>

          {isExpanded && (
            <div className="ml-4">
              {arr.map((item, index) => (
                <TreeNode
                  key={index}
                  label={`[${index}]`}
                  value={item}
                  path={`${path}[${index}]`}
                  depth={depth + 1}
                  isLast={index === arr.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    // Primitive values
    return (
      <div className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded px-2 py-1">
        <span className="text-gray-400 font-mono text-xs">
          {indent}
          {connector}
        </span>
        <span className="text-xs">{getValueIcon(value)}</span>
        <span className="font-medium text-green-600 dark:text-green-400">
          {label}
        </span>
        <span className="text-xs text-gray-500">:</span>
        <span
          className={`text-sm ${
            type === "string"
              ? "text-orange-600 dark:text-orange-400"
              : type === "number"
              ? "text-blue-600 dark:text-blue-400"
              : type === "boolean"
              ? "text-purple-600 dark:text-purple-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {type === "string" ? `"${value}"` : String(value)}
        </span>
      </div>
    );
  };

  return renderValue();
}

export default function TreeView({
  data,
  path = "root",
  depth = 0,
}: TreeViewProps) {
  return (
    <div className="font-mono text-sm">
      <TreeNode label={path} value={data} path={path} depth={depth} />
    </div>
  );
}
