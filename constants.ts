
import { User, Project, UserRole, UserStatus } from './types';

export const PHANTOM_CONVERSION_RATE = 100;

export const initialUsers: User[] = [
  {
    user_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    name: 'Default Admin',
    email: 'admin@infinitra.com',
    role: UserRole.Admin,
    status: UserStatus.Active,
    phantom_units: 0,
    vested_units: 0,
    join_date: new Date().toISOString(),
    department: 'Executive',
    title: 'Administrator',
  },
];

export const initialProjects: Project[] = [];
