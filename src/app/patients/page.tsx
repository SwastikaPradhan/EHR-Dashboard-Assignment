"use client";

import { useEffect, useState } from "react";
import PatientForm from "./PatientForm";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [search,setSearch]=useState("");

  async function fetchPatients(query?:string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/fhir/Patient${query ? `?name=${query}` : ""}`);
      const data = await res.json();
      setPatients(data.entry?.map((e: any) => ({ ...e.resource })) || []);
    } catch (err) {
      console.error("fetchPatients error:", err);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this patient?")) return;
    try {
      const res = await fetch(`/api/fhir/Patient?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text();
        alert("Delete failed: " + text);
        return;
      }
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("delete error:", err);
    }
  }

  // Called after creating/updating a patient
  function handlePatientSaved(updatedPatient: any) {
    setPatients((prev) => {
      const index = prev.findIndex((p) => p.id === updatedPatient.id);
      if (index >= 0) {
        // Update existing patient
        const newList = [...prev];
        newList[index] = updatedPatient;
        return newList;
      } else {
        // Add new patient at the top
        return [updatedPatient, ...prev];
      }
    });
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Patients</h1>
        <div className="flex gap-2">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={() => fetchPatients(search)}
            className="px-4 py-2 bg-gray-700 text-white rounded"
          >
            Search
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            + Add Patient
          </button>
        </div>
      </div>

      {showForm && (
        <PatientForm
          patient={editing}
          onClose={(updatedPatient) => {
            setShowForm(false);
            setEditing(null);
            if (updatedPatient) handlePatientSaved(updatedPatient);
          }}
        />
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Birth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id}>
                <td>{p.name?.[0]?.given?.join(" ") || ""} {p.name?.[0]?.family}</td>
                <td>{p.gender || "-"}</td>
                <td>{p.birthDate || "-"}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => { setEditing(p); setShowForm(true); }}
                    className="px-2 py-1 border rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-2 py-1 border rounded bg-red-500 text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

