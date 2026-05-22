import { Business, Service } from "./types";

export const mockBusiness: Business = {
    "id": "cmpggjdil0000gke8307knw4t",
    "name": "Dental Lanz",
    "address": "calz acoxpa 566-int 2, coapa, prado coapa, tlalpan, 14357 ciudad de méxico, cdmx",
    "email": "dental@gmail.com",
    "createdAt": "2026-05-22T05:06:44.732Z",
    "updatedAt": "2026-05-22T05:36:23.449Z",
    "phone": "5558019251",
    "plan": "ADVANCED",
    "businessHours": {
        "friday": {
            "open": "10:00",
            "close": "19:00",
            "closed": false
        },
        "monday": {
            "open": "10:00",
            "close": "19:00",
            "closed": false
        },
        "sunday": {
            "open": "00:00",
            "close": "00:00",
            "closed": true
        },
        "tuesday": {
            "open": "10:00",
            "close": "19:00",
            "closed": false
        },
        "saturday": {
            "open": "10:00",
            "close": "15:00",
            "closed": false
        },
        "thursday": {
            "open": "10:00",
            "close": "19:00",
            "closed": false
        },
        "wednesday": {
            "open": "10:00",
            "close": "19:00",
            "closed": false
        }
    },
    "specialDays": {},
    "defaultSlotInterval": 30,
    "deletedAt": null,
    "users": [
        {
            "id": "cmpggn6ao0001gkd0ky4xehob",
            "name": "Lanz - Dentista"
        }
    ]
};

export const mockServices: { services: Service[] } = {
    "services": [
        {
            "id": "cmpggw8v0000agkd0nzar8ehq",
            "name": "Ortodoncia Brackets Metalicos",
            "durationMin": 120,
            "price": 9000,
            "createdAt": "2026-05-22T05:16:45.606Z",
            "updatedAt": "2026-05-22T05:16:45.606Z",
            "description": "los brackets metálicos son pequeñas piezas de acero inoxidable o titanio que se adhieren a los dientes para corregir problemas de alineación y mordida",
            "imageUrl": null,
            "businessId": "cmpggjdil0000gke8307knw4t",
            "category": null,
            "cleaningTimeMin": 10,
            "isActive": true,
            "users": [
                {
                    "user": {
                        "id": "cmpggn6ao0001gkd0ky4xehob",
                        "name": "Lanz - Dentista"
                    }
                }
            ]
        },
        {
            "id": "cmpggxgac000egkd0ds97kdm7",
            "name": "Endodoncia (por diente)",
            "durationMin": 60,
            "price": 2800,
            "createdAt": "2026-05-22T05:17:41.888Z",
            "updatedAt": "2026-05-22T05:17:41.888Z",
            "description": "es un procedimiento dental que salva un diente dañado o infectado al extraer la pulpa (el nervio y los vasos sanguíneos) de su interior.",
            "imageUrl": null,
            "businessId": "cmpggjdil0000gke8307knw4t",
            "category": null,
            "cleaningTimeMin": 10,
            "isActive": true,
            "users": [
                {
                    "user": {
                        "id": "cmpggn6ao0001gkd0ky4xehob",
                        "name": "Lanz - Dentista"
                    }
                }
            ]
        },
        {
            "id": "cmpggz9fu000igkd0gkluh6it",
            "name": "Limpieza Dental",
            "durationMin": 30,
            "price": 900,
            "createdAt": "2026-05-22T05:19:06.322Z",
            "updatedAt": "2026-05-22T05:19:06.322Z",
            "description": "es un procedimiento médico preventivo que elimina el sarro y la placa bacteriana acumulados.",
            "imageUrl": null,
            "businessId": "cmpggjdil0000gke8307knw4t",
            "category": null,
            "cleaningTimeMin": 5,
            "isActive": true,
            "users": [
                {
                    "user": {
                        "id": "cmpggn6ao0001gkd0ky4xehob",
                        "name": "Lanz - Dentista"
                    }
                }
            ]
        },
        {
            "id": "cmpgh0uh7000mgkd09uw7imw2",
            "name": "Blanqueamiento Dental",
            "durationMin": 45,
            "price": 1100,
            "createdAt": "2026-05-22T05:20:20.247Z",
            "updatedAt": "2026-05-22T05:20:20.247Z",
            "description": "es un tratamiento estético no invasivo que aclara varios tonos del esmalte dental mediante agentes químicos",
            "imageUrl": null,
            "businessId": "cmpggjdil0000gke8307knw4t",
            "category": null,
            "cleaningTimeMin": 5,
            "isActive": true,
            "users": [
                {
                    "user": {
                        "id": "cmpggn6ao0001gkd0ky4xehob",
                        "name": "Lanz - Dentista"
                    }
                }
            ]
        }
    ]
};