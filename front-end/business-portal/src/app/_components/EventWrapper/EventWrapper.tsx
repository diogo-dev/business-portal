import styles from './EventWrapper.module.css';
import { get } from '../../api';
import EventForm  from '@/app/_components/EventForm/EventForm';
import EventClient from '@/app/_components/EventClient/EventClient';
import { toast } from 'sonner';

interface EventWrapperProps {
  activeTab: 'form' | 'draft' | 'published' | 'archived';
  page: number;
}

async function fetchEvents(page: number, status: string, limit: number = 6) {
  try {
    const response = await get(`/event/status?page=${page}&limit=${limit}&status=${status}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    return await response.json();
  } catch (err: any) {
    toast.error(err.message || 'Failed to fetch events');
  }
}

export default async function EventWrapper({ activeTab, page }: EventWrapperProps) {
  if (activeTab === 'form') {
    return <EventForm />;
  }

  const data = await fetchEvents(page, activeTab);
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