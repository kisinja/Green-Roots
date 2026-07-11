export interface SendTextOptions {
    to: string;
    body: string;
}

export interface SendDocumentOptions {
    to: string;
    url: string;
    filename: string;
    caption?: string;
}

export interface WhatsAppResponse {
    messages?: {
        id: string;
    }[];

    error?: {
        message: string;
        code: number;
    };
}