// lib/receipt/upload.ts

import { put } from '@vercel/blob';

export async function uploadReceipt(
    buffer: Buffer,
    receiptNumber: string
): Promise<string> {
    const blob = await put(
        `receipts/${receiptNumber}.pdf`,
        buffer,
        {
            access: 'public',
            contentType: 'application/pdf',
            addRandomSuffix: false,
        }
    );

    return blob.url;
}