const BASE_URL = "https://api.intasend.com/api/v1/payment/status/";

export async function verifyPayment(invoiceId: string) {
    const secretKey = process.env.INTASEND_SECRET_KEY;

    if (!secretKey) {
        throw new Error("INTASEND_SECRET_KEY missing");
    }

    const response = await fetch(`${BASE_URL}${invoiceId}/`, {
        headers: {
            Authorization: `Bearer ${secretKey}`,
            Accept: "application/json",
        },
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Failed to verify payment");
    }

    return data;
}