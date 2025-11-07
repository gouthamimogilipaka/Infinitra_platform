// FIX: Added ProjectStatus to the import to resolve a type error.
import { User, Project, UserRole, UserStatus, ProjectScenario, ProjectType, ProjectStatus } from './types';

export const PHANTOM_CONVERSION_RATE = 100;

export const initialUsers: User[] = [
  {
    user_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    name: 'Admin',
    email: 'admin@groveda.com',
    role: UserRole.Admin,
    status: UserStatus.Active,
    phantom_units: 0,
    vested_units: 0,
    join_date: new Date().toISOString(),
    department: 'Administration',
    title: 'Platform Administrator',
  },
  {
    user_id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12',
    name: 'Partner',
    email: 'partner@groveda.com',
    role: UserRole.User,
    status: UserStatus.Active,
    phantom_units: 800,
    vested_units: 100,
    join_date: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString(),
    department: 'Partner',
    title: 'Partner',
  },
  {
    user_id: 'd4e5f6a7-b8c9-0123-4567-890abcdef123',
    name: 'Partner in Progress',
    email: 'pip@groveda.com',
    role: UserRole.User,
    status: UserStatus.Active,
    phantom_units: 150,
    vested_units: 0,
    join_date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    department: 'Partner in progress',
    title: 'Partner in progress',
  },
];

export const initialProjects: Project[] = [
  {
    project_id: 'p12345',
    title: 'AI-Powered Sales Funnel Optimizer',
    description: 'Develop a new IP product that uses machine learning to optimize sales funnels for e-commerce clients.',
    type: ProjectType.IP,
    scenario: ProjectScenario.ProductIdeaCompanyFunded,
    contributors: [
      { user_id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12', role_in_project: 'Ideator & Lead Developer', share_percentage: 10 },
    ],
    royalty_to_ideator_percentage: 10,
    created_by_id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12',
    value: 50000,
    phantom_units: 500,
    approved_by_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    created_at: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    status: ProjectStatus.Approved,
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
    estimated_duration_days: 90,
  }
];