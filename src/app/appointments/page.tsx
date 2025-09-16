"use client";

import React, { useEffect, useState } from "react";
import AppointmentSearch from "./AppointmentSearch";
import AppointmentList from "./AppointmentList";
import AppointmentForm from "./AppointmentForm";

const FHIR_BASE = process.env.NEXT_PUBLIC_FHIR_BASE;
//data fetching+keep state
export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);

  // Fetch appointments from FHIR
  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${FHIR_BASE}/Appointment?date=${selectedDate}`);
      const data = await res.json();

      if (data.entry) {
  const mapped = data.entry.map((e: any) => {
    const participants = e.resource.participant || [];

    // Extract Patient info explicitly
    const patientParticipant = participants.find(
      (p: any) => p.actor?.reference?.startsWith("Patient/")
    );

    // Extract Provider info explicitly
    const providerParticipant = participants.find(
      (p: any) => p.actor?.reference?.startsWith("Practitioner/")
    );

    return {
      id: e.resource.id,
      patientName: patientParticipant?.actor?.display || "Unknown Patient",
      patientId: patientParticipant?.actor?.reference?.split("/")[1] || "",
      date: e.resource.start?.split("T")[0] || "",
      time: e.resource.start
        ? new Date(e.resource.start).toISOString().split("T")[1].slice(0, 5)
        : "",
      duration: e.resource.minutesDuration || 30,
      type: e.resource.serviceCategory?.[0]?.coding?.[0]?.display || "General",
      status: e.resource.status || "proposed",
      provider: providerParticipant?.actor?.display || "",
      phone: "", // Not in FHIR response — leave blank or map if available
      notes: e.resource.comment || e.resource.description || "",
    };
  });

  setAppointments(mapped);
} else {
  setAppointments([]);
}

    } catch (error) {
      console.error("Failed to fetch appointments", error);
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const handleSaveAppointment = async (appointmentData: any) => {
    try {
      const method = editingAppointment ? "PUT" : "POST";
      const url = editingAppointment
        ? `${FHIR_BASE}/Appointment/${editingAppointment.id}`
        : `${FHIR_BASE}/Appointment`;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/fhir+json" },
        body: JSON.stringify(appointmentData),
      });

      await fetchAppointments();
      setShowNewAppointment(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error("Failed to save appointment", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
          <button
            onClick={() => setShowNewAppointment(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <span>New Appointment</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Date Selector */}
        <AppointmentSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Appointment List */}
          <AppointmentList
            appointments={appointments}
            searchTerm={searchTerm}
            selectedDate={selectedDate}
            onEdit={setEditingAppointment}
            onDelete={() => fetchAppointments()}
          />

          {/* Appointment Form */}
          <div className="lg:col-span-1">
            {showNewAppointment || editingAppointment ? (
              <AppointmentForm
                appointment={editingAppointment}
                onSave={handleSaveAppointment}
                onCancel={() => {
                  setShowNewAppointment(false);
                  setEditingAppointment(null);
                }}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-500">
                <p className="mb-4">Create a new appointment</p>
                <button
                  onClick={() => setShowNewAppointment(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  New Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

