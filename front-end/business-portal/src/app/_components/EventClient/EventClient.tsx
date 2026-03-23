"use client";

import { MetaData } from "../../_types/metadata.type";
import { Event } from "../../_types/event.types";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface EventClientProps {
  events: Event[];
  metaData: MetaData;
  eventStatus: 'draft' | 'published' | 'archived';
}

export default function EventClient({
  events,
  metaData,
  eventStatus
}: EventClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/manage-post?${params.toString()}`);
  }

  const handleRefresh = () => {
    router.refresh();
  }

  return (
    <>
    </>
  );

}