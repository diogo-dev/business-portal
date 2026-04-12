import CategoryWrapper from '@/app/_components/CategoryWrapper/CategoryWrapper';
import styles from './page.module.css';
import { Suspense } from 'react';

export default function ManageCategory() {

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.mainTitle}>Manage Categories</h1>
        </div>
        <p className={styles.subtitle}>Create and manage blog post categories</p>
      </div>

      <div className={styles.content}>
        <Suspense fallback={<LoadingState />}>
          <CategoryWrapper />
        </Suspense>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className={styles.noDataMessageStyle}>
      <p>Loading categories...</p>
    </div>
  );
}