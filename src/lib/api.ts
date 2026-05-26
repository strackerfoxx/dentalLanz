import { Business, Service } from "./types";
import { mockBusiness, mockServices } from "./mock-data";

export async function getBusiness(): Promise<Business> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const businessId = process.env.NEXT_PUBLIC_BUSINESS_ID;

  if (!apiUrl || !businessId) {
    console.warn("API URL or Business ID missing, falling back to mock data for Business.");
    return mockBusiness;
  }

  try {
    const res = await fetch(`${apiUrl}/business/get-business-by-id-client?businessId=${businessId}`, {
      // Revalidate every hour, or adjust as needed. Using Next.js fetch cache.
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch business data");
    }

    const data: Business = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching business data:", error);
    return mockBusiness; // Fallback
  }
}

export async function getServices(): Promise<{ services: Service[] }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const businessId = process.env.NEXT_PUBLIC_BUSINESS_ID;

  if (!apiUrl || !businessId) {
    console.warn("API URL or Business ID missing, falling back to mock data for Services.");
    return mockServices;
  }

  try {
    const res = await fetch(`${apiUrl}/service/get-services-client?businessId=${businessId}`, {
      next: { revalidate: 3600 },
    });


    if (!res.ok) {
      throw new Error("Failed to fetch services data");
    }

    const data: { services: Service[] } = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching services data:", error);
    return mockServices; // Fallback
  }
}
