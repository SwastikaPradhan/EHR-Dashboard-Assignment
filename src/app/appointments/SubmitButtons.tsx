"use client";
import React from "react";

export default function SubmitButtons({ loading, isEdit, onSubmit, onCancel }: any) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onSubmit}
        disabled={loading}
        className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : isEdit ? "Update" : "Create"}
      </button>
      <button
        onClick={onCancel}
        className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
      >
        Cancel
      </button>
    </div>
  );
}
