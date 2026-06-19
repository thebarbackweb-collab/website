export type ImageType = 'profile' | 'cover' | 'gallery';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const uploadImage = (
  file: File, 
  imageType: ImageType,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
    if (!uploadPreset) {
      reject(new Error('Cloudinary upload preset is not configured in .env'));
      return;
    }

    let folder = '';
    switch (imageType) {
      case 'profile': folder = 'thebarback/profile-images'; break;
      case 'cover': folder = 'thebarback/cover-images'; break;
      case 'gallery': folder = 'thebarback/gallery'; break;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', UPLOAD_URL, true);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          onProgress(percentComplete);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          const urlParts = data.secure_url.split('/upload/');
          if (urlParts.length === 2) {
            resolve(`${urlParts[0]}/upload/f_auto,q_auto/${urlParts[1]}`);
          } else {
            resolve(data.secure_url);
          }
        } catch (err) {
          reject(new Error('Failed to parse Cloudinary response'));
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during upload'));
    };

    xhr.send(formData);
  });
};
