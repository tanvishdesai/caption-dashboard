import { ID, storage, appwriteConfig } from './appwrite';

/**
 * Converts a base64 image to a File object
 */
export const base64ToFile = (base64String: string, filename: string): File => {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};

/**
 * Uploads an image to Appwrite Storage
 */
export const uploadImage = async (image: File | string): Promise<string> => {
  try {
    let file: File;
    
    if (typeof image === 'string' && image.startsWith('data:')) {
      // It's a base64 image
      file = base64ToFile(image, `image-${Date.now()}.png`);
    } else if (typeof image === 'string') {
      // It's already a URL, just return it
      return image;
    } else {
      // It's already a File
      file = image;
    }
    
    // Upload to Appwrite storage
    const response = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    
    // Generate and return file URL
    const fileUrl = storage.getFileView(
      appwriteConfig.storageId,
      response.$id
    );
    
    return fileUrl.href;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Deletes an image from Appwrite Storage
 */
export const deleteImage = async (fileId: string): Promise<void> => {
  try {
    if (!fileId) return;
    
    // Extract file ID from URL if it's a URL
    const id = fileId.includes('/') 
      ? fileId.substring(fileId.lastIndexOf('/') + 1) 
      : fileId;
    
    await storage.deleteFile(appwriteConfig.storageId, id);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw here, as this is likely a cleanup operation
  }
}; 