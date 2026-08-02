
export async function getPackageClientList(authToken: String) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return [{ id: 123, pos: [10, 3] }, {id : 111, pos: [6,7]}];
}

export async function getDeliveredPackageClientList(authToken: String) {
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

export async function getSchedule(authToken) {
  await new Promise((resolve) => setTimeout(resolve, 50));

  return {
    phoneNumber: "07yeah",
    schedule: [
      {
        from: 8,
        until: 16,
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        position: [46.770439, 23.589722],
      },
      {
        from: 16,
        until: 20,
        days: ["Mon", "Wed"],
        position: [46.765, 23.595],
      },
    ],
  };
}

export async function saveSchedule(authToken,schedule)
{

}

export async function sendComplaint(authToken, deliveryID, text)
{

}