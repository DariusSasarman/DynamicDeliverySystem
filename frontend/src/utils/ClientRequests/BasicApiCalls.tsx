
export async function getPackageClientList(email: String) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return [{ id: 123, pos: [10, 3] }, {id : 111, pos: [6,7]}];
}

export async function getDeliveredPackageClientList(email: String) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return [{ id: 124, pos: [9, 3] }, {id : 121, pos: [6,9]}];
}

export async function sendDeliveryConfirmation(packageId,deliveryCode)
{
  await new Promise((resolve) => setTimeout(resolve, 50));
  return true;
}

export async function sendPickupRequest(pickUpDate, receiverEmail : String, senderEmail : string)
{
  await new Promise((resolve) => setTimeout(resolve, 50));
  return true;
}

export async function getSchedule(email) {
  await new Promise((resolve) => setTimeout(resolve, 50));

  return {
    phoneNumber: "07yeah",
    schedule: [
      {
        country : "Country",
        county : "county",
        city : "city",
        street: "street",
        number : "16",
        from: 8,
        until: 16,
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      },
      {
        country : "Country",
        county : "county",
        city : "city",
        street: "street2",
        number : "163",
        from: 16,
        until: 20,
        days: ["Mon", "Wed"],
      },
    ],
  };
}

export async function saveSchedule(email,schedule)
{

}

export async function sendComplaint(email, deliveryID, text)
{

}