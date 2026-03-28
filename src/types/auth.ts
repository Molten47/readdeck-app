export interface SignupRequest {
  username: string;
  email:    string;
  password: string;
}

export interface LoginRequest {
  email:    string;
  password: string;
}

export interface AuthResponse {
  user_id:      string;
  username:     string;
  email:        string;
  role:         string;
  access_token: string;
}

export interface RefreshResponse {
  user_id:      string;
  username:     string;
  access_token: string;
}

export interface MeResponse {
  user_id:    string;
  username:   string;
  email:      string;
  role:       string;
  created_at: string;
}