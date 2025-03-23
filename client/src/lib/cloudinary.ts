const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = "pet-photos";

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "pets");
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    
    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }
    
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw error;
  }
};
