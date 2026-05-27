"use client";

import { useState } from "react";
import { Menu, X, Phone, Calendar } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-600">Dental</span>
              <span className="text-2xl font-light text-secondary-800">Lanz</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/servicios" className="text-secondary-800 hover:text-primary-600 transition-colors">Servicios</Link>
            <Link href="/#opiniones" className="text-secondary-800 hover:text-primary-600 transition-colors">Opiniones</Link>
            {isAuthenticated ? (
              <Link href="/citas" className="text-secondary-800 hover:text-primary-600 transition-colors">Mis Citas</Link>
            ): (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-secondary-800 hover:text-primary-600 transition-colors">Iniciar Sesión</Link>
                <Link href="/signup" className="text-secondary-800 hover:text-primary-600 transition-colors">Registrarse</Link>
              </div>
            )}
            <Link
              href="/agendar"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              Agendar Cita
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary-800 hover:text-primary-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link
              href="/servicios"
              className="block px-3 py-3 text-base font-medium text-secondary-800 hover:text-primary-600 hover:bg-slate-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Servicios
            </Link>
            <Link
              href="/#opiniones"
              className="block px-3 py-3 text-base font-medium text-secondary-800 hover:text-primary-600 hover:bg-slate-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Opiniones
            </Link>
            <Link
              href="/#contacto"
              className="block px-3 py-3 text-base font-medium text-secondary-800 hover:text-primary-600 hover:bg-slate-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Contacto
            </Link>
            <Link
              href="/signup"
              className="block px-3 py-3 text-base font-medium text-secondary-800 hover:text-primary-600 hover:bg-slate-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Registrarse
            </Link>
            <Link
              href="/login"
              className="block px-3 py-3 text-base font-medium text-secondary-800 hover:text-primary-600 hover:bg-slate-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Iniciar Sesión
            </Link>
            {isAuthenticated && (
              <Link
                href="/citas"
                className="block px-3 py-3 text-base font-medium text-secondary-800 hover:text-primary-600 hover:bg-slate-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Mis Citas
              </Link>
            )}
            <div className="pt-4 px-3">
              <Link
                href="/agendar"
                className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-md"
              >
                <Phone className="w-5 h-5" />
                Agendar Cita
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
