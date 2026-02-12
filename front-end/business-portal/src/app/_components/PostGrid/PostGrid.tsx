"use client";

import { useState } from 'react';
import styles from './PostGrid.module.css';
import { PostCard } from '../PostCard/PostCard';
import { patch, del } from '@/app/api';
import { toast } from 'sonner';
import { EditPostModal } from '../EditPostModal/EditPostModal';
import { DeletePostModal } from '../DeletePostModal/DeletePostModal';

interface PostGridProps {
  posts: {
    id: string;
    title: string;
    content: string;
    summary: string;
    coverImageUrl: string;
    status: string;
    createdAt: string;
    publishedAt?: string;
    updatedAt?: string;
  }[];

  postStatus: 'draft' | 'published' | 'archived';

  isLoading?: boolean;
  isSuccess?: boolean;
  setIsLoading?: (loading: boolean) => void | undefined;
  setIsSuccess?: (success: boolean) => void | undefined;
  fetchPosts?: () => void;
}

export function PostGrid({ 
  posts, 
  postStatus, 
  isLoading, 
  isSuccess,
  setIsLoading,
  setIsSuccess,
  fetchPosts
}: PostGridProps) {
  
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handlePostClick = (post: PostGridProps['posts'][0], e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPostId(post.id);
  };

  const handleGridClick = () => {
    setSelectedPostId(null);
  };

  const handlePublishOrArchive = async (postId: string, status: 'publish' | 'archive', e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    setIsLoading?.(true);
    setIsSuccess?.(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error(`You must be logged in to ${status} a post`);
        setIsLoading?.(false);
        return;
      };

      const response = await patch(`/post/${postId}/${status}`, undefined, token);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || `Error ${status}ing post`);
        setIsLoading?.(false);
        return;
      }
      if (response.ok) {
        setSelectedPostId(null);
      }

      // Success
      setIsLoading?.(false);
      setIsSuccess?.(true);
      toast.success(`Post ${status} successfully!`);

      setTimeout(() => {
        setIsSuccess?.(false);
        fetchPosts?.();
      }, 2000);

    } catch (error: any) {
      console.error(`Error ${status} post:`, error);
      toast.error(error.message || 'An unexpected error occurred');
      setIsLoading?.(false);
    }

  }

  return (
    <>

      {/* See ways to refactor this */}
      {isLoading && postStatus === 'draft' && (
         <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Publishing your post...</p>
        </div>
      )}

      {isLoading && postStatus === 'published' && (
         <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Archiving your post...</p>
        </div>
      )}

      {isSuccess && postStatus === 'draft' && (
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
          <p className={styles.successText}>Post published successfully!</p>
        </div>
      )}

      {isSuccess && postStatus === 'published' && (
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
          <p className={styles.successText}>Post archived successfully!</p>
        </div>
      )}


      {selectedPostId && (
        <div className={styles.actionButtonContainer}>
          {postStatus === 'draft' && (
            <>
              <button 
                className={styles.actionButton}
                onClick={() => setShowEditModal(true)}
              >
                Edit Post
              </button>

              <button 
                className={styles.actionButton}
                onClick={(e) => handlePublishOrArchive(selectedPostId, 'publish', e)}
              >
                Publish Post
              </button>

            </>
          )}
          {postStatus === 'published' && (
            <>
              <button 
                className={styles.actionButton}
                onClick={() => setShowEditModal(true)}
              >
                Edit Post
              </button>

              <button 
                className={styles.actionButton}
                onClick={(e) => handlePublishOrArchive(selectedPostId, 'archive', e)}
              >
                Archive Post
              </button>

            </>
          )}
        </div>
      )}
      
      <div className={styles.postsGrid} onClick={handleGridClick}>
        {posts
          .filter(post => post.status === postStatus)
          .map(post => (
            <PostCard 
              key={post.id}
              imageUrl={post.coverImageUrl}
              title={post.title}
              summary={post.summary || post.content.substring(0, 150) + '...'}
              date={new Date(postStatus === 'published' ? post.publishedAt || post.createdAt : post.createdAt).toLocaleDateString('pt-BR')}
              updatedAt={postStatus === 'published' && post.updatedAt ? new Date(post.updatedAt).toLocaleDateString('pt-BR') : undefined}
              showUpdatedDate={postStatus === 'published' && post.updatedAt ? new Date(post.updatedAt).getTime() > new Date(post.publishedAt || post.createdAt).getTime() : false}
              isSelected={selectedPostId === post.id}
              isDeletable={postStatus === 'draft' && selectedPostId === post.id}
              onClick={(e) => handlePostClick(post, e)}
              onDelete={(e) => setShowDeleteModal(true)}
            />
          ))
        }
      </div>

      {showEditModal && selectedPostId && (
        <EditPostModal 
          post={posts.find(post => post.id === selectedPostId)!}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            fetchPosts?.();
          }}
        />
      )}
        
      {showDeleteModal && selectedPostId && (
        <DeletePostModal 
          postId={selectedPostId}
          onClose={() => setShowDeleteModal(false)}
          onSuccess={() => {
            fetchPosts?.();
          }}
        />
      )}
    </>
  );
}