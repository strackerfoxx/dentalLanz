export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <a href="#" className="flex items-center gap-2 mb-6">
              <span className="text-2xl font-bold text-primary-500">Dental</span>
              <span className="text-2xl font-light text-white">Lanz</span>
            </a>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Tu salud bucal es nuestra prioridad. Brindamos atención odontológica de la más alta calidad con el mejor trato humano en la Ciudad de México.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-primary-500 transition-colors">Inicio</a></li>
              <li><a href="#servicios" className="text-slate-400 hover:text-primary-500 transition-colors">Tratamientos</a></li>
              <li><a href="#opiniones" className="text-slate-400 hover:text-primary-500 transition-colors">Opiniones</a></li>
              <li><a href="#contacto" className="text-slate-400 hover:text-primary-500 transition-colors">Ubicación</a></li>
            </ul>
          </div>

          {/* Legal / Info */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-6">Aviso</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              La información proporcionada en este sitio web es solo para fines informativos y no reemplaza el consejo, diagnóstico o tratamiento dental profesional.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Dental Lanz. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Aviso de Privacidad</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
