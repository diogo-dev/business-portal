import styles from './page.module.css';
import { Tabs } from '../_components/Tabs/Tabs';
import PostGridWrapper from '../_components/PostGridWrapper/PostGridWrapper';
import { Suspense } from 'react';
import PostMenu from '../_components/PostMenu/PostMenu';

export type PostSearchParams = {
  tab?: 'form' | 'draft' | 'published' | 'archived';
  page?: string;
}

export default async function ManagePost({ searchParams }: { searchParams: Promise<PostSearchParams> }) {
  
  const params = await searchParams;
  const activeTab = params.tab || 'form';
  const page = parseInt(params.page || '1');

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.mainTitle}>Manage Post Publication</h1>
          <PostMenu />
        </div>
        <p className={styles.subtitle}>
          Create and manage your blog posts
        </p>
      </div>
      
      {/* Tab Navigation */}
      <Tabs 
        activeTab={activeTab} 
        path="/manage-post"
        tabButtons={['Post Form', 'Created Post', 'Published Post', 'Archived Post']}
      />

      {/* Content Section */}
      <div className={styles.content}>
        <Suspense fallback={<LoadingState />}>
          <PostGridWrapper 
            activeTab={activeTab}
            page={page}
          />
        </Suspense>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className={styles.noDataMessageStyle}>
      <p>Loading posts...</p>
    </div>
  );
}