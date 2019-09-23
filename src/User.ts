export interface User {
  name: string;
  value?: string;
}

export interface Users {
  [key: string]: User;
}
