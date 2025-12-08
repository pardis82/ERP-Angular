export interface User {
  id: number | string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  gender: string;
  token?: string;
  role: string;
}
