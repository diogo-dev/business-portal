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

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to create a post');
        return;
      }

      const [response] = await Promise.all([
        post('/post-comment', { content: comment, postId: props.postId }, token),
        delay(1000) 
      ])

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Failed to create comment');
        setIsLoading(false);
        return;
      }

      // Success!
      router.refresh();
      toast.success('Comment created successfully!');
      setComment('');
      setIsFocused(false);
      if (props.onCommentAdd) props.onCommentAdd(); 
      
      //refresh the comments list
      } catch (error) {
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
          sx={{bgcolor: '#000000'}}
          src={user?.profile?.avatarUrl} 
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
          <InputLabel htmlFor="my-input">
            {isAuthenticated ? "What are your thoughts on this post?" : "Please log in to leave a comment"}
          </InputLabel>
          <Input 
            id="my-input" 
            aria-describedby="my-helper-text" 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
            sx={{'&.Mui-focused': {
            color: '#000000',
          },}}
          />
        </FormControl>
      </div>

      {isFocused && (
        <div className={styles.buttonSection}>
          <Button
            sx={{borderRadius: '20px', color: '#000000', borderColor: '#000000'}}
            variant='outlined'
            onClick={handleCancel}
          >
            Cancel
          </Button>
          
          <Button
            sx={{borderRadius: '20px'}}
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