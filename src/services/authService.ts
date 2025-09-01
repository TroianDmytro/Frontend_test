import type {
  SendCodeRequest,
  SendCodeResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  LoginRequest,
  LoginResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  GoogleStatusResponse,
  GoogleLinkResponse,
  ApiError
} from '../types/auth';

// API Configuration
export const API_BASE_URL = import.meta.env.PROD
  ? 'https://neuronest.pp.ua/api/auth'
  : 'http://localhost:8000/api/auth';

class AuthApiError extends Error {
  constructor(public statusCode: number, message: string, public error: string) {
    super(message);
    this.name = 'AuthApiError';
  }
}

class AuthService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        statusCode: response.status,
        message: response.statusText,
        error: 'Network Error'
      }));
      
      throw new AuthApiError(
        errorData.statusCode,
        errorData.message,
        errorData.error
      );
    }

    return response.json();
  }

  // Registration Flow
  async sendVerificationCode(data: SendCodeRequest): Promise<SendCodeResponse> {
    const response = await fetch(`${API_BASE_URL}/register/send-code`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse<SendCodeResponse>(response);
  }

  async verifyCodeAndRegister(data: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    const response = await fetch(`${API_BASE_URL}/register/verify-code`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse<VerifyCodeResponse>(response);
  }

  async resendVerificationCode(data: SendCodeRequest): Promise<{ success: true; message: string }> {
    const response = await fetch(`${API_BASE_URL}/resend-code`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  // Authentication
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    const result = await this.handleResponse<LoginResponse>(response);
    
    // Save token to localStorage
    if (result.access_token) {
      localStorage.setItem('auth_token', result.access_token);
      localStorage.setItem('user_data', JSON.stringify(result.user));
    }

    return result;
  }

  async logout(): Promise<void> {
    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  // Password Management
  async changePassword(data: ChangePasswordRequest): Promise<{ success: true; message: string }> {
    const response = await fetch(`${API_BASE_URL}/change-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ success: true; message: string }> {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ success: true; message: string }> {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  // Google OAuth
  getGoogleAuthUrl(): string {
    return `${API_BASE_URL}/google`;
  }

  async getGoogleStatus(): Promise<GoogleStatusResponse> {
    const response = await fetch(`${API_BASE_URL}/google/status`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<GoogleStatusResponse>(response);
  }

  async linkGoogleAccount(): Promise<GoogleLinkResponse> {
    const response = await fetch(`${API_BASE_URL}/google/link`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<GoogleLinkResponse>(response);
  }

  async unlinkGoogleAccount(): Promise<{ success: true; message: string }> {
    const response = await fetch(`${API_BASE_URL}/google/unlink`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  // Token Management
  getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getStoredUser(): any | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  isTokenValid(): boolean {
    const token = this.getStoredToken();
    if (!token) return false;

    try {
      // Decode JWT payload (simple base64 decode for exp check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  // Utility method to handle Google OAuth callback
  handleGoogleCallback(urlParams: URLSearchParams): { token: string; user: any } | null {
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');

    console.log('Google OAuth callback received:', { 
      hasToken: !!token, 
      hasUser: !!userParam,
      tokenLength: token?.length || 0 
    });

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        
        console.log('Parsed Google user data:', {
          id: user.id,
          email: user.email,
          name: user.name,
          provider: user.provider
        });
        
        // Save to localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        console.log('Google OAuth data saved to localStorage successfully');
        
        return { token, user };
      } catch (error) {
        console.error('Error parsing Google OAuth response:', error);
        console.error('Raw user param:', userParam);
      }
    } else {
      console.warn('Missing token or user parameter in Google OAuth callback');
    }
    
    return null;
  }
}

export const authService = new AuthService();
export { AuthApiError };
