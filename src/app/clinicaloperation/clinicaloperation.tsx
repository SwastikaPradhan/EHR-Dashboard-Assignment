"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ClientalOperation() {
  const searchParams = useSearchParams();
  const operation = searchParams.get("operation");
  const [input, setInput] = useState("");

  const handleSave = () => {
    alert(`Saved ${operation}: ${input}`);
    setInput("");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow border">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        {operation ? operation.replace(/^\w/, (c) => c.toUpperCase()) : "Select Operation"}
      </h2>
      {operation ? (
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter details for ${operation}...`}
            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
          />
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      ) : (
        <p className="text-gray-500">Please select an operation from the list.</p>
      )}
    </div>
  );
}
