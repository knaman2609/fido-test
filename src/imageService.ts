import type { ImageService } from './types.js';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

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

  readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });
  }
}

export const imageService = new ImageServiceImpl();
