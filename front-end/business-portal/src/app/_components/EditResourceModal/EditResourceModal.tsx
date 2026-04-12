import { useRef } from 'react';
import Image from 'next/image';
import styles from './EditResourceModal.module.css';

interface EditResourceModalProps {
  title: string;
  isLoading: boolean;
  isSuccess: boolean;
  successLabel?: string;
  imagePreview?: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onImageChange?: (file: File) => void;
  children: React.ReactNode; 
}

export default function EditResourceModal({
  title,
  isLoading,
  isSuccess,
  successLabel,
  imagePreview,
  onClose,
  onSubmit,
  onImageChange,
  children,
}: EditResourceModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageChange) onImageChange(file);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} onWheel={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className={`${styles.modalHeader} ${isSuccess ? styles.success : ''}`}>
          <div className={styles.headerContent}>
            <h2 className={styles.modalTitle}>
              {isSuccess ? (successLabel ?? `${title} Updated!`) : `Edit ${title}`}
            </h2>
            {isSuccess && (
              <svg className={styles.successCheck} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" className={styles.checkCircle}/>
                <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.checkMark}/>
              </svg>
            )}
          </div>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.modalContent}>
          {/* Image (optional) */}
          {onImageChange && (
            <div className={styles.imageSection}>
              <div className={styles.imageContainer}>
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt="Cover"
                    className={styles.coverImage}
                    fill
                    unoptimized
                    sizes="100vw"
                  />
                )}
                <button className={styles.editImageButton} onClick={() => fileInputRef.current?.click()} type="button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89783 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className={styles.hiddenInput} onChange={handleFileChange}/>
              </div>
            </div>
          )}

          {/* Specific Fields of each modal */}
          {children}

          {/* Buttons */}
          <div className={styles.buttonContainer}>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} onClick={onSubmit} disabled={isLoading || isSuccess}>
              {isLoading ? 'Updating...' : `Update ${title}`}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}