"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getServices, getBusiness } from "@/lib/api";
import { Service, Business } from "@/lib/types";
import { toast } from "react-toastify";
import BookingForm, { BookingPayload } from "@/components/BookingForm";

function BookingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, client } = useAuth();

  const initialServiceId = searchParams.get("serviceId");

  const [services, setServices] = useState<Service[]>([]);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleSubmit = async (payload: BookingPayload) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Error al agendar la cita.");
      }

      toast.success(`¡Cita agendada con éxito para ${client?.name}!\n\nFecha: ${payload.date} a las ${payload.startTime}`);
      router.push("/citas");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al intentar agendar tu cita. Por favor intenta de nuevo.");
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Next.js requirement: Search params usage means we must be in a suspense boundary to use it.
  // The outer component provides the Suspense.
  const initialData = initialServiceId ? {
      servicesSelected: [initialServiceId],
      date: "",
      time: "",
      serviceUsers: {}
  } : undefined;

  return (
    <BookingForm
      business={business}
      services={services}
      initialData={initialData}
      onSubmit={handleSubmit}
      title="Agendar Cita"
      description="Completa el formulario y asegura tu espacio con nosotros."
      buttonText="Confirmar Cita"
    />
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        <Suspense fallback={
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        }>
          <BookingPageContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
