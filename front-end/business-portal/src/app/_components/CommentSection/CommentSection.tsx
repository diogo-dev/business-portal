"use client";
import { Children, useState } from 'react';
import { InputComment } from '../InputComment/InputComment';
import styles from './CommentSection.module.css';
import { DisplayCommentsWrapper } from '../DisplayCommentsWrapper/DisplayCommentsWrapper';

interface CommentSectionProps {
  initialCount: number;
  postId: string;
  children?: React.ReactNode;
}

export function CommentSection({ initialCount, postId, children }: CommentSectionProps) {
  const [count, setCount] = useState<number>(initialCount);

  const handleCommentAdd = () => {
    setCount(prevCount => prevCount + 1);
  };

  return (
    <div className={styles.container}>
      {count === 1 ? (
        <h2 className={styles.commentTitle}>{count} Comment</h2>
      ) : (
        <h2 className={styles.commentTitle}>{count} Comments</h2>
      )}
      <InputComment postId={postId} onCommentAdd={handleCommentAdd} />
      {children}
    </div>
  );
}