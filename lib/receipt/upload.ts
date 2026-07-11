// lib/receipt/upload.ts

import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadReceipt(
    buffer: Buffer,
    receiptNumber: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw",
                folder: "receipts",
                public_id: `${receiptNumber}.pdf`,
                overwrite: true,
            },
            (error, result) => {
                if (error || !result) {
                    reject(error ?? new Error("Upload failed"));
                    return;
                }

                resolve(result.secure_url);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
}