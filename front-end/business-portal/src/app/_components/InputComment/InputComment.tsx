"use client";

import { useAuth } from '../../_context/AuthContext';
import styles from './InputComment.module.css';
import Avatar from '@mui/material/Avatar';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import { toast } from 'sonner';
import { post } from '../../api';
import { useRouter } from 'next/navigation';

interface InputCommentProps {
  postId: string;
  onCommentAdd?: () => void;
}

export function InputComment(props: InputCommentProps) {
  const [comment, setComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const avatarSrc = user?.profile?.avatarUrl?.trim() || undefined;

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = async () => {
    
    try {
      const [response] = await Promise.all([
        post('/post-comment', { content: comment, postId: props.postId }),
        delay(1000) 
      ])

      if (!response.ok) {
        throw new Error('Failed to create comment');
      }

      // Success!
      router.refresh();
      toast.success('Comment created successfully!');
      setComment('');
      setIsFocused(false);
      if (props.onCommentAdd) props.onCommentAdd(); 
      
      //refresh the comments list
      } catch {
        toast.error('An error occurred while creating the comment');
      } finally {
        setIsLoading(false);
      }
  }

  const handleCancel = () => {
    setComment('');
    setIsFocused(false);
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputSection}>
        <Avatar
          sx={{bgcolor: 'var(--soft-white)', color: 'primary.dark'}}
          src={avatarSrc}
          alt={user?.userName || 'User Avatar'}
          className={styles.avatar}
        >
          {user?.userName ? user.userName.charAt(0).toUpperCase() : 'U'}
        </Avatar>

        <FormControl 
          disabled={!isAuthenticated} 
          onFocus={() => setIsFocused(true)} 
          variant='standard'
          className={styles.formControl}
        >
          <InputLabel htmlFor="my-input" sx={{ color: 'primary.main' }}>
            {isAuthenticated ? "What are your thoughts on this post?" : "Please log in to leave a comment"}
          </InputLabel>
          <Input 
            id="my-input" 
            aria-describedby="my-helper-text" 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
            sx={{
              color: 'primary.main',
              '&:before': {
                borderBottomColor: 'primary.main',
              },
              '&:after': { 
                borderBottomColor: 'primary.main',
              },
              '&:hover:not(.Mui-disabled):before': {
                borderBottomColor: 'primary.main',
              },
            }}
          />
        </FormControl>
      </div>

      {isFocused && (
        <div className={styles.buttonSection}>
          <Button
            sx={{borderRadius: '20px', color: 'var(--soft-white)', borderColor: 'var(--soft-white)'}}
            variant='outlined'
            onClick={handleCancel}
          >
            Cancel
          </Button>
          
          <Button
            sx={{
              borderRadius: '20px',
              color: 'primary.dark',
              backgroundColor: 'success.dark',
              '&:disabled': {
                backgroundColor: 'var(--grey)',
                color: 'var(--soft-white)',
                borderColor: 'var(--soft-white)'
              },
              '&:hover': {
                boxShadow: '0 1px 8px rgba(255, 255, 255, 0.1)',
              }
            }}
            variant='contained'
            onClick={handleSubmit}
            disabled={comment.trim() === '' || isLoading}
          >  
            Comment
          </Button>
        </div>
      )}
    </div>
  );
}