"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Phone, Mail, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function CrearCliente() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/client/self-create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          ...(formData.email && { email: formData.email }),
          businessId: process.env.NEXT_PUBLIC_BUSINESS_ID,
        }),
      });

      if (!res.ok) {
        throw new Error("No se pudo crear el cliente.");
      }

      // Redirigir a la pantalla de login para verificar el número
      router.push("/verificar-numero");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Ocurrió un error inesperado.");
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="grow flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
              <UserPlus className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-secondary-900">
              Crear Cuenta
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Regístrate para continuar. Después verificaremos tu número telefónico.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Nombre Completo *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 text-slate-900 sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                Número de Teléfono *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+52 55 1234 5678"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 text-slate-900 sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Correo Electrónico (Opcional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 text-slate-900 sm:text-sm transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.name || !formData.phone}
              className="cursor-pointer mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? "Creando..." : "Crear Cuenta"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
