"use client";

import { useState } from 'react';
import styles from './page.module.css';
import { PostForm } from '../_components/PostForm/PostForm';

export default function ManagePost() {
  const [activeTab, setActiveTab] = useState<'form' | 'created' | 'published' | 'archived'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleTabChange = (tab: 'form' | 'created' | 'published' | 'archived') => {
    setActiveTab(tab);
    setIsLoading(false);
    setIsSuccess(false);
  };

  const handlePostSuccess = () => {
    setActiveTab('created');
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
          className={`${styles.tab} ${activeTab === 'created' ? styles.tabActive : ''}`}
          onClick={() => handleTabChange('created')}
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

        {activeTab === 'created' && (
          <div className={styles.previewContainer}>
            <p className={styles.previewText}>Visualização da publicação será exibida aqui</p>
          </div>
        )}
      </div>
    </div>
  );

}