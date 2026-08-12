import { throwIfNotOk } from "./apiError";

export async function getInvoiceCount(authToken: string) {
  const response = await fetch("/api/invoice/count", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  await throwIfNotOk(response, "Failed to fetch invoice count");
  return response.json();
}

export async function getInvoiceList(authToken: string) {
  const response = await fetch("/api/invoice/list", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  await throwIfNotOk(response, "Failed to fetch invoice list");
  return response.json();
}

export async function confirmInvoice(authToken: string, invoiceId: number) {
  const response = await fetch("/api/invoice/confirm", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `invoiceId=${invoiceId}`,
  });

  await throwIfNotOk(response, "Failed to confirm invoice");
}
