import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dental Lanz | Odontología Especializada en CDMX",
  description: "Clínica dental en Prado Coapa, CDMX. Especialistas en ortodoncia, blanqueamiento y tratamientos dentales integrales. Agenda tu cita hoy. Calificación 5.0 en Google.",
};

import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <AuthProvider>
          {children}
          <ToastContainer position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
