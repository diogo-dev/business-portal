"use client";

import { PostGrid } from '../PostGrid/PostGrid';
import { Post, MetaData } from '../../_types/post.types';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PostGridClientProps {
  posts: Post[];
  metaData: MetaData;
  postStatus: 'draft' | 'published' | 'archived';
  currentPage: number;
}

export function PostGridClient({
  posts,
  metaData,
  postStatus,
  currentPage
}: PostGridClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/manage-post?${params.toString()}`);
  }

  const handleRefresh = () => {
    // Triggers server component re-fetch
    router.refresh();
  }

  return (
    <PostGrid 
      posts={posts}
      metaData={metaData}
      postStatus={postStatus}
      isLoading={isLoading}
      isSuccess={isSuccess}
      setIsLoading={setIsLoading}
      setIsSuccess={setIsSuccess}
      fetchPosts={handleRefresh}
      onPageChange={handlePageChange}
    />
  );
  
}