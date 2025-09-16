"use client";
import React from "react";

export default function FormInput({ label, type = "text", value, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2 border rounded-md"
      />
    </div>
  );
}
