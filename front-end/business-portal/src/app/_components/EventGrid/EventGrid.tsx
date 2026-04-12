"use client";

import styles from './EventGrid.module.css';
import { Event } from '../../_types/event.types';
import { MetaData } from '../../_types/metadata.type';
import { useState } from 'react';
import { toast } from 'sonner';
import { patch } from '@/app/api';
import EventCard from '../EventCard/EventCard';
import { DeleteModal } from '../DeletePostModal/DeleteModal';
import { EditEventModal } from '../EditEventModal/EditEventModal';


interface EventGridProps {
  events: Event[];
  metaData: MetaData;
  eventStatus: 'draft' | 'published' | 'archived';
  isLoading?: boolean;
  isSuccess?: boolean;
  setIsLoading?: (loading: boolean) => void | undefined;
  setIsSuccess?: (success: boolean) => void | undefined;
  fetchEvents?: () => void;
  onPageChange?: (page: number) => void;
}

export default function EventGrid({
  events, 
  metaData,
  eventStatus, 
  isLoading,
  isSuccess,
  setIsLoading,
  setIsSuccess,
  fetchEvents
}: EventGridProps) {

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEventClick = (event: EventGridProps['events'][0], e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEventId(event.id);
  }

  const handleGridClick = () => {
    setSelectedEventId(null);
  }

  const handlePublishOrArchive = async (eventId: string, status: 'publish' | 'archive', e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsLoading?.(true);
    setIsSuccess?.(false);

    try {
      const response = await patch(`event/${eventId}/${status}`, undefined);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || `Error ${status}ing event`);
        setIsLoading?.(false);
        return;
      }

      //Success
      setSelectedEventId(null);
      setIsLoading?.(false);
      setIsSuccess?.(true);
      toast.success(`Event ${status} successfully`);

      setTimeout(() => {
        setIsSuccess?.(false);
        fetchEvents?.();
      }, 2000);

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(message);
      setIsLoading?.(false);
    } 
  }

  return (
    <>
      {isLoading && eventStatus === 'draft' && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Publishing your event...</p>
        </div>
      )}

      {isLoading && eventStatus === 'published' && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Archiving your event...</p>
        </div>
      )}

      {isSuccess && eventStatus === 'draft' && (
        <div className={styles.successOverlay}>
          <svg 
            className={styles.successCheckLarge}
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="2"
              fill="none"
            />
            <path 
              d="M8 12L11 15L16 9" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <p className={styles.successText}>Event published successfully!</p>
        </div>
      )}

      {isSuccess && eventStatus === 'published' && (
        <div className={styles.successOverlay}>
          <svg 
            className={styles.successCheckLarge}
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="2"
              fill="none"
            />
            <path 
              d="M8 12L11 15L16 9" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <p className={styles.successText}>Event archived successfully!</p>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.eventsGrid} onClick={handleGridClick}>
          {events
            .filter(event => event.status === eventStatus)  
            .map(event => (
              <EventCard 
                key={event.id}
                imageUrl={event.coverImageUrl}
                status={event.status}
                slug={event.slug}
                title={event.title}
                summary={event.summary}
                date={new Date(event.startsAt).toLocaleDateString('pt-BR')}
                isSelected={selectedEventId === event.id}
                isPublic={false}
                onClick={(e) => handleEventClick(event, e)}
                onDelete={() => setShowDeleteModal(true)}
                onUpdate={() => setShowEditModal(true)}
                onHandlePublishOrArchive={(e, status) => handlePublishOrArchive(event.id, status, e)}
              />
            ))
          }
        </div>
      </div>

      <div className={styles.paginationContainer}>
        {metaData && (
          <button>
            Load More
          </button>
        )}
      </div>

      {showEditModal && selectedEventId && (
        <EditEventModal 
          event={events.find(e => e.id === selectedEventId)!}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            fetchEvents?.();
          }}
        />
      )}

      {showDeleteModal && selectedEventId && (
        <DeleteModal 
          resourceId={selectedEventId}
          resourceType="event"
          onClose={() => setShowDeleteModal(false)}
          onSuccess={() => {
            fetchEvents?.();
          }}
        />
      )}
    </>
  );

}