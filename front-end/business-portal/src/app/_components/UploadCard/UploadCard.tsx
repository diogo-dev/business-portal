"use client";

import { useRef, useState } from 'react';
import styles from './UploadCard.module.css';
import { IoTrashBin } from "react-icons/io5";
import { IoCheckmarkSharp } from "react-icons/io5";

// Validation settings
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB em bytes

interface UploadCardProps {
  onFileChange?: (file: File | null) => void;
}

export function UploadCard({ onFileChange }: UploadCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const validateAndSetFile = (file: File) => {
    // Clear previous error and file name
    setError(null);
    setFileName(null);

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('File type not allowed. Use JPEG, PNG, or WEBP.');
      onFileChange?.(null);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds the limit: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      onFileChange?.(null);
      return;
    }

    setFileName(file.name);
    onFileChange?.(file);
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName(null);
    setError(null);
    onFileChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  return (
    <div
      className={`${styles.uploadCard} ${isDragging ? styles.dragging : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />
      
      <div className={styles.cardIcon}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
        </svg>
      </div>
  
      {isDragging ? <h3 className={styles.cardTitle}>Drop Here</h3> : <h3 className={styles.cardTitle}>Upload Image</h3>}
      <p className={styles.cardDescription}>
        Upload a cover image for your post
      </p>

      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>⚠️ {error}</p>
        </div>
      )}

      {fileName && (
        <div className={styles.fileNameContainer}>
          <p className={styles.fileName}><IoCheckmarkSharp /> {fileName}</p>
          <button 
            className={styles.removeButton}
            onClick={handleRemoveFile}
            aria-label="Remove file"
          >
            <IoTrashBin />
          </button>
        </div>
      )}
    </div>
  );
}