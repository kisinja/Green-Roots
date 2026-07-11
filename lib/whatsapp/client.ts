import axios from "axios";

import {
    SendDocumentOptions,
    SendTextOptions,
} from "./types";

import {
    WHATSAPP_BASE_URL,
} from "./constants";

import {
    normalizePhone,
} from "./utils";

const api = axios.create({

    baseURL: WHATSAPP_BASE_URL,

    headers: {

        "D360-API-KEY":
            process.env.WHATSAPP_API_KEY!,

        "Content-Type":
            "application/json",
    },
});

export async function sendText({
    to,
    body,
}: SendTextOptions) {

    const phone = normalizePhone(to);

    const response = await api.post(
        "/messages",
        {

            to: phone,

            type: "text",

            recipient_type: "individual",

            text: {
                body,
            },
        }
    );

    return response.data;
}

export async function sendDocument({
    to,
    url,
    filename,
    caption,
}: SendDocumentOptions) {

    const phone = normalizePhone(to);

    const response = await api.post(
        "/messages",
        {

            to: phone,

            type: "document",

            recipient_type: "individual",

            document: {

                link: url,

                filename,

                caption,
            },
        }
    );

    return response.data;
}