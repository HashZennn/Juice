"use client";

import { useState, useCallback } from "react";
import { JsonValue, VisualizationMode } from "@/types";
import JsonInput from "./JsonInput";
import JsonVisualizer from "./JsonVisualizer";
import Header from "./Header";
import VisualizationModes from "./VisualizationModes";

export default function JuiceApp() {
  const [jsonData, setJsonData] = useState<JsonValue | null>(null);
  const [mode, setMode] = useState<VisualizationMode>("tree");
  const [error, setError] = useState<string>("");

  const handleJsonChange = useCallback(
    (data: JsonValue | null, error: string) => {
      setJsonData(data);
      setError(error);
    },
    []
  );

  const handleDataUpdate = useCallback((updatedData: JsonValue) => {
    setJsonData(updatedData);
  }, []);
  return (
    <div
      className="h-screen flex flex-col"
      style={{ scrollbarGutter: "stable" }}
    >
      <Header />

      <div className="flex-1 flex flex-col min-h-0">
        {/* Title Bar with Mode Selection */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  JSON Visualizer
                </h2>
              </div>
              <VisualizationModes mode={mode} onModeChange={setMode} />
            </div>
          </div>{" "}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex min-h-0">
          <div className="container mx-auto px-4 py-4 flex-1 flex min-h-0">
            <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
              {/* JSON Input Panel */}
              <div className="flex flex-col min-h-0">
                <JsonInput onJsonChange={handleJsonChange} data={jsonData} />
              </div>

              {/* Visualization Panel */}
              <div className="flex flex-col min-h-0">
                <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded min-h-0">
                  {error ? (
                    <div className="flex items-center justify-center h-full p-6">
                      <div className="text-center">
                        <div className="text-red-500 text-4xl mb-3">⚠️</div>
                        <h3 className="text-lg font-medium text-red-700 dark:text-red-400 mb-2">
                          JSON Parse Error
                        </h3>
                        <p className="text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/20 p-3 rounded border">
                          {error}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                          Fix the JSON syntax in the editor to see visualization
                        </p>
                      </div>
                    </div>
                  ) : jsonData ? (
                    <JsonVisualizer
                      data={jsonData}
                      mode={mode}
                      onDataUpdate={handleDataUpdate}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <div className="text-4xl mb-3">🧃</div>
                        <p className="text-base font-medium">
                          Enter JSON data to start visualizing
                        </p>
                        <p className="text-sm mt-1 text-gray-400">
                          JUICE will convert your JSON into beautiful UI
                          components
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
