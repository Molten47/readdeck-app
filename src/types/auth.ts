export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  user_id: string;
  username: string;
  email: string;
}

export interface AuthResponse extends AuthUser {}

export interface RefreshResponse {
  user_id: string;
  username: string;
}

export interface MeResponse {
  user_id: string;
  username: string;
  email: string;
  created_at: string;
}