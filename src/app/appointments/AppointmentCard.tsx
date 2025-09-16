import { Clock, Phone, Edit, Trash2 } from "lucide-react";

export default function AppointmentCard({ appointment, onEdit, onDelete }: any) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "booked":
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 hover:bg-gray-50 border-t">
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
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={onEdit} className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
  );
}
