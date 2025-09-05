export interface User {
  id: number;
  email: string;
  name: string;
  phone_number?: string;
  is_active: boolean;
  created_at: string;
}

export interface UserCreate {
  email: string;
  name: string;
  phone_number?: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}
