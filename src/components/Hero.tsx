import { Calendar, Star, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative bg-slate-50 overflow-hidden pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-slate-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-10 sm:pt-16 lg:pt-20">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-6">
                <Star className="w-4 h-4 fill-primary-600" />
                <span>Calificación 5.0 en Google</span>
              </div>
              <h1 className="text-4xl tracking-tight font-extrabold text-secondary-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Tu sonrisa en </span>
                <span className="block text-primary-600 xl:inline">manos expertas</span>
              </h1>
              <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Atención odontológica integral y especializada en CDMX. Nos enfocamos en tu comodidad, brindando tratamientos de alta calidad con un trato humano y profesional.
              </p>
              
              <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
                <a
                  href="/agendar"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 md:text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Calendar className="w-5 h-5" />
                  Agendar Cita
                </a>
                <a
                  href="/servicios"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-200 text-base font-medium rounded-xl text-secondary-800 bg-white hover:bg-slate-50 hover:border-slate-300 md:text-lg transition-all"
                >
                  Ver Tratamientos
                </a>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-600">Trato Profesional</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-600">Alta Calidad</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-600">Sin Dolor</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Decorative right side - Abstract Dental Representation */}
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-primary-50">
        <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center relative overflow-hidden">
          {/* Abstract circles representing clean/modern design */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          
          <div className="relative z-10 w-3/4 h-3/4 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/50 shadow-2xl p-8 flex flex-col justify-center">
            <div className="space-y-6">
              <div className="h-4 bg-primary-100 rounded w-3/4"></div>
              <div className="h-4 bg-primary-100 rounded w-1/2"></div>
              <div className="h-4 bg-primary-100 rounded w-5/6"></div>
              <div className="mt-8 flex gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                  <Star className="w-8 h-8 text-primary-500" />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-primary-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
