import { MapPin, Phone, Clock } from "lucide-react";

export default function Contact() {
  return (
    <section id="contacto" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Visítanos</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-secondary-900 sm:text-4xl">
            ¿Listo para mejorar tu sonrisa?
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
            Agenda tu cita hoy mismo o visítanos en nuestra clínica en Prado Coapa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
          {/* Contact Info */}
          <div className="space-y-8 bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <h3 className="text-2xl font-bold text-secondary-900 mb-6">Información de Contacto</h3>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-primary-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-secondary-900">Ubicación</h4>
                <p className="mt-1 text-slate-600 leading-relaxed">
                  Calz Acoxpa 566-int 2, Coapa, Prado Coapa<br />
                  Tlalpan, 14357 Ciudad de México, CDMX
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-primary-600">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-secondary-900">Teléfono</h4>
                <p className="mt-1 text-slate-600">
                  <a href="tel:+525558019251" className="hover:text-primary-600 transition-colors font-medium">55 5801 9251</a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-primary-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-secondary-900">Horario</h4>
                <div className="mt-1 text-slate-600 space-y-1">
                  <p className="flex justify-between w-48"><span>Lun - Vie:</span> <span>10:00 - 19:00</span></p>
                  <p className="flex justify-between w-48"><span>Sábado:</span> <span>10:00 - 14:00</span></p>
                  <p className="flex justify-between w-48 text-slate-400"><span>Domingo:</span> <span>Cerrado</span></p>
                </div>
              </div>
            </div>
            
            <div className="pt-6">
              <a 
                href="https://maps.google.com/?q=Dental+Lanz+Calz+Acoxpa+566-int+2" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-secondary-900 hover:bg-secondary-800 transition-colors shadow-md"
              >
                <MapPin className="w-5 h-5" />
                Abrir en Google Maps
              </a>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="w-full h-[500px] bg-slate-200 rounded-2xl overflow-hidden shadow-inner relative border border-slate-200">
            {/* In a real app, you would use an iframe from Google Maps here */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.5503893663673!2d-99.1362705!3d19.2923583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce01ab7b57bb99%3A0x6a0c5c3b9b4a44b!2sCalz%20Acoxpa%20566%2C%20Coapa%2C%20Prado%20Coapa%2C%20Tlalpan%2C%2014357%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1700000000000!5m2!1ses!2smx" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de ubicación Dental Lanz"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
