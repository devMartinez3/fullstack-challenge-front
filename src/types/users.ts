import { Meta } from "./common";

export interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: string;
  _count?: { posts: number };
}

export type UsersResponse = {
  data: UserData[];
  meta: Meta;
};
