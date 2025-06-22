"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { JsonValue } from "@/types";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import { FiFileText, FiTrash2, FiCopy } from "react-icons/fi";

interface JsonInputProps {
  onJsonChange: (data: JsonValue | null, error: string) => void;
  data?: JsonValue | null;
}

const exampleJson = {
  user: {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    profile: {
      age: 30,
      city: "New York",
      interests: ["coding", "music", "travel"],
      isActive: true,
    },
  },
  posts: [
    {
      id: 1,
      title: "Hello World",
      content: "This is my first post",
      tags: ["introduction", "hello"],
    },
    {
      id: 2,
      title: "JSON Visualization",
      content: "Learning to visualize JSON data",
      tags: ["json", "visualization", "ui"],
    },
  ],
};

export default function JsonInput({ onJsonChange, data }: JsonInputProps) {
  const [input, setInput] = useState<string>(
    JSON.stringify(exampleJson, null, 2)
  );
  const [isInternalUpdate, setIsInternalUpdate] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [lastValidData, setLastValidData] = useState<JsonValue | null>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Update input when external data changes (from form updates)
  // Only update if the data is actually different from what we last sent
  useEffect(() => {
    if (data && data !== null && !isInternalUpdate && data !== lastValidData) {
      const formatted = JSON.stringify(data, null, 2);
      if (formatted !== input) {
        setInput(formatted);
        setLastValidData(data);
      }
    }
  }, [data, isInternalUpdate, input, lastValidData]);
  // Reset internal update flag after a delay
  useEffect(() => {
    if (isInternalUpdate) {
      const timeout = setTimeout(() => {
        setIsInternalUpdate(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [isInternalUpdate]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);
  useEffect(() => {
    // Initialize with example JSON only on component mount
    const formatted = JSON.stringify(exampleJson, null, 2);
    setInput(formatted);
    setLastValidData(exampleJson);
    try {
      const parsed = JSON.parse(formatted);
      onJsonChange(parsed, "");
    } catch (error) {
      onJsonChange(
        null,
        error instanceof Error ? error.message : "Invalid JSON"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount

  const handleInputChange = useCallback(
    (value: string | undefined) => {
      if (value === undefined || value === input) return;

      setInput(value);

      // Clear existing timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // Debounce the JSON parsing and update
      updateTimeoutRef.current = setTimeout(() => {
        setIsInternalUpdate(true);

        if (!value.trim()) {
          onJsonChange(null, "");
          setLastValidData(null);
          return;
        }
        try {
          const parsed = JSON.parse(value);
          setLastValidData(parsed);
          onJsonChange(parsed, "");
        } catch (error) {
          // Don't update lastValidData on parse errors
          // This prevents the editor from refreshing when typing invalid JSON
          onJsonChange(
            null,
            error instanceof Error ? error.message : "Invalid JSON"
          );
        }
      }, 300); // 300ms debounce
    },
    [onJsonChange, input]
  );
  const loadExample = () => {
    const formatted = JSON.stringify(exampleJson, null, 2);
    setInput(formatted);
    setLastValidData(exampleJson);
    handleInputChange(formatted);
    toast.success("Example JSON loaded");
  };
  const clearInput = () => {
    setInput("");
    onJsonChange(null, "");
    toast.success("JSON cleared");
  };

  const copyInput = () => {
    navigator.clipboard
      .writeText(input)
      .then(() => {
        toast.success("JSON copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy JSON to clipboard");
      });
  };

  return (
    <div
      className="h-full flex flex-col relative"
      style={{ scrollbarGutter: "stable" }}
    >
      <div
        className="flex-1 border border-gray-200 dark:border-gray-700 rounded overflow-hidden bg-white dark:bg-gray-900 relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {" "}
        {/* Floating Action Buttons */}
        <div
          className={`absolute top-3 right-3 z-10 flex gap-2 transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={loadExample}
            className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:bg-blue-500/20 dark:hover:bg-blue-400/20 text-blue-600 dark:text-blue-400 rounded-lg shadow-lg transition-all duration-200 cursor-pointer group"
            title="Load Example JSON"
          >
            <FiFileText
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
          </button>
          <button
            onClick={copyInput}
            className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:bg-green-500/20 dark:hover:bg-green-400/20 text-green-600 dark:text-green-400 rounded-lg shadow-lg transition-all duration-200 cursor-pointer group"
            title="Copy JSON"
          >
            <FiCopy
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
          </button>
          <button
            onClick={clearInput}
            className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:bg-red-500/20 dark:hover:bg-red-400/20 text-red-600 dark:text-red-400 rounded-lg shadow-lg transition-all duration-200 cursor-pointer group"
            title="Clear JSON"
          >
            <FiTrash2
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
          </button>
        </div>
        <Editor
          height="100%"
          defaultLanguage="json"
          value={input}
          onChange={handleInputChange}
          theme={isDarkMode ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            folding: true,
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 2,
            insertSpaces: true,
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            smoothScrolling: true,
            cursorBlinking: "smooth",
            renderWhitespace: "selection",
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            acceptSuggestionOnEnter: "off",
            wordBasedSuggestions: "off",
          }}
        />
      </div>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Lines: {input.split("\n").length} | Characters: {input.length}
      </div>
    </div>
  );
}
