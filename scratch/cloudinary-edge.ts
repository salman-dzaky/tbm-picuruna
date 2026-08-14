import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';

// ============================================================
// CLOUDINARY HELPER (EDGE COMPATIBLE)
// ============================================================

async function deleteCloudinaryImage(publicId: string) {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) return;

    const timestamp = Math.floor(Date.now() / 1000).toString();
    
    // Generate signature payload: "public_id=<publicId>&timestamp=<timestamp><api_secret>"
    // Note: invalidate=true must also be signed if we pass it, but for simplicity we just sign public_id & timestamp.
    // Actually, Cloudinary requires all params to be alphabetically sorted before signing.
    const payload = `invalidate=true&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    
    // Create SHA-1 signature using Web Crypto API (Edge compatible)
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp);
    formData.append('invalidate', 'true');
    formData.append('api_key', apiKey);
    formData.append('signature', signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('Cloudinary API error:', await response.text());
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
}
