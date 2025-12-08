export const permissions = {
  users: {
    view: 'users:view',
    delete: 'users:delete',
    edit: 'users:edit',
  },
  dashboard: {
    view: 'dashboard:view',
  },
} as const;
export const rolePermissions: Record<string, string[]> = {
  admin: [permissions.users.delete, permissions.users.edit, permissions.users.view],
  user: [permissions.users.view],
};
