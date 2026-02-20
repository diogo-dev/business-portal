import styles from './page.module.css';
import { PostTabs } from '../_components/PostTabs/PostTabs';
import { PostGridWrapper } from '../_components/PostGridWrapper/PostGridWrapper';
import { Suspense } from 'react';

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
        <h1 className={styles.mainTitle}>Create Post Publication</h1>
        <p className={styles.subtitle}>
          Create and manage your blog posts
        </p>
      </div>
      
      {/* Tab Navigation */}
      <PostTabs activeTab={activeTab} />

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