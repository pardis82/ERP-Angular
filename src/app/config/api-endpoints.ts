export const apiEndpoints = {
  auth: {
    login: 'auth/login',
    refresh: 'auth/refresh',
    me: 'auth/me',
    signup: 'users/add',
  },
  // بعداً users و products رو هم اینجا اضافه میکنی
} as const;
