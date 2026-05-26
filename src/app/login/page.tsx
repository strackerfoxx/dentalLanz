"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, KeyRound, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

import { toast } from "react-toastify";

export default function Login() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [phone, setPhone] = useState("+52");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // const createRecaptchaVerifier = async () => {
  //   if (typeof window === "undefined") return null;

  //   const win = window as typeof window & { recaptchaVerifier?: RecaptchaVerifier };
  //   if (win.recaptchaVerifier) {
  //     try {
  //       win.recaptchaVerifier.clear();
  //     } catch (error) {
  //       console.warn("No se pudo limpiar el reCAPTCHA anterior:", error);
  //     }
  //     win.recaptchaVerifier = undefined;
  //   }

  //   const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
  //     size: "normal"
  //   });

  //   await verifier.render();
  //   win.recaptchaVerifier = verifier;
  //   setRecaptchaVerifier(verifier);
  //   return verifier;
  // };

  // useEffect(() => {
  //   createRecaptchaVerifier();
  // }, []);

  // async function sendCode() {
  //   try {
  //     setIsLoading(true);
  //     setError("");
  //     const verifier = recaptchaVerifier ?? (await createRecaptchaVerifier());
  //     if (!verifier) {
  //       throw new Error("El reCAPTCHA no se cargó correctamente. Recarga la página e intenta nuevamente.");
  //     }

  //     const result = await signInWithPhoneNumber(
  //       auth,
  //       phone,
  //       verifier
  //     );

  //     setConfirmationResult(result);
  //     setStep(2);
  //   } catch (error: unknown) {
  //     console.error(error);
  //     if (error instanceof FirebaseError && error.code === "auth/invalid-app-credential") {
  //       await createRecaptchaVerifier();
  //     }
  //     setError(error instanceof Error ? error.message : "Hubo un error al enviar el código. Intenta nuevamente.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  // async function verifyCode() {
  //   if (!confirmationResult) return;
  //   try {
  //     setIsLoading(true);
  //     setError("");

  //     const result = await confirmationResult.confirm(code);
  //     const user = result.user;
  //     const idToken = await user.getIdToken();

  //     const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
  //     const res = await fetch(`${apiUrl}/client/login`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({
  //         idToken
  //       })
  //     });

  //     if (!res.ok) {
  //       throw new Error("Error en el inicio de sesión del lado del servidor.");
  //     }

  //     const data = await res.json();
  //     if (data.token && data.client) {
  //       login(data.token, data.client);
  //     }

  //     router.push("/");
  //   } catch (error: unknown) {
  //     console.error(error);
  //     setError(error instanceof Error ? error.message : "Código incorrecto o expirado.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  async function loginFunction() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/client/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone
        })
      });

      const data = await res.json();
      if (data.token && data.client) {
        login(data.token, data.client);
      }
      if(res.status === 404) {
        toast.error("Cliente no encontrado");
        return;
      }
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error en el inicio de sesión.");
      }
      toast.success(`Sesion iniciada con éxito.`);
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }catch (error) {
      console.error(error);
      toast.error("Error al iniciar sesión. Por favor, intenta de nuevo.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="grow flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
              <LogIn className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-secondary-900">
              {step === 1 ? "Iniciar Sesión" : "Verificar Número"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {step === 1
                ? "Ingresa tu número de teléfono para iniciar sesión."
                : `Hemos enviado un código SMS al ${phone}`
              }
            </p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

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
                  onClick={loginFunction}
                  disabled={isLoading || !phone}
                  className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? "Iniciando..." : "Iniciar Sesión"}
                </button>
              </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
