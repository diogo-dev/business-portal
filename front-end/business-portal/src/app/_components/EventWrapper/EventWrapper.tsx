import styles from './EventWrapper.module.css';
import { get, getServer } from '../../api';
import EventForm  from '@/app/_components/EventForm/EventForm';
import EventClient from '@/app/_components/EventClient/EventClient';
import { cookies } from 'next/headers';

interface EventWrapperProps {
  activeTab: 'form' | 'draft' | 'published' | 'archived';
  page: number;
  sort: 'asc' | 'desc';
}

async function fetchEvents(page: number, status: string, sort: 'asc' | 'desc', limit: number = 6) {
  try {
    const cookieStore = await cookies();
    const response = await getServer(
      `/event/status?page=${page}&limit=${limit}&status=${status}&sort=${sort}`, 
      cookieStore.toString()
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    return await response.json();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch events';
    console.error('Failed to fetch events:', message);
    return { events: [], meta: null };
  }
}

export default async function EventWrapper({ activeTab, page, sort }: EventWrapperProps) {
  if (activeTab === 'form') {
    return <EventForm />;
  }

  const data = await fetchEvents(page, activeTab, sort);
  const { events, meta } = data;

  if (!events || events.length === 0) {
    return (
      <div className={styles.noDataMessageStyle}>
        <p>No events have been created yet.</p>
      </div>
    );
  }

  return (
    <EventClient 
      events={events}
      metaData={meta}
      eventStatus={activeTab}
    />
  );
}