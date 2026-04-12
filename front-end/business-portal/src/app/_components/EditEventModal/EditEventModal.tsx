"use client";

import { Event } from "@/app/_types/event.types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { patchFormData } from "@/app/api";
import EditResourceModal from "../EditResourceModal/EditResourceModal";
import { InputCard } from "../InputCard/InputCard";
import { TextareaCard } from "../TextareaCard/TextareaCard";

interface EditEventModalProps {
  event: Event;
  onSuccess: () => void;
  onClose: () => void;
}

export function EditEventModal({ event, onSuccess, onClose }: EditEventModalProps) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startsAt, setStartsAt] = useState<Date | undefined>(undefined);
  const [endsAt, setEndsAt] = useState<Date | undefined>(undefined);
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Load event data into state when modal opens
    setTitle(event.title);
    setLocation(event.location);
    setStartsAt(new Date(event.startsAt));
    setEndsAt(new Date(event.endsAt));
    setSummary(event.summary);
    setContent(event.content);
    setImagePreview(event.coverImageUrl);
  }, [event]);

  const handleOnClose = () => {
    if (isSuccess) {
      onSuccess();
    }
    onClose();
  }

  const handleImageChange = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);

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

      const response = await patchFormData(`/event/${event.id}`, formData);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message);
      }

      setIsLoading(false);
      setIsSuccess(true);
      toast.success('Event updated successfully!');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred while updating the event';
      toast.error(message);
      setIsLoading(false);
    }
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }

  return (
    <EditResourceModal
      title="Event"
      isLoading={isLoading}
      isSuccess={isSuccess}
      imagePreview={imagePreview}
      onSubmit={handleSubmit}
      onClose={handleOnClose}
      onImageChange={handleImageChange}
    >
      {/* Title and summary */}
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
        placeholder="Enter a brief summary of your event"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      {/* Place and Time */}
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

      {/* Content */}
      <TextareaCard 
        title="Event Content"
        placeholder="Write the content of your event here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </EditResourceModal>
  );

}