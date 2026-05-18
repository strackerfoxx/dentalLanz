import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Tere Tlahuiz",
    date: "Hace un año",
    text: "Tomé mi tratamiento de ortodoncia hace algunos años, además de otros procedimientos, con el Doctor Lanz y quedé encantada con los resultados!!! Me agradó desde el instante en que brinda toda la información detallada...",
    rating: 5,
  },
  {
    name: "Elizabeth Vázquez",
    date: "Hace un año",
    text: "Desde el primer momento, el Dr. Lanz me brindó una atención excepcional. Su amabilidad y profesionalismo me hicieron sentir cómoda durante todo el tratamiento. Explicó cada paso del procedimiento de forma clara...",
    rating: 5,
  },
  {
    name: "Daniela Tlahuiz",
    date: "Hace un año",
    text: "El Dr explica de manera profesional cada tratamiento; de igual manera te ofrece lo más indicado para cada caso individualizando que desde mi punto de vista eso es algo primordial. En general te hace la consulta amena.",
    rating: 5,
  },
];

export default function Reviews() {
  return (
    <section id="opiniones" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-50 to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Opiniones de Pacientes</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-secondary-900 sm:text-4xl">
              Lo que dicen de nosotros
            </p>
            <p className="mt-4 text-xl text-slate-500">
              La satisfacción de nuestros pacientes es nuestra mejor carta de presentación.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-secondary-900">5.0</span>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 mt-1">Basado en 7 opiniones de Google</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary-100" />
              <div className="flex text-yellow-400 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 italic mb-6 relative z-10 line-clamp-4">
                &quot;{review.text}&quot;
              </p>
              <div className="mt-auto flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900">{review.name}</h4>
                  <p className="text-sm text-slate-500">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="https://maps.google.com/?q=Dental+Lanz+Calz+Acoxpa+566-int+2" 
            className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 hover:underline"
          >
            Ver todas las opiniones en Google Maps →
          </a>
        </div>
      </div>
    </section>
  );
}
