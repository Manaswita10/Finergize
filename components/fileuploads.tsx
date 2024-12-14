// components/FileUpload.tsx
import { useState } from 'react';
import { Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadFile, validateFile, MAX_FILE_SIZE } from '@/lib/utils/upload';

interface FileUploadProps {
  label: string;
  onChange: (fileUrl: string) => void;
  accept?: string;
  maxSize?: number;
}

export const FileUpload = ({ 
  label, 
  onChange, 
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSize = MAX_FILE_SIZE
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    try {
      setError(null);
      setIsUploading(true);
      
      // Validate file
      validateFile(file);

      // Upload file
      const fileUrl = await uploadFile(file);
      setUploadedFile(file.name);
      onChange(fileUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    onChange('');
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="file"
          className="hidden"
          id={`file-${label}`}
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleUpload(file);
            }
          }}
          disabled={isUploading}
        />
        
        {!uploadedFile ? (
          <label
            htmlFor={`file-${label}`}
            className={`flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md cursor-pointer hover:bg-gray-700 ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload className="h-4 w-4" />
            {isUploading ? 'Uploading...' : label}
          </label>
        ) : (
          <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-300">{uploadedFile}</span>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="text-xs text-gray-400">
        Maximum file size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
      </div>
    </div>
  );
};