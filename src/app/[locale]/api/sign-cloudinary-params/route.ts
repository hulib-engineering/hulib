import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

import { Env } from '@/libs/Env.mjs';
import { BillUploadValidation } from '@/validations/EventRegistrationValidation';

cloudinary.config({
  cloud_name: Env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: Env.CLOUDINARY_API_KEY,
  api_secret: Env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const json = await request.json();
  const parse = BillUploadValidation.safeParse(json);

  if (!parse.success) {
    return NextResponse.json(parse.error.format(), { status: 422 });
  }

  const { transferBill } = parse.data;

  try {
    // Upload the image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(
      transferBill ?? '',
      {
        upload_preset: Env.NEXT_PUBLIC_UPLOAD_PRESET, // Set this up in your Cloudinary settings
      },
    );

    // Send the uploaded image URL back to the frontend
    return NextResponse.json({ imageURL: uploadResponse.secure_url });
  } catch (error) {
    // Handle any errors that may occur during the upload process
    console.error('Error uploading image:', error);
    return NextResponse.json({
      error: 'Something went wrong during image upload',
    });
  }
}
