"use client";

import { useEffect, useState } from 'react';
import { patchFormData } from '@/app/api';
import { toast } from 'sonner';
import { InputCard } from '../InputCard/InputCard';
import { TextareaCard } from '../TextareaCard/TextareaCard';
import { useScrollLock } from '@/app/_hooks/useScrollLock';
import EditResourceModal from '../EditResourceModal/EditResourceModal';
import { Post } from '@/app/_types/post.types';

interface EditPostModalProps {
  post: Post;
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

  useEffect(() => {
    // Load post data into state when modal opens
    setTitle(post.title);
    setSummary(post.summary);
    setContent(post.content);
    setImagePreview(post.coverImageUrl);
  }, [post]);

  useScrollLock();

  const handleOnClose = () => {
    if (isSuccess) {
      onSuccess();
    }
    onClose();
  }

  const handleImageChange = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('summary', summary);
      formData.append('content', content);
      
      if (imageFile) {
        formData.append('file', imageFile);
      }

      const response = await patchFormData(`/post/${post.id}`, formData);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message);
      }

      setIsLoading(false);
      setIsSuccess(true);
      toast.success('Post updated successfully!');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred while updating the post';
      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <EditResourceModal
      title="Post"
      isLoading={isLoading}
      isSuccess={isSuccess}
      imagePreview={imagePreview}
      onClose={handleOnClose}
      onSubmit={handleSubmit}
      onImageChange={handleImageChange}
    >
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
      
        <TextareaCard 
          title="Post Content"
          placeholder="Write the content of your post here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
    </EditResourceModal> 
  );
}