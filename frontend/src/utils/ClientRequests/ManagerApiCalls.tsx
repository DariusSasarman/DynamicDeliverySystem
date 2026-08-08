
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
    const response = await fetch("/api/manager/picked-up-packages", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${_authToken}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch picked up packages");
    }
    
    const ids: number[] = await response.json();

    return ids.map(id => ({ id }));
}

export async function getPickUpRequests(_authToken: string)
{
    const response = await fetch("/api/manager/pick-up-requests", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${_authToken}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch pickup requests");
    }
    
    const ids: number[] = await response.json();

    return ids.map(id => ({ id }));
}

export async function AssignPackage(_authToken: string, _packageId: number, _courierEmail: string) {
    const response = await fetch("/api/manager/assign-package", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${_authToken}`,
        },
        body: JSON.stringify({ packageId: _packageId, courierEmail: _courierEmail }),
    });

    if (!response.ok) {
        throw new Error("Failed to assign package");
    }

    return response.json();
}

export async function getComplaintsList(_authToken: string)
{
    const response = await fetch("/api/manager/get-complaints", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${_authToken}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch complaints list");
    }

    return response.json();
}

export async function resolveComplaint(_authToken: string, _complaintId: number, _replyText: string)
{
    const response = await fetch("/api/manager/resolve-complaint", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${_authToken}`,
        },
        body: JSON.stringify({ complaintId: _complaintId, replyText: _replyText }),
    });

    if (!response.ok) {
        throw new Error("Failed to resolve complaint");
    }

    return response.json();
}

export async function sendInvoice(_authToken: string, _clientEmail: string, _text: string)
{
    const response = await fetch("/api/manager/send-invoice", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${_authToken}`,
        },
        body: JSON.stringify({ clientEmail: _clientEmail, text: _text }),
    });

    if (!response.ok) {
        throw new Error("Failed to send invoice");
    }

    return response.json();
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