export async function getInvoiceCount(email: String) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return 2;
}

export async function getInvoiceList(email: string) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return [
    { id: 123, text: "Please define your schedule" }, 
    { id: 145, text: "A new package coming towards you" },
  ];
}

export async function confirmInvoice(invoiceId) {
  await new Promise((resolve) => setTimeout(resolve, 50));
}