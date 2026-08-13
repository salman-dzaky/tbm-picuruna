'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, X, ImageIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

type CoverUploadProps = {
  coverUrl: string;
  coverPublicId: string;
  onUpload: (url: string, publicId: string) => void;
  onRemove: () => void;
};

export function CoverUpload({
  coverUrl,
  coverPublicId,
  onUpload,
  onRemove,
}: CoverUploadProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        Sampul Buku
      </label>

      {coverUrl ? (
        /* Preview uploaded cover */
        <div className="relative inline-block">
          <img
            src={coverUrl}
            alt="Sampul buku"
            className="h-40 w-28 rounded-lg border border-border object-cover"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm transition-transform hover:scale-110 cursor-pointer"
            aria-label="Hapus sampul"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          {/* Hidden inputs to pass data with the form */}
          <input type="hidden" name="coverUrl" value={coverUrl} />
          <input type="hidden" name="coverPublicId" value={coverPublicId} />
        </div>
      ) : (
        /* Upload button */
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{
            sources: ['local', 'url', 'camera'],
            multiple: false,
            maxFiles: 1,
            maxFileSize: 2_000_000, // 2MB
            folder: 'tbm-picuruna/covers',
            resourceType: 'image',
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
            cropping: true,
            croppingAspectRatio: 0.75, // 3:4 aspect ratio
            croppingShowDimensions: true,
            croppingDefaultSelectionRatio: 0.75,
          }}
          onSuccess={(result, { widget }) => {
            if (
              typeof result?.info === 'object' &&
              result.info &&
              'public_id' in result.info
            ) {
              onUpload(
                result.info.secure_url as string,
                result.info.public_id as string
              );
            }
            widget.close();
          }}
          onError={(error) => {
            console.error('Upload error:', error);
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className={cn(
                'flex h-40 w-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary transition-colors hover:border-primary hover:bg-accent'
              )}
            >
              <ImagePlus className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Upload</span>
            </button>
          )}
        </CldUploadWidget>
      )}

      <p className="text-xs text-muted-foreground leading-relaxed">
        Format: JPG, PNG, WebP. Maks. 2MB. <br />
        Rasio ideal: <strong>3:4</strong> (Misal: 600x800px). <br />
        <em>Anda dapat memotong gambar langsung setelah memilih file.</em>
      </p>
    </div>
  );
}
