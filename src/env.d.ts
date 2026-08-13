declare namespace NodeJS {
  interface ProcessEnv {
    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: string;

    // Turso
    TURSO_DATABASE_URL: string;
    TURSO_AUTH_TOKEN?: string;

    // Cloudinary
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  }
}

export {};
