"use client";

import styles from './PostCard.module.css';
import { useRouter } from 'next/navigation';

interface PostCardProps {
  imageUrl: string;
  slug: string;
  title: string;
  summary: string;
  date?: string;
  updatedAt?: string;
  showUpdatedDate?: boolean;
  isSelected?: boolean;
  isDeletable?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  // category?: string;
}

export function PostCard(props: PostCardProps) {

  const router = useRouter();

  const handleReadMore = (e: React.MouseEvent) => {
    router.push(`/blog/${props.slug}`);
  }

  return (
    <div 
      className={`${styles.container} ${props.isSelected ? styles.selected : ''}`}
      onClick={props.onClick}
    >
      <div className={styles.imageContainer}>
        <img src={props.imageUrl} alt="Post" className={styles.image} />
        {props.isDeletable && (
          <button 
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              props.onDelete?.(e);
            }}
            aria-label="Delete post"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.date}>
            <svg className={styles.icon} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 4V8L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {props.date || 'Unknown date'}
          </span>
          {props.showUpdatedDate && props.updatedAt && (
            <span className={styles.updatedDate}>
              <svg className={styles.icon} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 2H13V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Updated at: {props.updatedAt}
            </span>
          )}
          {/* <span className={styles.category}>
            {props.category || 'Design'}
          </span> */}
        </div>
        
        <h2 className={styles.title}>{props.title}</h2>
        
        <p className={styles.description}>
          {props.summary}
        </p>
        
        <button 
          className={styles.readMore}
          onClick={handleReadMore}
        >
          Read More
        </button>
      </div>
    </div>
  );
}