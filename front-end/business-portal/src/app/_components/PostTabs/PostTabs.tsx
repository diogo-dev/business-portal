"use client";

import styles from './PostTabs.module.css';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';


interface PostTabsProps {
  activeTab: 'form' | 'draft' | 'published' | 'archived';
}

export function PostTabs({ activeTab }: PostTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (tab: 'form' | 'draft' | 'published' | 'archived') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    params.delete('page'); 
    router.push(`/manage-post?${params.toString()}`);
  }

  return (
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
  );
}