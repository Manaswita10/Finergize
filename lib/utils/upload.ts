// lib/utils/upload.ts
export async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Upload failed');
      }
  
      const data = await response.json();
      return data.fileUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
  
  // Maximum file size in bytes (5MB)
  export const MAX_FILE_SIZE = 5 * 1024 * 1024;
  
  export function validateFile(file: File) {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 5MB limit');
    }
  
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf'
    ];
  
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed');
    }
  }