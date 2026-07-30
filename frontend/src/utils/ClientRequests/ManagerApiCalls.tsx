
export async function getAssignedCouriers(managerEmail)
{
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [
        {email : "gigel@gmail.com", pos:[15,15]},
        {email : "marcel@gmail.com", pos:[15.2,15.2]},
    ];
}

export async function getPickedUpPackages(managerEmail)
{
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [ {id : 124}, {id : 123}];
}

export async function getPickUpRequests(managerEmail)
{
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [ {id : 125}, {id : 126}];
}

export async function AssignPackage(packageId, courierEmail) {
    await new Promise((resolve) => setTimeout(resolve, 50));
}

export async function getComplaintsList(managerEmail)
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

export async function resolveComplaint(managerEmail, complaintId, replyText)
{

}

export async function sendInvoice(clientEmail, text)
{

}

export async function createOfficialAccount(managerEmail, newEmail, password, type, aditionalInformation)
{
    
}