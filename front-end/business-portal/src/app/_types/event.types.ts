import { User } from "./user.types";

export interface Event {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  location: string;
  status: string;
  coverImageUrl: string;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  publishedAt?: string;
  updatedAt?: string;
  creator?: User;
}