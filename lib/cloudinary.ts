'use server';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a File to Cloudinary and return an optimized URL.
 * Uses f_auto,q_auto for automatic format and quality optimization.
 */
export async function uploadImage(
    file: File,
    folder: string = 'portfolio-engine'
): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                transformation: [{ fetch_format: 'auto', quality: 'auto' }],
            },
            (error, result) => {
                if (error || !result) {
                    const errMsg = error?.message || 'Cloudinary upload failed';
                    console.error('Cloudinary upload error:', error);
                    reject(new Error(errMsg));
                } else {
                    resolve(result.secure_url);
                }
            }
        );
        uploadStream.end(buffer);
    });
}

/**
 * Generate an optimized Cloudinary delivery URL from a public_id.
 */
export async function getOptimizedUrl(publicId: string): Promise<string> {
    return cloudinary.url(publicId, {
        fetch_format: 'auto',
        quality: 'auto',
        secure: true,
    });
}
