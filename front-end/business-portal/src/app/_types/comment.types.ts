import { User } from './user.types';

export interface Comment {
  content: string;
  postId: string;
  author?: User;
}