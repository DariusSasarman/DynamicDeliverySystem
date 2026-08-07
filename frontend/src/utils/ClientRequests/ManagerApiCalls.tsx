
export async function getAssignedCouriers(_authToken: string)
{
    const response = await fetch("/api/manager/get-assigned-couriers", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${_authToken}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch assigned couriers");
    }

    return response.json();
}

export async function getPickedUpPackages(_authToken: string)
{
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [ {id : 124}, {id : 123}];
}

export async function getPickUpRequests(_authToken: string)
{
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [ {id : 125}, {id : 126}];
}

export async function AssignPackage(_packageId: number, _courierEmail: string) {
    await new Promise((resolve) => setTimeout(resolve, 50));
}

export async function getComplaintsList(_authToken: string)
{
    await new Promise((resolve) => setTimeout(resolve, 50));
      return [
    {
      id: 1,
      packageId: 1042,
      deliveredOn: "2026-07-18",
      courierEmail: "andrei.pop@delivery.com",
      complaintText:
        "Package was left outside the building instead of handed to the recipient as requested.",
    },
    {
      id: 2,
      packageId: 987,
      deliveredOn: "2026-07-19",
      courierEmail: "maria.ionescu@delivery.com",
      complaintText:
        "Box arrived visibly damaged on one corner; contents (ceramic mug) were broken.",
    },];
}

export async function resolveComplaint(_authToken: string, _complaintId: number, _replyText: string)
{

}

export async function sendInvoice(_clientEmail: string, _text: string)
{

}


export async function createManagerAccount(ownerAuthToken: string, email: string, password: string, mainLocation: [number, number] | null) {
    const response = await fetch("/api/auth/manager", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ownerAuthToken}`,
        },
        body: JSON.stringify({ email, password, mainLocation }),
    });

    if (!response.ok) {
        throw new Error("Failed to create manager account");
    }

    return response.json();
}

export async function createDeliveryAccount(ownerAuthToken: string, email: string, password: string, responsibleManagerEmail: string) {
    const response = await fetch("/api/auth/delivery", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ownerAuthToken}`,
        },
        body: JSON.stringify({ email, password, responsibleManagerEmail }),
    });

    if (!response.ok) {
        throw new Error("Failed to create delivery account");
    }

    return response.json();
}