import { Sparkles, Stethoscope, Scissors } from "lucide-react";

const services = [
  {
    title: "Ortodoncia",
    description: "Alineamos tu sonrisa con los mejores especialistas. Tratamientos personalizados que mejoran tanto la estética como la funcionalidad de tu mordida.",
    icon: Scissors,
  },
  {
    title: "Blanqueamiento Dental",
    description: "Recupera el tono natural y brillante de tus dientes. Procedimientos seguros, efectivos y, lo más importante, sin molestias para el paciente.",
    icon: Sparkles,
  },
  {
    title: "Odontología General",
    description: "Cuidado integral para mantener tu salud bucal óptima. Desde limpiezas profundas hasta diagnóstico y prevención de enfermedades dentales.",
    icon: Stethoscope,
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Nuestros Servicios</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-secondary-900 sm:text-4xl">
            Tratamientos de Primer Nivel
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
            Ofrecemos lo más indicado para cada caso individualizando tu tratamiento para garantizar los mejores resultados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index} 
                className="group relative bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
