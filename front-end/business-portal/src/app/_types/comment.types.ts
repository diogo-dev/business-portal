import { User } from './user.types';

export interface Comment {
  id: string;
  content: string;
  postId: string;
  createdAt: string;
  author?: User;
}