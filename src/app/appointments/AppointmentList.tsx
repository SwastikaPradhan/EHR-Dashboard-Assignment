import AppointmentCard from "./AppointmentCard";

export default function AppointmentList({ appointments, searchTerm, selectedDate, onEdit, onDelete }: any) {
  const filteredAppointments = appointments.filter((a: any) => {
    return (
      (a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.patientId.toLowerCase().includes(searchTerm.toLowerCase())) &&
      a.date === selectedDate
    );
  });

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Appointments for {selectedDate} ({filteredAppointments.length})
          </h2>
        </div>

        {filteredAppointments.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No appointments found for this date</p>
        ) : (
          filteredAppointments
            .sort((a: any, b: any) => a.time.localeCompare(b.time))
            .map((appointment: any) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onEdit={() => onEdit(appointment)}
                onDelete={() => onDelete(appointment.id)}
              />
            ))
        )}
      </div>
    </div>
  );
}
