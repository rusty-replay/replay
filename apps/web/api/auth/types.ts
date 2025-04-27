export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  token: string;
  refreshToken: string;
  userId: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
