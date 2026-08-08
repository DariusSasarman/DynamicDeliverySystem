export async function getInvoiceCount(authToken: String) {
  const response = await fetch("/api/invoice/count", {
    headers: {
      "Authorization": `Bearer ${authToken}`
    }
  });
  return response.json();
}

export async function getInvoiceList(authToken: string) {
  const response = await fetch("/api/invoice/list", {
    headers: {
      "Authorization": `Bearer ${authToken}`
    }
  });
  return response.json();
}

export async function confirmInvoice(authToken: string, invoiceId: number) {
  const response = await fetch("/api/invoice/confirm", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `invoiceId=${invoiceId}`
  });
  return response.json();
}