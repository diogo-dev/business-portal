"use client";

import { useState } from 'react';
import { InputCard } from '../InputCard/InputCard';
import { UploadCard } from '../UploadCard/UploadCard';
import styles from './PostForm.module.css';
import { TextareaCard } from '../TextareaCard/TextareaCard';
import { postFormData } from '@/app/api';
import { toast } from 'sonner';

interface PostFormProps {
  isLoading: boolean;
  isSuccess: boolean;
  setIsLoading: (loading: boolean) => void;
  setIsSuccess: (success: boolean) => void;
  onSuccess?: () => void;
}

export function PostForm({ isLoading, isSuccess, setIsLoading, setIsSuccess, onSuccess }: PostFormProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setIsSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('summary', summary);
      formData.append('content', content);
      
      if (imageFile) {
        formData.append('file', imageFile);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to create a post');
        setIsLoading(false);
        return;
      }

      const response = await postFormData('/post', formData, token);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Error creating post');
        setIsLoading(false);
        return;
      }
      
      // Sucesso!
      setIsLoading(false);
      setIsSuccess(true);
      toast.success('Post created successfully!');
      
      // Limpar formulário
      setTitle('');
      setSummary('');
      setContent('');
      setImageFile(null);
      
      // Após 2 segundos, resetar e mudar de tab
      setTimeout(() => {
        setIsSuccess(false);
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
      
    } catch (error: any) {
      console.error('Error submitting post:', error);
      toast.error(error.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  }


  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Creating your post...</p>
        </div>
      )}

      {/* Success Overlay */}
      {isSuccess && (
        <div className={styles.successOverlay}>
          <svg 
            className={styles.successCheckLarge}
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
            />
            <path 
              d="M8 12L11 15L16 9" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <p className={styles.successText}>Post created successfully!</p>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.section}>
          <UploadCard onFileChange={setImageFile} />
        </div>

        <div className={styles.titleAndSummary}>
          <InputCard
            title="Post Title"
            inputType="text"
            placeholder="Enter the title of your post"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <InputCard
            title="Post Summary"
            inputType="text"
            placeholder="Enter a brief summary of your post"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        <div className={styles.section}>
          <TextareaCard 
            title="Post Content"
            placeholder="Write the content of your post here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className={styles.buttonContainer}>
            <button 
              type="submit"
              className={styles.submitButton}
              onClick={handleSubmit}
            >
              Create Post
            </button>
          </div>
      </div>
    </>
  );

}
