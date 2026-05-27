"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar as CalendarIcon, Clock, CheckCircle2, Clock3 } from "lucide-react";

interface AppointmentService {
  id: string;
  serviceId: string;
  service: {
    name: string;
    durationMin: number;
    price: number;
  };
}

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  amount: number;
  services: AppointmentService[];
}

interface AppointmentsResponse {
  appointments: Appointment[];
  total: number;
  totalPages: number;
}

export default function CitasPage() {
  const router = useRouter();
  const { token, client, isAuthenticated, isLoading: authLoading } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    // If not authenticated, redirect
    if (!client || !isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/appointment/get-appointments-by-client-id?clientId=${client.businessClient}&page=1&limit=20`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching appointments");
        }

        const data: AppointmentsResponse = await response.json();
        setAppointments(data.appointments);
      } catch (err: unknown) {
        console.error(err);
        setError("Ocurrió un error al cargar tus citas.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [client, isAuthenticated, authLoading, router, token]);

  if (authLoading || !client || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow pt-28 pb-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary-900">Mis Citas</h1>
            <p className="text-slate-600 mt-2">Revisa el historial y estado de tus citas.</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
              {error}
            </div>
          ) : appointments.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
              <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No tienes citas</h3>
              <p className="text-slate-500 mt-2">Aún no has agendado ninguna cita con nosotros.</p>
              <button
                onClick={() => router.push('/agendar')}
                className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors"
              >
                Agendar ahora
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-shadow hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary-50 p-3 rounded-full text-primary-600">
                        <CalendarIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          {new Date(
                            appointment.date?.split("T")[0] + "T00:00:00"
                          ).toLocaleDateString("es-MX", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <div className="flex items-center text-slate-500 mt-1 gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {appointment.startTime} - {appointment.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                      {appointment.status === "CONFIRMED" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Confirmada
                        </span>
                      ) : appointment.status === "SCHEDULED" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 gap-1">
                          <Clock3 className="w-4 h-4" /> Agendada
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          {appointment.status}
                        </span>
                      )}

                      <button
                        onClick={() => router.push(`/editar-cita/${appointment.id}`)}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors border border-primary-100"
                      >
                        Editar
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Tratamientos:</h4>
                    <ul className="space-y-2">
                      {appointment.services.map((svc) => (
                        <li key={svc.id} className="flex justify-between items-center text-slate-600">
                          <span>{svc.service.name}</span>
                          <span className="font-medium">${svc.service.price}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-100">
                      <span className="font-semibold text-slate-900">Total</span>
                      <span className="font-bold text-lg text-primary-600">${appointment.amount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
