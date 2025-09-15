"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type PatientFormProps = {
  patient?: any;
  onClose: (updatedPatient?: any) => void; // allow passing back the new/updated patient
};

export default function PatientForm({ patient, onClose }: PatientFormProps) {
  const [givenName, setGivenName] = useState(patient?.name?.[0]?.given?.[0] || "");
  const [familyName, setFamilyName] = useState(patient?.name?.[0]?.family || "");
  const [gender, setGender] = useState(patient?.gender || "");
  const [birthDate, setBirthDate] = useState(patient?.birthDate || "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      resourceType: "Patient",
      name: [{ given: [givenName], family: familyName }],
      gender,
      birthDate,
    };

    const url = patient ? `/api/fhir/Patient?id=${patient.id}` : `/api/fhir/Patient`;
    const method = patient ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Prefer": "return=representation", // ensure FHIR returns full updated resource
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save patient");

      const updatedPatient = await res.json(); // get created/updated patient from API
      onClose(updatedPatient); // pass back the updated patient to parent
    } catch (err) {
      console.error("Error saving patient:", err);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold">{patient ? "Edit Patient" : "Add Patient"}</h2>

        <input
          type="text"
          placeholder="Given Name"
          className="w-full border p-2 rounded"
          value={givenName}
          onChange={(e) => setGivenName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Family Name"
          className="w-full border p-2 rounded"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          required
        />
        <select
          className="w-full border p-2 rounded"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="unknown">Unknown</option>
        </select>
        <input
          type="date"
          className="w-full border p-2 rounded"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button type="submit">{patient ? "Update" : "Create"}</Button>
        </div>
      </form>
    </div>
  );
}
