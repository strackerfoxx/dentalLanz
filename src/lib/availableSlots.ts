import { Business } from "./types";
import { DateTime } from "luxon";

interface GetAvailableSlotsParams {
  date: string;
  servicesSelected: string[];
  business: Business;
  userId?: string;
  excludeAppointmentId?: string;
}

export async function getAvailableSlots({ date, servicesSelected, business, userId, excludeAppointmentId = undefined }: GetAvailableSlotsParams): Promise<string[]> {
  if (!date || servicesSelected.length === 0 || !business) return []

  const services = servicesSelected.map((service: string) => {
    if(userId){
      return {
        serviceId: service,
        userId: userId
      }
    }
    return {
      serviceId: service
    }
  })

  const data = {
    businessId: business.id,
    services,
    date: DateTime.fromJSDate(new Date(date), { zone: 'utc' }).toFormat('yyyy-MM-dd'),
    excludeAppointmentId,
    currentTime: DateTime.now().toISO(),
    timezone: DateTime.local().zoneName
  }

  console.log("Requesting available slots with data:", data);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointment/availability/slots`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });



    if (!response.ok) {
      throw new Error("Error fetching slots");
    }

    const validSlots = await response.json();
    console.log("Received available slots:", validSlots);
    return validSlots;

  } catch(error) {
    console.error(error);
    return [];
  }
}
