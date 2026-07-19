// FILE: src/components/ImageUpload.tsx

import React, { useRef, useState } from 'react';
import { User, Upload, X } from 'lucide-react';
import { fileToCompressedBase64 } from '../lib/resumeUtils';

interface ImageUploadProps {
  photo: string | null;
  onChange: (photo: string | null) => void;
}

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB raw upload cap, before compression

const ImageUpload: React.FC<ImageUploadProps> = ({ photo, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    setError(null);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Image is too large (max 8MB).');
      return;
    }

    setLoading(true);
    try {
      const dataUrl = await fileToCompressedBase64(file);
      onChange(dataUrl);
    } catch {
      setError('Could not process that image. Try another file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-300 overflow-hidden flex items-center justify-center shrink-0">
          {photo ? (
            <img src={photo} alt="Profile preview" className="w-full h-full object-cover" />
          ) : (
            <User className="w-7 h-7 text-gray-400" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              {loading ? 'Processing...' : photo ? 'Change photo' : 'Upload photo'}
            </button>
            {photo && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-md text-red-600 hover:bg-red-50 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <p className="text-xs text-gray-400">Stored locally in your browser. JPG/PNG, resized automatically.</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
