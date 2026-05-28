"use client";
import { useState, useEffect } from "react";
import { getAvailableSlots } from "@/lib/availableSlots";
import { Business } from "@/lib/types";

interface ScheduleProps {
  date: string;
  servicesSelected: string[];
  hour: string;
  setHour: (hour: string) => void;
  userId?: string;
  business: Business;
  excludeAppointmentId?: string;
}

export default function Schedule({ date, servicesSelected, hour, setHour, userId, business, excludeAppointmentId = undefined }: ScheduleProps) {
  const [slots, setSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchSlots() {
      if (!date || servicesSelected.length === 0) {
        setSlots([]);
        return;
      }
      setIsLoading(true);
      const availableSlots = await getAvailableSlots({ date, servicesSelected, business, userId, excludeAppointmentId });
      if (mounted) {
        setSlots(availableSlots);
        setIsLoading(false);
      }
    }
    fetchSlots();

    return () => {
      mounted = false;
    };
  }, [servicesSelected, date, userId, business, excludeAppointmentId]);

  if (!date || servicesSelected.length === 0) {
    return <div className="text-sm text-slate-500">Selecciona al menos un tratamiento y una fecha.</div>;
  }

  if (!isLoading && slots.length === 0) {
    return <div className="text-sm text-slate-500">No hay horarios disponibles para esta fecha.</div>;
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
      {isLoading ? (
        <div className="col-span-full flex justify-center py-4">
           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        slots?.map((time) => (
          <button
            key={time}
            onClick={(e) => {
                e.preventDefault();
                setHour(time);
            }}
            type="button"
            className={`py-2 px-3 border rounded-lg font-medium text-sm transition-colors cursor-pointer
              ${hour === time
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-slate-700 border-slate-300 hover:border-primary-500 hover:bg-primary-50"}`}
          >
            {time}
          </button>
        ))
      )}
    </div>
  );
}
