
export async function getAssignedCouriers(authToken)
{
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [
        {email : "gigel@gmail.com", pos:[15,15]},
        {email : "marcel@gmail.com", pos:[15.2,15.2]},
    ];
}

export async function getPickedUpPackages(authToken)
{
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [ {id : 124}, {id : 123}];
}

export async function getPickUpRequests(authToken)
{
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [ {id : 125}, {id : 126}];
}

export async function AssignPackage(packageId, courierEmail) {
    await new Promise((resolve) => setTimeout(resolve, 50));
}

export async function getComplaintsList(authToken)
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

export async function resolveComplaint(authToken, complaintId, replyText)
{

}

export async function sendInvoice(clientEmail, text)
{

}


export async function createManagerAccount(ownerAuthToken, email, password, mainLocation) {
    console.log("API: create manager account", { ownerAuthToken, email, password, mainLocation });
    await new Promise((resolve) => setTimeout(resolve, 50));
    return { success: true, mainLocation };
}

export async function createDeliveryAccount(ownerAuthToken, email, password, responsibleManagerEmail) {
    console.log("API: create delivery account", { ownerAuthToken, email, password, responsibleManagerEmail });
    await new Promise((resolve) => setTimeout(resolve, 50));
    return { success: true };
}