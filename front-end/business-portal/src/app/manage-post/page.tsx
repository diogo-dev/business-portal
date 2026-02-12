"use client";

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { PostForm } from '../_components/PostForm/PostForm';
import { get } from '../api';
import { PostGrid } from '../_components/PostGrid/PostGrid';

interface Post {
  id: string;
  title: string;
  content: string;
  summary: string;
  coverImageUrl: string;
  status: string;
  createdAt: string;
  publishedAt?: string;
}

export default function ManagePost() {
  const [activeTab, setActiveTab] = useState<'form' | 'draft' | 'published' | 'archived'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  useEffect(() => {
    if (activeTab !== 'form') {
      fetchPosts(activeTab);
    }
  }, [activeTab]);

  const fetchPosts = async (status: string) => {
    setIsLoadingPosts(true);
    try {
      const response = await get(`/post/top?status=${status}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoadingPosts(false);
    }
  };


  const handleTabChange = (tab: 'form' | 'draft' | 'published' | 'archived') => {
    setActiveTab(tab);
    setIsLoading(false);
    setIsSuccess(false);
  };

  const handlePostSuccess = () => {
    setActiveTab('draft');
    fetchPosts('draft'); // Update the draft posts after a successful post creation
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>Create Post Publication</h1>
        <p className={styles.subtitle}>
          Create and manage your blog posts
        </p>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${activeTab === 'form' ? styles.tabActive : ''}`}
          onClick={() => handleTabChange('form')}
        >
          Post Form
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'draft' ? styles.tabActive : ''}`}
          onClick={() => handleTabChange('draft')}
        >
          Created Post
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'published' ? styles.tabActive : ''}`}
          onClick={() => handleTabChange('published')}
        >
          Published Post
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'archived' ? styles.tabActive : ''}`}
          onClick={() => handleTabChange('archived')}
        >
          Archived Post
        </button>
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        {activeTab === 'form' && (
          <>
            <PostForm 
              isLoading={isLoading}
              isSuccess={isSuccess}
              setIsLoading={setIsLoading}
              setIsSuccess={setIsSuccess}
              onSuccess={handlePostSuccess}
            />
          </>
        )}

        {activeTab === 'draft' && (
          <div className={styles.previewContainer}>
            {isLoadingPosts ? (
              <div className={styles.noDataMessageStyle}>
                <p>Uploading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className={styles.noDataMessageStyle}>
                <p>No posts created yet.</p>
              </div>
            ) : (
              <PostGrid 
                posts={posts} 
                postStatus="draft" 
                isLoading={isLoadingPosts} 
                isSuccess={isSuccess} 
                setIsLoading={setIsLoading}
                setIsSuccess={setIsSuccess}
                fetchPosts={() => fetchPosts('draft')}
              />
            )}
          </div>
        )}

        {activeTab === 'published' && (
          <div className={styles.previewContainer}>
            {isLoadingPosts ? (
              <div className={styles.noDataMessageStyle}>
                <p>Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className={styles.noDataMessageStyle}>
                <p>No posts published yet.</p>
              </div>
            ) : (
              <PostGrid 
                posts={posts} 
                postStatus="published" 
                isLoading={isLoadingPosts} 
                isSuccess={isSuccess} 
                setIsLoading={setIsLoading}
                setIsSuccess={setIsSuccess}
                fetchPosts={() => fetchPosts('published')}
              />
            )}
          </div>
        )}

        {activeTab === 'archived' && (
          <div className={styles.previewContainer}>
            {isLoadingPosts ? (
              <div className={styles.noDataMessageStyle}>
                <p>Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className={styles.noDataMessageStyle}>
                <p>No posts archived yet.</p>
              </div>
            ) : (
              <PostGrid posts={posts} postStatus="archived" />
            )}
          </div>
        )}
      </div>
    </div>
  );

}