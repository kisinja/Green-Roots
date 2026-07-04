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

export async function uploadProductImage(
  buffer: Buffer,
  folder = "mkulima-supply-store/products"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          {
            width: 1200,
            height: 1200,
            crop: "limit",
          },
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },
      (err, result) => {
        if (err || !result) {
          reject(err ?? new Error("Upload failed"));
          return;
        }

        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}