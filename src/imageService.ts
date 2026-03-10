import type { ImageService } from './types.js';

// Storage Strategy: Images are compressed before storage to minimize localStorage usage.
// - Original files are limited to 2MB max upload size
// - Images are resized to max 800px width and compressed to JPEG at 70% quality
// - This typically reduces file size by 60-80% compared to original
// - With compression, users can store 15-25+ images within the 5-10MB localStorage quota
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

class ImageServiceImpl implements ImageService {
  validateFile(file: File): boolean {
    if (!file.type.startsWith('image/')) {
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      return false;
    }
    return true;
  }

  private compressImage(dataUrl: string, maxWidth = 800, quality = 0.7): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = dataUrl;
    });
  }

  readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const result = reader.result as string;
          const compressed = await this.compressImage(result);
          resolve(compressed);
        } catch (error) {
          reject(new Error('Failed to compress image: ' + String(error)));
        }
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });
  }
}

export const imageService = new ImageServiceImpl();
