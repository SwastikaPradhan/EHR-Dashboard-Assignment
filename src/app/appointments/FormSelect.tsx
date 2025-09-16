"use client";
import React from "react";

type FormSelectProps = {
  label: string;
  value: any;
  options: any[];
  placeholder?: string;
  onChange: (value: string) => void;
  formatOption?: (option: any) => string;
};

export default function FormSelect({ label, value, options, placeholder, onChange, formatOption }: FormSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2 border rounded-md"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {formatOption ? formatOption(opt) : opt}
          </option>
        ))}
      </select>
    </div>
  );
}
