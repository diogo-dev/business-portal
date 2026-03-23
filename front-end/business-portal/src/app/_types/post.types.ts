import { User } from './user.types';
import { Comment } from './comment.types';

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


