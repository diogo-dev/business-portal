"use client";

import styles from './PostCard.module.css';
import { useRouter } from 'next/navigation';

interface PostCardProps {
  imageUrl: string;
  slug: string;
  title: string;
  summary: string;
  status: string;
  date?: string;
  updatedAt?: string;
  showUpdatedDate?: boolean;
  isSelected?: boolean;
  isForBlog?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  onUpdate?: (e: React.MouseEvent) => void;
  onHandlePublishOrArchive?: (e: React.MouseEvent<HTMLButtonElement>, status: 'publish' | 'archive') => void;
}

export function PostCard(props: PostCardProps) {

  const router = useRouter();

  const handleReadMore = () => {
    router.push(`/blog/${props.slug}`);
  }

  return (
    <div 
      className={`${styles.container} ${props.isSelected ? styles.selected : ''}`}
      onClick={props.onClick}
    >
      <div className={styles.imageWrapper}>
        <img 
          src={props.imageUrl} 
          alt={props.title}
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.meta}>
          {props.date && <span>{props.date}</span>}
          {props.showUpdatedDate && props.updatedAt &&(
            <>
              <span className={styles.metaDot}/>
              <span>Updated {props.updatedAt}</span>
            </>
          )}
        </div>
        
        <div className={styles.textContent}>
          <h2 className={styles.title}>{props.title}</h2>
          <p className={styles.summary}>{props.summary}</p>
        </div>
      </div>

      {props.isSelected && !props.isForBlog && (
        <div className={styles.buttonsContainer}>

          {props.status === 'draft' && (
            <div className={styles.draftButtons}>
              <button
                onClick={(e) => props.onHandlePublishOrArchive?.(e, 'publish')}
                className={styles.actionButton}
              >
                PUBLISH
              </button>

              <button 
                onClick={props.onUpdate}
                className={styles.actionButton}
              >
                EDIT
              </button>

              <button
                className={styles.actionButton}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onDelete?.(e);
                }}
              >
                DELETE
              </button>
            </div>
          )}

          {props.status === 'published' && (
            <div className={styles.publishedButtons}>
              <button
                className={styles.actionButton}
                onClick={(e) => props.onHandlePublishOrArchive?.(e, 'archive')}
              >
                ARCHIVE
              </button>

              <button 
                onClick={props.onUpdate}
                className={styles.actionButton}
              >
                EDIT
              </button>
            </div>
          )}

        </div>
      )}
        
      <button 
        className={styles.readButton}
        onClick={handleReadMore}
      >
        READ MORE
      </button>

      {props.isSelected && <div className={styles.selectedIndicator} />}
    </div>
  );
}