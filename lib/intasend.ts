

const INTASEND_URL =
    "https://api.intasend.com/api/v1/payment/mpesa-stk-push/";

export async function sendStkPush({
    phone,
    amount,
    orderId,
    email,
}: {
    phone: string;
    amount: number;
    orderId: string;
    email: string;
}) {
    const response = await fetch(INTASEND_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.INTASEND_SECRET_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            phone_number: phone,
            amount,
            currency: "KES",
            api_ref: orderId,
            email,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.detail || "Failed to send STK Push");
    }

    return data;
}