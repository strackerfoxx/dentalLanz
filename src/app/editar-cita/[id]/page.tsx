"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getServices, getBusiness } from "@/lib/api";
import { Service, Business, BusinessUser } from "@/lib/types";
import { MapPin, Phone, Calendar as CalendarIcon, Clock, Mail } from "lucide-react";
import Schedule from "@/components/Schedule";
import { getAvailableUsers } from "@/lib/availableUsers";
import { toast } from "react-toastify";
import { DateTime } from "luxon";

function EditBookingForm({ id }: { id: string }) {
  const router = useRouter();
  const { token, client, isAuthenticated, isLoading: authLoading } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [status, setStatus] = useState<string>("");
  const [statusSelected, setStatusSelected] = useState<string>("");
  const [servicesSelected, setServicesSelected] = useState<string[]>([]);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  // Available users logic
  const [serviceUsers, setServiceUsers] = useState<Record<string, string>>({});
  const [availableUsers, setAvailableUsers] = useState<Record<string, BusinessUser[]>>({});

  useEffect(() => {
    async function fetchData() {
      if (!token) return;

      try {
        const [servicesData, businessData, appointmentResponse] = await Promise.all([
          getServices(),
          getBusiness(),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointment/get-appointments-by-id?id=${id}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }),
        ]);

        setServices(servicesData.services);
        setBusiness(businessData);

        if (appointmentResponse.ok) {
          const appointmentData = await appointmentResponse.json();
          setStatus(appointmentData.appointment.status ?? "");
          setDate(new Date(appointmentData.appointment.date).toISOString().split("T")[0]);
          setTime(appointmentData.appointment.startTime);

          if (appointmentData.appointment.services && Array.isArray(appointmentData.appointment.services)) {
            const selectedIds = appointmentData.appointment.services.map((s: { serviceId: string }) => s.serviceId);
            setServicesSelected(selectedIds);

            const selectedUsers = appointmentData.appointment.services.reduce((acc: Record<string, string>, service: { serviceId: string; userId?: string }) => {
              if (service.serviceId && service.userId) {
                acc[service.serviceId] = service.userId;
              }
              return acc;
            }, {});
            setServiceUsers(selectedUsers);
          }
        } else {
          toast.error("Error al cargar la cita.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Ocurrió un error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && isAuthenticated) {
        fetchData();
    }
  }, [id, token, authLoading, isAuthenticated]);

  useEffect(() => {
    let mounted = true;
    async function fetchAvailableUsers() {
      if (servicesSelected.length > 0 && time && date && business?.id) {
        const users = await getAvailableUsers({
          servicesSelected,
          date,
          hour: time,
          businessId: business.id,
          token: token || undefined,
        });
        if (mounted) {
          setAvailableUsers(users);
        }
      }
    }
    fetchAvailableUsers();
    return () => {
      mounted = false;
    };
  }, [servicesSelected, time, date, business, token]);

  const updateServiceUser = (serviceId: string, userId: string) => {
    setServiceUsers((prev) => ({
      ...prev,
      [serviceId]: userId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === "CANCELED") {
      toast.error("La cita está cancelada y no se puede modificar.");
      return;
    }

    if (!date || servicesSelected.length === 0 || !time || !business?.id) {
      toast.error("Por favor completa todos los campos.");
      return;
    }

    // Verify all services have a professional assigned
    for (const serviceId of servicesSelected) {
      if (!serviceUsers[serviceId]) {
        toast.error("Por favor selecciona un profesional para cada tratamiento.");
        return;
      }
    }

    const dateObj = new Date(date);

    const payload = {
      businessId: business.id,
      date: DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-MM-dd'),
      startTime: time,
      status: statusSelected || "SCHEDULED",
      services: servicesSelected.map(serviceId => ({
        serviceId,
        userId: serviceUsers[serviceId],
      })),
      businessClientId: client?.businessClient,
      appointmentId: id,
      timezone: DateTime.local().zoneName,
    };

    console.log("Payload to submit:", payload);

    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointment/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      toast.success(`Cita editada con éxito.`);
      router.push("/citas");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al intentar editar tu cita. Por favor intenta de nuevo.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
     return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Inicia sesión para editar tu cita</h2>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors"
          >
            Ir a Login
          </button>
        </div>
      );
  }

  const renderHours = () => {
    if (!business?.businessHours) return null;
    const days = [
      { key: "monday", label: "Lunes" },
      { key: "tuesday", label: "Martes" },
      { key: "wednesday", label: "Miércoles" },
      { key: "thursday", label: "Jueves" },
      { key: "friday", label: "Viernes" },
      { key: "saturday", label: "Sábado" },
      { key: "sunday", label: "Domingo" },
    ];

    return (
      <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-100">
        <h4 className="font-semibold text-secondary-900 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary-500" />
          Horario de Atención
        </h4>
        <ul className="text-sm text-slate-600 space-y-1">
          {days.map((day) => {
            const hours = business.businessHours[day.key as keyof typeof business.businessHours];
            return (
              <li key={day.key} className="flex justify-between border-b border-slate-100 pb-1">
                <span>{day.label}</span>
                <span>{hours.closed ? "Cerrado" : `${hours.open} - ${hours.close}`}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-secondary-900 tracking-tight">
              Editar Cita
            </h1>
            <p className="mt-4 text-lg text-slate-500">
              Modifica los detalles de tu cita y guarda los cambios.
            </p>
          </div>
          {status && (
            <div className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${status === "CANCELED" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
              Estado: {status}
            </div>
          )}
        </div>
      </div>
      {status === "CANCELED" && (
        <div className="max-w-3xl mx-auto mb-8 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          Esta cita está cancelada y no se puede modificar. Solo puedes verla en modo de lectura.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Contact/Business Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-xl font-bold text-secondary-900 mb-6">Información</h3>

            {business && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-600 text-sm leading-relaxed">{business.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <span className="text-slate-600 text-sm">{business.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <span className="text-slate-600 text-sm">{business.email}</span>
                </div>

                <hr className="my-6 border-slate-100" />

                {renderHours()}
              </div>
            )}
          </div>
        </div>

        {/* Form Container */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-secondary-900 border-b pb-2">1. Selecciona el Servicio</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Tratamientos <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map((s) => {
                      const isSelected = servicesSelected.includes(s.id);
                      return (
                        <div
                          key={s.id}
                          className={`flex items-start p-3 border rounded-xl transition-colors ${
                            isSelected ? "border-primary-500 bg-primary-50" : "border-slate-200 bg-white hover:border-primary-300"
                          } ${status === "CANCELED" ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
                          onClick={() => {
                            if (status === "CANCELED") return;
                            if (isSelected) {
                              setServicesSelected(servicesSelected.filter(id => id !== s.id));
                            } else {
                              setServicesSelected([...servicesSelected, s.id]);
                            }
                          }}
                        >
                          <div className="flex h-5 items-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={status === "CANCELED"}
                              onChange={() => {}} // handled by parent div click
                              className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label className="font-medium text-slate-700 cursor-pointer">
                              {s.name}
                            </label>
                            <p className="text-slate-500">{s.durationMin} min - ${s.price}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {servicesSelected.length === 0 && (
                     <p className="text-sm text-red-500 mt-2">Selecciona al menos un tratamiento.</p>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-bold text-secondary-900 border-b pb-2">2. Elige Fecha</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">
                      Fecha <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="date"
                        id="date"
                        required
                        value={date}
                        disabled={status === "CANCELED"}
                        onChange={(e) => setDate(e.target.value)}
                        className="pl-10 w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-bold text-secondary-900 border-b pb-2">3. Estado de la cita</h3>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    value={statusSelected}
                    disabled={status === "CANCELED"}
                    onChange={(e) => setStatusSelected(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    <option value="" disabled>-- Selecciona un estado --</option>
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="CANCELED">CANCELED</option>
                  </select>
                </div>
              </div>

              {date && servicesSelected.length > 0 && business && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-xl font-bold text-secondary-900 border-b pb-2">4. Elige una Hora</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Horarios Disponibles <span className="text-red-500">*</span>
                    </label>
                    {status === "CANCELED" ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                      <p className="font-semibold">Hora asignada</p>
                      <p>{time || "No hay hora seleccionada"}</p>
                    </div>
                  ) : (
                    <>
                      <Schedule
                        date={date}
                        servicesSelected={servicesSelected}
                        hour={time}
                        setHour={setTime}
                        business={business}
                        excludeAppointmentId={id}
                      />
                      {!time && <p className="text-sm text-red-500 mt-2">Por favor selecciona una hora.</p>}
                    </>
                  )}
                  </div>
                </div>
              )}

              {servicesSelected.length > 0 && time && date && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-xl font-bold text-secondary-900 border-b pb-2">5. Asignar Profesionales</h3>
                  <div className="space-y-4">
                    {servicesSelected.map((serviceId) => {
                      const service = services.find((s) => s.id === serviceId);
                      const availableUsersForService = availableUsers[serviceId] || [];
                      const selectedUserId = serviceUsers[serviceId];
                      const assignedUser = selectedUserId ? business?.users.find((u) => u.id === selectedUserId) : undefined;
                      const finalAvailableUsers = selectedUserId
                        ? [
                            ...(assignedUser ? [assignedUser] : [{ id: selectedUserId, name: "Profesional asignado" }]),
                            ...availableUsersForService.filter((u) => u.id !== selectedUserId),
                          ]
                        : availableUsersForService;

                      return (
                        <div key={serviceId} className="p-4 border rounded-xl bg-slate-50 border-slate-200">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Profesional para {service?.name} <span className="text-red-500">*</span>
                          </label>
                          <select
                            disabled={status === "CANCELED"}
                            value={serviceUsers[serviceId] || ""}
                            onChange={(e) => updateServiceUser(serviceId, e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
                          >
                            <option value="" disabled>-- Seleccionar profesional --</option>
                            {finalAvailableUsers.map((u) => (
                              <option key={`${serviceId}-${u.id}`} value={u.id}>
                                {u.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={status === "CANCELED"}
                  className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white ${status === "CANCELED" ? "bg-slate-400 cursor-not-allowed" : "bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"}`}
                >
                  {status === "CANCELED" ? "Cita Cancelada" : "Guardar Cambios"}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function EditAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        <Suspense fallback={
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        }>
          <EditBookingForm id={id} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
