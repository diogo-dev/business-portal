"use client";

import { useEffect, useState, useRef } from 'react';
import styles from './EditPostModal.module.css';
import { patchFormData } from '@/app/api';
import { toast } from 'sonner';
import { InputCard } from '../InputCard/InputCard';
import { TextareaCard } from '../TextareaCard/TextareaCard';

interface EditPostModalProps {
  post: {
    id: string;
    title: string;
    content: string;
    summary: string;
    coverImageUrl: string;
  }
  onSuccess: () => void;
  onClose: () => void;
}

export function EditPostModal({ post, onClose, onSuccess }: EditPostModalProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load post data into state when modal opens
    setTitle(post.title);
    setSummary(post.summary);
    setContent(post.content);
    setImagePreview(post.coverImageUrl);
  }, [post]);

  useEffect(() => {
    // Prevent scrolling of body and html when the modal is open
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyPosition = document.body.style.position;
    
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'relative';
    
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.position = originalBodyPosition;
    };
  }, []);

  const handleOnClose = () => {
    if (isSuccess) {
      onSuccess();
    }
    onClose();
  }

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to edit a post');
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('summary', summary);
      formData.append('content', content);
      
      if (imageFile) {
        formData.append('file', imageFile);
      }

      const response = await patchFormData(`/post/${post.id}`, formData, token);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || `Error updating post`);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setIsSuccess(true);
      toast.success('Post updated successfully!');

    } catch (error: any) {
      console.error('Error updating post:', error);
      toast.error(error.message || 'An unexpected error occurred while updating the post');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOnClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} onWheel={(e) => e.stopPropagation()}>
        <div className={`${styles.modalHeader} ${isSuccess ? styles.success : ''}`}>
          <div className={styles.headerContent}>
            <h2 className={styles.modalTitle}>
              {isSuccess ? 'Post Updated!' : 'Edit Post'}
            </h2>
            {isSuccess && (
              <svg 
                className={styles.successCheck}
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  fill="none"
                  className={styles.checkCircle}
                />
                <path 
                  d="M8 12L11 15L16 9" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={styles.checkMark}
                />
              </svg>
            )}
          </div>
          <button onClick={handleOnClose} className={styles.closeButton} aria-label="Fechar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.modalContent}>
          {/* Image Section with Edit Icon */}
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Cover" 
                  className={styles.coverImage}
                />
              )}
              <button 
                className={styles.editImageButton}
                onClick={handleImageClick}
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89783 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className={styles.hiddenInput}
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Title and Summary */}
          <div className={styles.inputSection}>
            <InputCard
              title="Post Title"
              inputType="text"
              placeholder="Enter the title of your post"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.inputSection}>
            <InputCard
              title="Post Summary"
              inputType="text"
              placeholder="Enter a brief summary of your post"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className={styles.inputSection}>
            <TextareaCard 
              title="Post Content"
              placeholder="Write the content of your post here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className={styles.buttonContainer}>
            <button 
              type="button"
              className={styles.cancelButton}
              onClick={handleOnClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}