import styles from './DeletePostModal.module.css';
import { useEffect, useState } from 'react';
import { del } from '@/app/api';
import { toast } from 'sonner';

interface DeletePostModalProps {
  postId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeletePostModal({ postId, onClose, onSuccess }: DeletePostModalProps) {

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

     try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to delete a post');
        setIsLoading(false);
        return;
      }

      const response = await del(`/post/${postId}`, token);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Error deleting post');
        setIsLoading(false);
        return;
      }

      // Success
      setIsLoading(false);
      setIsSuccess(true);
      toast.success('Post deleted successfully!');
      

    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast.error(error.message || 'An unexpected error occurred');
      setIsLoading(false);
      setIsSuccess(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={handleOnClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <button onClick={handleOnClose} className={styles.closeButton} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className={styles.header}>
            <div className={`${styles.iconContainer} ${isSuccess ? styles.success : ''}`}>
              {isSuccess ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.checkIcon}>
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12L11 14L15 10" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.checkmark}/>
                </svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <h2 className={styles.title}>Delete Post</h2>
            {/* <p className={styles.description}>
              
            </p> */}
          </div>

          {!isSuccess && (
            <div className={styles.warningBox}>
              <div className={styles.warningIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.warningContent}>
                <h3 className={styles.warningTitle}>Warning!</h3>
                <ul className={styles.warningList}>
                  <li>This action cannot be undone</li>
                </ul>
              </div>
            </div>
          )}

          <div className={styles.buttonsContainer}>
            <button 
              onClick={handleSubmit} 
              className={styles.deleteButton}
              disabled={isLoading || isSuccess}
            >
              {isLoading ? (
                <>
                  <div className={styles.spinner}></div>
                  Deleting...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5H5H17M7 5V3C7 2.46957 7.21071 1.96086 7.58579 1.58579C7.96086 1.21071 8.46957 1 9 1H11C11.5304 1 12.0391 1.21071 12.4142 1.58579C12.7893 1.96086 13 2.46957 13 3V5M15 5V17C15 17.5304 14.7893 18.0391 14.4142 18.4142C14.0391 18.7893 13.5304 19 13 19H7C6.46957 19 5.96086 18.7893 5.58579 18.4142C5.21071 18.0391 5 17.5304 5 17V5H15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Delete Post
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

}