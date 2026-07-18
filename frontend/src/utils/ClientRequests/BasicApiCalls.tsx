
export async function getPackageClientList(email: String) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return [{ id: 123, pos: [10, 3] }, {id : 111, pos: [6,7]}];
}

export async function sendDeliveryConfirmation(packageId,deliveryCode)
{
  await new Promise((resolve) => setTimeout(resolve, 50));
  return true;
}

export async function sendPickupRequest(pickUpDate, receiverEmail : String)
{
  await new Promise((resolve) => setTimeout(resolve, 50));
  return true;
}

export async function getSchedule(email:String) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return [
    {
      "address": "Home",
      "from": 8,
      "until": 16,
      "days": ["Mon", "Tue", "Wed", "Thu", "Fri"]
    },
    {
      "address": "University",
      "from": 16,
      "until": 20,
      "days": ["Mon", "Wed"]
    }
  ];
}

export async function saveSchedule(email,schedule)
{

}