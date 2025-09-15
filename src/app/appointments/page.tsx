"use client";

import React, { useState } from "react";
import { Calendar, Clock, Plus, Search, Phone, Edit, Trash2 } from "lucide-react";
import AppointmentForm from "./AppointmentForm";

const mockAppointments = [
  {
    id: "001",
    patientName: "John Doe",
    patientId: "P001",
    date: "2024-01-25",
    time: "09:00",
    duration: 30,
    type: "Check-up",
    status: "Scheduled",
    provider: "Dr. Smith",
    phone: "(555) 123-4567",
    notes: "Annual physical examination",
  },
  {
    id: "002",
    patientName: "Sarah Johnson",
    patientId: "P002",
    date: "2024-01-25",
    time: "10:30",
    duration: 45,
    type: "Follow-up",
    status: "Confirmed",
    provider: "Dr. Smith",
    phone: "(555) 234-5678",
    notes: "Diabetes follow-up",
  },
  {
    id: "003",
    patientName: "Mike Wilson",
    patientId: "P003",
    date: "2024-01-26",
    time: "14:00",
    duration: 30,
    type: "Consultation",
    status: "Pending",
    provider: "Dr. Johnson",
    phone: "(555) 345-6789",
    notes: "Back pain consultation",
  },
];

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00",
];

const appointmentTypes = ["Check-up", "Follow-up", "Consultation", "Emergency", "Procedure"];
const providers = ["Dr. Smith", "Dr. Johnson", "Dr. Williams"];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("2024-01-25");
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = appointment.date === selectedDate;
    return matchesSearch && matchesDate;
  });

  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== appointmentId));
  };

  const handleSaveAppointment = (appointmentData: any) => {
    if (editingAppointment) {
      setAppointments(
        appointments.map((apt) =>
          apt.id === editingAppointment.id ? { ...appointmentData, id: editingAppointment.id } : apt
        )
      );
    } else {
      const newAppointment = { ...appointmentData, id: Date.now().toString() };
      setAppointments([...appointments, newAppointment]);
    }
    setShowNewAppointment(false);
    setEditingAppointment(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
            <button
              onClick={() => setShowNewAppointment(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>New Appointment</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Date Filter */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by patient name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Appointments for {selectedDate} ({filteredAppointments.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredAppointments.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No appointments found for this date</p>
                  </div>
                ) : (
                  filteredAppointments
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((appointment) => (
                      <div key={appointment.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex flex-col items-center">
                              <Clock className="w-5 h-5 text-blue-600 mb-1" />
                              <span className="text-sm font-medium text-gray-900">{appointment.time}</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{appointment.patientName}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>ID: {appointment.patientId}</span>
                                <span>Type: {appointment.type}</span>
                                <span>Duration: {appointment.duration}min</span>
                                <span>Provider: {appointment.provider}</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-2">
                                <Phone className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-600">{appointment.phone}</span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                    appointment.status
                                  )}`}
                                >
                                  {appointment.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setEditingAppointment(appointment)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAppointment(appointment.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {appointment.notes && (
                          <div className="mt-3 pl-12">
                            <p className="text-sm text-gray-600 italic">"{appointment.notes}"</p>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-1">
            {showNewAppointment || editingAppointment ? (
              <AppointmentForm
                appointment={editingAppointment}
                onSave={handleSaveAppointment}
                onCancel={() => {
                  setShowNewAppointment(false);
                  setEditingAppointment(null);
                }}
                timeSlots={timeSlots}
                appointmentTypes={appointmentTypes}
                providers={providers}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
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
