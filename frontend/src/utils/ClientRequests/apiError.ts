export async function throwIfNotOk(
  response: Response,
  fallbackMessage: string
): Promise<void> {
  if (response.ok) {
    return;
  }

  let message = fallbackMessage;
  try {
    const payload = await response.json();
    if (payload?.message) {
      message = payload.message;
    }
  } catch {
    try {
      const text = await response.text();
      if (text) {
        message = text;
      }
    } catch {
      // keep fallback
    }
  }

  throw new Error(message);
}
