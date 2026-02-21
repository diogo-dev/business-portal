import { Profile } from './profile.types';
import { User } from './user.types';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  coverImageUrl: string;
  status: string;
  createdAt: string;
  publishedAt?: string;
  updatedAt?: string;
  author?: User;
  comments: Comment[];
}

export interface MetaData {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}


