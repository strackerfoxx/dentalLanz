"use client";

import { useEffect, useState } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, KeyRound, ShieldCheck } from "lucide-react";

export default function PhoneAuth() {
  const [phone, setPhone] = useState("+525512345678");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const win = window as typeof window & { recaptchaVerifier?: RecaptchaVerifier };
      if (!win.recaptchaVerifier) {
        win.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "normal"
          }
        );

        win.recaptchaVerifier.render();
      }
    }
  }, []);

  async function sendCode() {
    try {
      setIsLoading(true);
      const win = window as typeof window & { recaptchaVerifier?: RecaptchaVerifier };
      const result = await signInWithPhoneNumber(
        auth,
        phone,
        win.recaptchaVerifier!
      );

      setConfirmationResult(result);
      setStep(2);
      alert("Código enviado");
    } catch (error) {
      console.error(error);
      alert("Hubo un error al enviar el código. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyCode() {
    if (!confirmationResult) return;
    try {
      setIsLoading(true);
      const result = await confirmationResult.confirm(code);
      const user = result.user;
      const idToken = await user.getIdToken();

      await fetch(`http://localhost:4000/api/client/confirm-client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone,
          idToken
        })
      });

      alert("Número verificado");
    } catch (error) {
      console.error(error);
      alert("Código incorrecto o expirado.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-secondary-900">
              {step === 1 ? "Iniciar Sesión" : "Verificar Número"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {step === 1
                ? "Ingresa tu número de teléfono para recibir un código de acceso."
                : `Hemos enviado un código SMS al ${phone}`
              }
            </p>
          </div>

          <div className="space-y-6">
            {step === 1 ? (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Número de Teléfono
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+52 55 1234 5678"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 text-slate-900 sm:text-sm transition-colors"
                  />
                </div>

                <div className="mt-6 flex justify-center">
                  <div id="recaptcha-container"></div>
                </div>

                <button
                  onClick={sendCode}
                  disabled={isLoading || !phone}
                  className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? "Enviando..." : "Enviar código"}
                </button>
              </div>
            ) : (
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-2">
                  Código de Verificación
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="123456"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 text-slate-900 sm:text-sm tracking-widest text-center transition-colors"
                    maxLength={6}
                  />
                </div>

                <button
                  onClick={verifyCode}
                  disabled={isLoading || code.length < 6}
                  className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? "Verificando..." : "Verificar código"}
                </button>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
                  >
                    Usar otro número
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
