export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export enum ProjectStatus {
  Approved = 'approved',
  Pending = 'pending',
  Rejected = 'rejected',
}

export enum ProjectType {
  External = 'external',
  Internal = 'internal',
  IP = 'ip',
}

export type View =
  | 'dashboard'
  | 'projects'
  | 'manage-admins'
  | 'manage-employees'
  | 'manage-users'
  | 'profile'
  | 'homepage';

export interface User {
  user_id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phantom_units: number;
  vested_units: number;
  join_date: string;
  department: string;
  title: string;
  profile_picture?: string;
}

export interface Project {
  project_id: string;
  title: string;
  description: string;
  type: ProjectType;
  created_by_id: string;
  value: number;
  phantom_units: number;
  approved_by_id: string | null;
  created_at: string;
  status: ProjectStatus;
  deadline: string;
  estimated_duration_days: number;
}