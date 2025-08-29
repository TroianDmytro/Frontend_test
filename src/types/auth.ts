// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  login: string;
  name: string;
  second_name: string;
  isEmailVerified: boolean;
  roles: string[];
  provider: 'local' | 'google';
  avatar_url?: string;
  is_google_user: boolean;
}

// JWT Token Payload
export interface JWTPayload {
  email: string;
  login: string;
  sub: string;
  roles: string[];
  provider: 'local' | 'google';
  googleId?: string;
  iat: number;
  exp: number;
}

// Auth Requests
export interface SendCodeRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
  name: string;
  second_name: string;
  age?: number;
  telefon_number?: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  code: string;
  newPassword: string;
}

// Auth Responses
export interface SendCodeResponse {
  success: true;
  message: string;
  email: string;
}

export interface VerifyCodeResponse {
  success: true;
  message: string;
  user: User;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface GoogleStatusResponse {
  isLinked: boolean;
  googleId?: string;
  lastGoogleLogin?: string;
  hasValidToken: boolean;
}

export interface GoogleLinkResponse {
  message: string;
  linkUrl: string;
}

// Auth State
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Registration Steps
export enum RegistrationStep {
  EMAIL = 'email',
  CODE_VERIFICATION = 'code_verification',
  COMPLETED = 'completed'
}

export interface RegistrationState {
  step: RegistrationStep;
  email: string;
  isLoading: boolean;
  error: string | null;
}

// Auth Actions
export type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_USER'; payload: User };

// Form Types
export interface LoginFormData {
  login: string;
  password: string;
}

export interface RegistrationFormData {
  email: string;
  code?: string;
  name?: string;
  second_name?: string;
  age?: number;
  telefon_number?: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
