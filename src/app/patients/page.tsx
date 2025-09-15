"use client";

import { useEffect, useState } from "react";
import PatientForm from "./PatientForm";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  async function fetchPatients() {
    setLoading(true);
    try {
      const res = await fetch("/api/fhir/Patient");
      const data = await res.json();
      setPatients(data.entry?.map((e: any) => ({ ...e.resource })) || []);
    } catch (err) {
      console.error("fetchPatients error:", err);
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
      await fetchPatients();
    } catch (err) {
      console.error("delete error:", err);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Patients</h1>
        <div>
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
          onClose={async () => {
            setShowForm(false);
            setEditing(null);
            await fetchPatients();
          }}
        />
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full border">
          <thead><tr><th>Name</th><th>Gender</th><th>Birth</th><th>Actions</th></tr></thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id}>
                <td>{p.name?.[0]?.given?.join(" ") || ""} {p.name?.[0]?.family}</td>
                <td>{p.gender || "-"}</td>
                <td>{p.birthDate || "-"}</td>
                <td className="space-x-2">
                  <button onClick={() => { setEditing(p); setShowForm(true); }} className="px-2 py-1 border rounded">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="px-2 py-1 border rounded bg-red-500 text-white">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
