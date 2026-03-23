"use client";

import styles from './Tabs.module.css';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';


interface TabsProps {
  activeTab: 'form' | 'draft' | 'published' | 'archived';
  path: string;
  tabButtons: string[];
}

export function Tabs({ activeTab, path, tabButtons }: TabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (tab: 'form' | 'draft' | 'published' | 'archived') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    params.delete('page'); 
    router.push(`${path}?${params.toString()}`);
  }

  return (
    <div className={styles.tabContainer}>
      <button
        className={`${styles.tab} ${activeTab === 'form' ? styles.tabActive : ''}`}
        onClick={() => handleTabChange('form')}
      >
        {tabButtons[0]}
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'draft' ? styles.tabActive : ''}`}
        onClick={() => handleTabChange('draft')}
      >
        {tabButtons[1]}
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'published' ? styles.tabActive : ''}`}
        onClick={() => handleTabChange('published')}
      >
        {tabButtons[2]}
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'archived' ? styles.tabActive : ''}`}
        onClick={() => handleTabChange('archived')}
      >
        {tabButtons[3]}
      </button>
    </div>
  );
}