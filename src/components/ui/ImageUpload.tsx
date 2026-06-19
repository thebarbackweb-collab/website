import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, X, Loader } from 'lucide-react';
import { uploadImage } from '../../services/cloudinary';
import type { ImageType } from '../../services/cloudinary';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  imageType: ImageType;
  label: string;
  subLabel?: string;
  value?: string;
  onUploadSuccess: (url: string) => void;
  onRemove?: () => void;
  className?: string;
  isGallery?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  imageType, 
  label, 
  subLabel = "JPG, PNG, WEBP. Max 5MB.", 
  value, 
  onUploadSuccess,
  onRemove,
  className = '',
  isGallery = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when value prop changes (e.g. initial load)
  React.useEffect(() => {
    if (value !== undefined) {
      setPreview(value);
    }
  }, [value]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Invalid file type. Only JPG, PNG, and WEBP are allowed.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File is too large. Maximum size is 5MB.";
    }
    return null;
  };

  const processFile = async (file: File) => {
    setError(null);
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Set local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    setIsUploading(true);
    setProgress(0);

    try {
      const url = await uploadImage(file, imageType, (p) => setProgress(p));
      onUploadSuccess(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(value || null); // Revert preview on failure
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [imageType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (!preview && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (onRemove) onRemove();
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div 
        className={`${styles.dropzone} ${isDragging ? styles.active : ''} ${preview ? styles.hasPreview : ''} ${isGallery ? styles.galleryDropzone : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className={styles.fileInput} 
          accept=".jpg,.jpeg,.png,.webp"
        />

        {preview ? (
          <div className={`${styles.previewContainer} ${isGallery ? styles.galleryPreview : ''}`}>
            <img src={preview} alt="Upload preview" className={styles.previewImage} />
            
            {isUploading ? (
              <div className={styles.overlay} style={{ opacity: 1, flexDirection: 'column', gap: '1rem' }}>
                <Loader className="animate-spin text-gold" size={32} />
                <span className="text-white font-medium">{progress}% Uploading...</span>
              </div>
            ) : (
              <div className={styles.overlay}>
                <button className={styles.removeButton} onClick={handleRemove} type="button">
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <UploadCloud size={40} className={styles.icon} />
            <div className={styles.text}>{label}</div>
            {!isGallery && <div className={styles.subtext}>{subLabel}</div>}
          </>
        )}
      </div>

      {isUploading && !preview && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          </div>
          <div className={styles.progressText}>
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default ImageUpload;
