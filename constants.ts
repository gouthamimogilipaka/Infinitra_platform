// FIX: Added ProjectStatus to the import to resolve a type error.
import { User, Project, UserRole, UserStatus, ProjectScenario, ProjectType, ProjectStatus } from './types';

export const PHANTOM_CONVERSION_RATE = 100;

export const initialUsers: User[] = [
  {
    user_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    name: 'Admin User',
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
    user_id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
    name: 'Alex Smith',
    email: 'alex.smith@infinitra.com',
    role: UserRole.Manager,
    status: UserStatus.Active,
    phantom_units: 1500,
    vested_units: 500,
    join_date: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(),
    department: 'Operations',
    title: 'Operations Manager',
  },
  {
    user_id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12',
    name: 'Maria Garcia',
    email: 'maria.garcia@infinitra.com',
    role: UserRole.User,
    status: UserStatus.Active,
    phantom_units: 800,
    vested_units: 100,
    join_date: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString(),
    department: 'Engineering',
    title: 'Software Engineer',
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
      { user_id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1', role_in_project: 'Project Manager', share_percentage: 5 },
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