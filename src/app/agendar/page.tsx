"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getServices, getBusiness } from "@/lib/api";
import { Service, Business, BusinessUser } from "@/lib/types";
import { MapPin, Phone, Calendar as CalendarIcon, Clock, Mail } from "lucide-react";
import Schedule from "@/components/Schedule";
import { getAvailableUsers } from "@/lib/availableUsers";

function BookingForm() {
  const searchParams = useSearchParams();
  const initialServiceId = searchParams.get("serviceId");

  const [services, setServices] = useState<Service[]>([]);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [servicesSelected, setServicesSelected] = useState<string[]>(initialServiceId ? [initialServiceId] : []);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  // Available users logic
  const [serviceUsers, setServiceUsers] = useState<Record<string, string>>({});
  const [availableUsers, setAvailableUsers] = useState<Record<string, BusinessUser[]>>({});
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      const [servicesData, businessData] = await Promise.all([
        getServices(),
        getBusiness(),
      ]);
      setServices(servicesData.services);
      setBusiness(businessData);
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    let mounted = true;
    async function fetchAvailableUsers() {
      if (servicesSelected.length > 0 && time && date && business?.id) {
        const users = await getAvailableUsers({
          servicesSelected,
          date,
          hour: time,
          businessId: business.id,
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
  }, [servicesSelected, time, date, business]);

  const updateServiceUser = (serviceId: string, userId: string) => {
    setServiceUsers((prev) => ({
      ...prev,
      [serviceId]: userId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || servicesSelected.length === 0 || !time || !business?.id) {
      alert("Por favor completa todos los campos.");
      return;
    }

    // Verify all services have a professional assigned
    for (const serviceId of servicesSelected) {
      if (!serviceUsers[serviceId]) {
        alert("Por favor selecciona un profesional para cada tratamiento.");
        return;
      }
    }

    const payload = {
      businessId: business.id,
      date: date.split("T")[0],
      startTime: time,
      services: servicesSelected.map(serviceId => ({
        serviceId,
        userId: serviceUsers[serviceId],
      })),
      client: {
        name,
        email,
        phone
      }
    };

    try {
      // Usar endpoint de creación de citas adaptado al cliente
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Error al agendar la cita.");
      }

      alert(`¡Cita agendada con éxito para ${name}!\n\nFecha: ${date} a las ${time}\nTe enviaremos una confirmación a ${email}.`);

      // Reset form after successful submit
      setServicesSelected([]);
      setDate("");
      setTime("");
      setName("");
      setEmail("");
      setPhone("");
      setServiceUsers({});

    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al intentar agendar tu cita. Por favor intenta de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Simplified logic for business hours display
  const renderHours = () => {
    if (!business) return null;
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
      <div className="mt-6 space-y-2">
        <h4 className="font-semibold text-secondary-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-500" />
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
        <h1 className="text-4xl font-extrabold text-secondary-900 tracking-tight">
          Agendar Cita
        </h1>
        <p className="mt-4 text-lg text-slate-500">
          Completa el formulario y asegura tu espacio con nosotros.
        </p>
      </div>

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
                          className={`flex items-start p-3 border rounded-xl cursor-pointer transition-colors ${
                            isSelected ? "border-primary-500 bg-primary-50" : "border-slate-200 bg-white hover:border-primary-300"
                          }`}
                          onClick={() => {
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
                        onChange={(e) => setDate(e.target.value)}
                        className="pl-10 w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {date && servicesSelected.length > 0 && business && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-xl font-bold text-secondary-900 border-b pb-2">3. Elige una Hora</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Horarios Disponibles <span className="text-red-500">*</span>
                    </label>
                    <Schedule
                      date={date}
                      servicesSelected={servicesSelected}
                      hour={time}
                      setHour={setTime}
                      business={business}
                    />
                    {!time && <p className="text-sm text-red-500 mt-2">Por favor selecciona una hora.</p>}
                  </div>
                </div>
              )}

              {servicesSelected.length > 0 && time && date && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-xl font-bold text-secondary-900 border-b pb-2">4. Asignar Profesionales</h3>
                  <div className="space-y-4">
                    {servicesSelected.map((serviceId) => {
                      const service = services.find((s) => s.id === serviceId);
                      const availableUsersForService = availableUsers[serviceId] || [];

                      return (
                        <div key={serviceId} className="p-4 border rounded-xl bg-slate-50 border-slate-200">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Profesional para {service?.name} <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            value={serviceUsers[serviceId] || ""}
                            onChange={(e) => updateServiceUser(serviceId, e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                          >
                            <option value="" disabled>-- Seleccionar profesional --</option>
                            {availableUsersForService.map((u) => (
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

              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-bold text-secondary-900 border-b pb-2">5. Tus Datos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                      Nombre Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Juan Pérez"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                      Correo Electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="juan@ejemplo.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="55 1234 5678"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Confirmar Cita
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        {/* Next.js requires useSearchParams to be wrapped in a Suspense boundary */}
        <Suspense fallback={
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        }>
          <BookingForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
