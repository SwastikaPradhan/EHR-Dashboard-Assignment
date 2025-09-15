"use client";

import Link from "next/link";

const operations = [
  { id: "notes", label: "Add Clinical Notes" },
  { id: "vitals", label: "Record & Update Vital Signs" },
  { id: "labs", label: "View Lab Results & Diagnostic Reports" },
  { id: "medications", label: "Access & Update Medication Lists" },
  { id: "diagnosis", label: "Add Diagnoses & Procedure Codes" },
  { id: "history", label: "Retrieve Patient History & Encounters" },
];

export default function ClinicalOperationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Clinical Operations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {operations.map((op) => (
          <Link
            key={op.id}
            href={`/clinical-operations?operation=${op.id}`}
            className="p-4 bg-white rounded-lg shadow border hover:bg-blue-50 transition"
          >
            <p className="text-gray-800">{op.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
