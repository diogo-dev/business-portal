"use client";

import { useState } from 'react';
import { InputCard } from '../InputCard/InputCard';
import { UploadCard } from '../UploadCard/UploadCard';
import styles from './EventForm.module.css';
import { TextareaCard } from '../TextareaCard/TextareaCard';
import { postFormData } from '@/app/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function EventForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startsAt, setStartsAt] = useState<Date | undefined>(undefined);
  const [endsAt, setEndsAt] = useState<Date | undefined>(undefined);
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setIsSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('summary', summary);
      formData.append('content', content);
      formData.append('location', location);
      if (startsAt) {
        formData.append('startsAt', startsAt.toISOString());
      }
      if (endsAt) {
        formData.append('endsAt', endsAt.toISOString());
      }
      if (imageFile) {
        formData.append('file', imageFile);
      }

      // Validate start and end times

      const response = await postFormData('/event', formData);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message);
      }
      
      // Success!
      setIsLoading(false);
      setIsSuccess(true);
      toast.success('Event created successfully!');
      
      // Clear form fields
      setTitle('');
      setSummary('');
      setContent('');
      setLocation('');
      setStartsAt(undefined);
      setEndsAt(undefined);
      setImageFile(null);
      
      // After 2 seconds, navigate to drafts and refresh server data
      setTimeout(() => {
        setIsSuccess(false);
        router.push('/manage-event?tab=draft');
        router.refresh();
      }, 2000);
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(message);
      setIsLoading(false);
    }
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Creating your event...</p>
        </div>
      )}

      {/* Success Overlay */}
      {isSuccess && (
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
          <p className={styles.successText}>Event created successfully!</p>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.uploadSection}>
          <UploadCard onFileChange={setImageFile} />
        </div>

        <div className={styles.titleAndSummary}>
          <InputCard
            title="Event Title"
            inputType="text"
            placeholder="Enter the title of your event"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <InputCard
            title="Event Summary"
            inputType="text"
            placeholder="Enter an event summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        <div className={styles.placeAndTime}>
          <InputCard
            title="Event Location"
            inputType="text"
            placeholder="Enter the location of your event"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <InputCard
            title="Start Time"
            inputType="date"
            value={formatDate(startsAt)}
            onChange={(e) => setStartsAt(e.target.value ? new Date(e.target.value) : undefined)}
          />
          <InputCard
            title="End Time"
            inputType="date"
            value={formatDate(endsAt)}
            onChange={(e) => setEndsAt(e.target.value ? new Date(e.target.value) : undefined)}
          />
        </div>

        <div className={styles.section}>
          <TextareaCard 
            title="Event Content"
            placeholder="Write the content of your event here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className={styles.buttonContainer}>
            <button 
              type="submit"
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!title || !content || isLoading}
            >
              Create Event
            </button>
          </div>
      </div>
    </>
  );

}
