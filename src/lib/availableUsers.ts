import { BusinessUser } from "./types";

interface GetAvailableUsersParams {
  servicesSelected: string[];
  date: string;
  hour: string;
  businessId: string;
}

export async function getAvailableUsers({ servicesSelected, date, hour, businessId }: GetAvailableUsersParams) {
    if(!servicesSelected || servicesSelected.length === 0 || !date || !hour || !businessId) return {};

    const services = servicesSelected.map((serviceId: string) => ({ serviceId }));

    const usersData = {
        services,
        startTime: hour,
        date: date.split('T')[0],
        businessId: businessId
    };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointment/availability/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usersData)
        });

        if (!response.ok) {
            throw new Error("Error fetching users");
        }

        const data = await response.json();

        const usersByService = data.reduce((acc: Record<string, BusinessUser[]>, item: { serviceId?: string, availableUsers?: BusinessUser[] }) => {
            if (item?.serviceId) {
                acc[item.serviceId] = item.availableUsers ?? []
            }
            return acc
        }, {});

        return usersByService;
    } catch (error) {
        console.error(error);
        return {};
    }
}
