// page.tsx - Clinical Operations Main Page
"use client";

import Link from "next/link";
import { 
  FileText, 
  Activity, 
  TestTube, 
  Pill, 
  Stethoscope, 
  Clock 
} from "lucide-react";

const operations = [
  { 
    id: "notes", 
    label: "Clinical Notes", 
    description: "Document patient encounters and observations",
    icon: FileText,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
  },
  { 
    id: "vitals", 
    label: "Vital Signs", 
    description: "Record and monitor patient vital measurements",
    icon: Activity,
    color: "bg-green-50 border-green-200 hover:bg-green-100"
  },
  { 
    id: "labs", 
    label: "Lab Results", 
    description: "View diagnostic reports and test results",
    icon: TestTube,
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100"
  },
  { 
    id: "medications", 
    label: "Medications", 
    description: "Manage patient medication lists and prescriptions",
    icon: Pill,
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100"
  },
  { 
    id: "diagnosis", 
    label: "Diagnoses & Procedures", 
    description: "Add diagnostic and procedure codes",
    icon: Stethoscope,
    color: "bg-red-50 border-red-200 hover:bg-red-100"
  },
  { 
    id: "history", 
    label: "Patient History", 
    description: "Access historical encounters and records",
    icon: Clock,
    color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
  },
];

export default function ClinicalOperationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Clinical Operations
          </h1>
          <p className="text-gray-600">
            Select an operation to manage patient care and documentation
          </p>
        </div>

        {/* Operations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {operations.map((op) => {
            const IconComponent = op.icon;
            return (
              <Link
                key={op.id}
                href={`/clinical-operations?operation=${op.id}`}
                className={`group p-6 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${op.color}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <IconComponent className="w-8 h-8 text-gray-700 group-hover:text-gray-900 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {op.label}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {op.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
