// Central role & permission model
export type Role = 'user' | 'teacher' | 'admin' | 'owner';

export const Roles: Record<string, Role> = {
  USER: 'user',
  TEACHER: 'teacher',
  ADMIN: 'admin',
  OWNER: 'owner'
};

export const Permissions = {
  VIEW_USERS: 'view_users',
  EDIT_USERS: 'edit_users',
  MANAGE_ROLES: 'manage_roles',
  VIEW_FINANCE: 'view_finance',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_COURSES: 'manage_courses',
  SYSTEM_OPERATIONS: 'system_operations'
} as const;

export type Permission = typeof Permissions[keyof typeof Permissions];

export const rolePermissions: Record<Role, Permission[]> = {
  user: [],
  teacher: [Permissions.MANAGE_COURSES],
  admin: [
    Permissions.VIEW_USERS,
    Permissions.EDIT_USERS,
    Permissions.MANAGE_COURSES,
    Permissions.SYSTEM_OPERATIONS,
    Permissions.VIEW_ANALYTICS
  ],
  owner: [
    Permissions.VIEW_USERS,
    Permissions.EDIT_USERS,
    Permissions.MANAGE_ROLES,
    Permissions.MANAGE_COURSES,
    Permissions.SYSTEM_OPERATIONS,
    Permissions.VIEW_FINANCE,
    Permissions.VIEW_ANALYTICS
  ]
};

export const hasAnyRole = (userRoles: string[] | undefined, required?: Role[]): boolean => {
  if (!required || required.length === 0) return true;
  if (!userRoles) return false;
  return userRoles.some(r => required.includes(r as Role));
};

export const hasPermission = (userRoles: string[] | undefined, permission: Permission): boolean => {
  if (!userRoles) return false;
  return userRoles.some(r => rolePermissions[r as Role]?.includes(permission));
};
