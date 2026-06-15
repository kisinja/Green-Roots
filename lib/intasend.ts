const INTASEND_URL =
    "https://api.intasend.com/api/v1/payment/mpesa-stk-push/";

function normalizePhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("0")) {
        return `254${cleaned.slice(1)}`;
    }

    if (cleaned.startsWith("254")) {
        return cleaned;
    }

    throw new Error(
        "Invalid phone number. Use format 07XXXXXXXX or 2547XXXXXXXX."
    );
}

export async function sendStkPush({
    phone,
    amount,
    orderId,
    email,
}: {
    phone: string;
    amount: number | string;
    orderId: string;
    email: string;
}) {
    const secretKey = process.env.INTASEND_SECRET_KEY;

    if (!secretKey) {
        throw new Error("INTASEND_SECRET_KEY is missing");
    }

    const payload = {
        phone_number: normalizePhone(phone),
        amount: Number(amount),
        currency: "KES",
        api_ref: orderId,
        email,
    };

    console.log("INTASEND REQUEST:", payload);

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 30000);

    try {
        const response = await fetch(INTASEND_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${secretKey}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
        });

        clearTimeout(timeout);

        let data: any;

        try {
            data = await response.json();
        } catch {
            data = {
                error: "IntaSend returned invalid JSON",
            };
        }

        console.log("INTASEND STATUS:", response.status);
        console.log(
            "INTASEND RESPONSE:",
            JSON.stringify(data, null, 2)
        );

        if (!response.ok) {
            const message =
                data?.detail ||
                data?.message ||
                data?.error ||
                JSON.stringify(data);

            throw new Error(message);
        }

        return data;
    } catch (error) {
        clearTimeout(timeout);

        if (error instanceof Error) {
            if (error.name === "AbortError") {
                throw new Error("IntaSend request timed out");
            }

            throw error;
        }

        throw new Error("Failed to send STK Push");
    }
}