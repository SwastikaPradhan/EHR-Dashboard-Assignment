"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { 
  ArrowLeft, 
  Save, 
  FileText, 
  Activity, 
  TestTube, 
  Pill, 
  Stethoscope, 
  Clock,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

type OperationType = 'notes' | 'vitals' | 'labs' | 'medications' | 'diagnosis' | 'history';

const operationIcons: Record<OperationType, React.ComponentType<any>> = {
  notes: FileText,
  vitals: Activity,
  labs: TestTube,
  medications: Pill,
  diagnosis: Stethoscope,
  history: Clock,
};

const operationColors: Record<OperationType, string> = {
  notes: "bg-blue-500",
  vitals: "bg-green-500",
  labs: "bg-purple-500",
  medications: "bg-orange-500",
  diagnosis: "bg-red-500",
  history: "bg-indigo-500",
};

const placeholders: Record<OperationType, string> = {
  notes: "Enter clinical notes, observations, and patient interactions...",
  vitals: "Record vital signs: BP, HR, Temp, RR, O2 Sat...",
  labs: "Document lab results and diagnostic findings...",
  medications: "Add medications, dosages, and administration notes...",
  diagnosis: "Enter diagnosis codes, procedures, and clinical assessments...",
  history: "Document patient history and previous encounters...",
};

export default function ClinicalOperation() {
  const searchParams = useSearchParams();
  const operation = searchParams.get("operation");
  const [input, setInput] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (!input.trim()) return;
    
    // Simulate save operation
    setIsSaved(true);
    setTimeout(() => {
      alert(`Saved ${operation}: ${input}`);
      setInput("");
      setIsSaved(false);
    }, 500);
  };

  if (!operation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Operation Selected
          </h2>
          <p className="text-gray-600 mb-6">
            Please select an operation from the clinical operations list.
          </p>
          <Link
            href="/clinical-operations"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = operationIcons[operation as OperationType] || FileText;
  const colorClass = operationColors[operation as OperationType] || "bg-blue-500";
  const placeholder = placeholders[operation as OperationType] || `Enter details for ${operation}...`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link
            href="/clinical-operations"
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${colorClass}`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {operation.replace(/^\w/, (c) => c.toUpperCase())}
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6">
            <div className="mb-6">
              <label htmlFor="clinical-input" className="block text-sm font-medium text-gray-700 mb-2">
                Clinical Information
              </label>
              <textarea
                id="clinical-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                rows={12}
                className="w-full border border-gray-300 rounded-lg p-4 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {input.length} characters
              </div>
              <button
                onClick={handleSave}
                disabled={!input.trim() || isSaved}
                className={`inline-flex items-center px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  !input.trim()
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : isSaved
                    ? "bg-green-100 text-green-800"
                    : `${colorClass} text-white hover:opacity-90 transform hover:scale-105`
                }`}
              >
                {isSaved ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Entry
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
              Save as Template
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
              Add to Favorites
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
              Schedule Follow-up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}