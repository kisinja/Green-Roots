// lib/cloudinary.ts

import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
    buffer: Buffer,
    filename: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "products",
                public_id: filename.split(".")[0],
            },
            (error, result) => {
                if (error) return reject(error);

                resolve(result!.secure_url);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
}