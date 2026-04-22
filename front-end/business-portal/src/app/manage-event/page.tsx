import { Suspense } from 'react';
import { Tabs } from '../_components/Tabs/Tabs';
import styles from './page.module.css';
import EventWrapper from '../_components/EventWrapper/EventWrapper';

interface EventSearchParams {
  tab?: 'form' | 'draft' | 'published' | 'archived';
  page?: string;
  sort?: 'asc' | 'desc';
}

export default async function ManageEvent({ searchParams }: { searchParams: Promise<EventSearchParams> }) {

  const params = await searchParams;
  const activeTab = params.tab || 'form';
  const page = parseInt(params.page || '1');
  const sort = params.sort || 'desc';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.mainTitle}>Manage Events</h1>
        </div>
        <p className={styles.subtitle}>Create and manage events</p>
      </div>

      {/* Tab Navigation */}
      <Tabs 
        activeTab={activeTab} 
        path="/manage-event"
        tabButtons={['Event Form', 'Created Events', 'Published Events', 'Archived Events']}
      />

      {/* Content Section */}
      <div className={styles.content}>
        <Suspense fallback={<LoadingState />}>
          <EventWrapper 
            activeTab={activeTab} 
            page={page} 
            sort={sort}
          />
        </Suspense>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className={styles.noDataMessageStyle}>
      <p>Loading events...</p>
    </div>
  );
}