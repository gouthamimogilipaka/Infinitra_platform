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

export enum ProjectScenario {
  Opportunity = 'opportunity',
  ProductIdeaSelfFunded = 'product_idea_self_funded',
  ProductIdeaCompanyFunded = 'product_idea_company_funded',
  JointVenture = 'joint_venture',
  InternalInitiative = 'internal_initiative',
}

export type View =
  | 'dashboard'
  | 'projects'
  | 'manage-admins'
  | 'manage-users'
  | 'profile';

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

export interface Contributor {
  user_id: string;
  role_in_project: string;
  share_percentage: number;
}

export interface Project {
  project_id: string;
  title: string;
  description: string;
  type: ProjectType;
  scenario: ProjectScenario;
  contributors: Contributor[];
  phantom_pool_contribution_percentage?: number;
  royalty_to_ideator_percentage?: number;
  royalty_to_company_percentage?: number;
  created_by_id: string;
  value: number;
  phantom_units: number;
  approved_by_id: string | null;
  created_at: string;
  status: ProjectStatus;
  deadline: string;
  estimated_duration_days: number;
}