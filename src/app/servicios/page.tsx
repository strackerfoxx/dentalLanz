import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getServices } from "@/lib/api";
import { Clock, DollarSign } from "lucide-react";
import Link from "next/link";

export default async function ServicesPage() {
  const { services } = await getServices();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-secondary-900 sm:text-5xl tracking-tight">
              Nuestros Tratamientos
            </h1>
            <p className="mt-4 text-xl text-slate-500">
              Conoce todos los servicios que ofrecemos para mantener tu salud bucal en óptimas condiciones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="p-6 flex-grow">
                  <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-slate-600 mb-6 line-clamp-3">
                    {service.description}
                  </p>

                  <div className="flex flex-col gap-3 mb-6">
                    <div className="flex items-center text-slate-500">
                      <Clock className="w-5 h-5 mr-2 text-primary-500" />
                      <span>{service.durationMin} minutos</span>
                    </div>
                    <div className="flex items-center text-slate-500">
                      <DollarSign className="w-5 h-5 mr-2 text-emerald-500" />
                      <span className="font-semibold text-slate-700">${service.price} MXN</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 mt-auto">
                  <Link
                    href={`/agendar?serviceId=${service.id}`}
                    className="block w-full py-3 px-4 bg-primary-50 text-primary-700 font-semibold text-center rounded-xl hover:bg-primary-600 hover:text-white transition-colors"
                  >
                    Agendar Cita
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
