
"use client";

import React, { useState, useEffect } from "react";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormTextArea from "./FormTextArea";
import SubmitButtons from "./SubmitButtons";

type AppointmentFormProps = {
  appointment?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
};

export default function AppointmentForm({ appointment, onSave, onCancel }: AppointmentFormProps) {
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<string[]>([]);
  const [providers, setProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    patientName: appointment?.patientName || "",
    patientId: appointment?.patientId || "",
    date: appointment?.date || "",
    time: appointment?.time || "",
    duration: appointment?.duration || 30,
    type: appointment?.type || "",
    status: appointment?.status || "proposed",
    provider: appointment?.provider || "",
    phone: appointment?.phone || "",
    notes: appointment?.notes || "",
  });

  useEffect(() => {
    async function fetchProviders() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_FHIR_BASE}/Practitioner?_count=10`);
        const data = await res.json();
        setProviders(data.entry?.map((e: any) => e.resource.name?.[0]?.text) || []);
      } catch (e) {
        console.error("Failed to fetch providers", e);
      }
    }

    async function fetchAppointmentTypes() {
      setAppointmentTypes(["Check-up", "Follow-up", "Consultation"]);
    }

    async function fetchTimeSlots() {
      try {
        const today = new Date().toISOString().split("T")[0];
        const res = await fetch(`${process.env.NEXT_PUBLIC_FHIR_BASE}/Slot?start=ge${today}&status=free&_count=10`);
        const data = await res.json();
        setTimeSlots(
          data.entry?.map((e: any) =>
            new Date(e.resource.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          ) || []
        );
      } catch (e) {
        console.error("Failed to fetch slots", e);
      }
    }

    fetchProviders();
    fetchAppointmentTypes();
    fetchTimeSlots();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // ✅ Build start and end time safely
      if (!formData.date || !formData.time) throw new Error("Please select date and time.");
      const startDateTime = `${formData.date}T${formData.time}:00Z`;
      const endDate = new Date(startDateTime);
      if (isNaN(endDate.getTime())) throw new Error("Invalid date/time format.");
      endDate.setMinutes(endDate.getMinutes() + formData.duration);

      const appointmentResource = {
        resourceType: "Appointment",
        status: formData.status,
        start: startDateTime,
        end: endDate.toISOString(),
        minutesDuration: formData.duration,
        participant: [
          {
            actor: { reference: `Patient/${formData.patientId}`, display: formData.patientName },
            status: "accepted",
          },
          {
            actor: { display: formData.provider },
            status: "accepted",
          },
        ],
        serviceCategory: [{ coding: [{ code: "appt", display: formData.type }] }],
        comment: formData.notes,
      };

      const url = appointment
        ? `${process.env.NEXT_PUBLIC_FHIR_BASE}/Appointment/${appointment.id}`
        : `${process.env.NEXT_PUBLIC_FHIR_BASE}/Appointment`;

      const res = await fetch(url, {
        method: appointment ? "PUT" : "POST",
        headers: { "Content-Type": "application/fhir+json" },
        body: JSON.stringify(appointmentResource),
      });

      if (!res.ok) throw new Error(`Failed to save appointment: ${res.status}`);
      const saved = await res.json();
      onSave(saved);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {appointment ? "Edit Appointment" : "New Appointment"}
      </h3>
      {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

      <div className="space-y-4">
        <FormInput label="Patient Name" value={formData.patientName} onChange={(v:any) => handleInputChange("patientName", v)} />
        <FormInput label="Patient ID" value={formData.patientId} onChange={(v:any) => handleInputChange("patientId", v)} />
        <FormInput type="date" label="Date" value={formData.date} onChange={(v:any) => handleInputChange("date", v)} />

        <FormSelect label="Time" value={formData.time} onChange={(v) => handleInputChange("time", v)} options={timeSlots} placeholder="Select time" />
        <FormSelect label="Duration" value={formData.duration} onChange={(v) => handleInputChange("duration", parseInt(v))} options={[15, 30, 45, 60]} formatOption={(o) => `${o} min`} />
        <FormSelect label="Type" value={formData.type} onChange={(v) => handleInputChange("type", v)} options={appointmentTypes} placeholder="Select type" />
        <FormSelect label="Provider" value={formData.provider} onChange={(v) => handleInputChange("provider", v)} options={providers} placeholder="Select provider" />

        <FormTextArea label="Notes" value={formData.notes} onChange={(v:any) => handleInputChange("notes", v)} />

        <SubmitButtons loading={loading} isEdit={!!appointment} onSubmit={handleSubmit} onCancel={onCancel} />
      </div>
    </div>
  );
}
