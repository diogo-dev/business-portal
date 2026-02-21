import { Profile } from './profile.types';

export interface User {
  id: string;
  email: string;
  userName: string;
  roles: string[];
  profile?: Profile;
}