export interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: string;
  _count?: { posts: number };
}
