import { Profile } from './profile.types';
import { Role } from './role.types';

export interface User {
  id: string;
  email: string;
  userName: string;
  roles: Role[];
  profile?: Profile;
}