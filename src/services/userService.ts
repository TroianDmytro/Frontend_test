import { authService } from './authService';

// Base API URL
const API_BASE_URL = 'http://localhost:8000/api';

// Extended User Profile interface based on API documentation
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  second_name: string;
  age?: number;
  telefon_number?: string;
  isEmailVerified: boolean;
  isBlocked: boolean;
  hasAvatar: boolean;
  avatarUrl?: string;
  roles: string[];
  registrationDate: string;
  authProvider: 'local' | 'google';
  isGoogleUser: boolean;
  progressStats: {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    overallProgress: number;
  };
  activeCourses: CourseProgress[];
  completedCourses: CourseProgress[];
  contacts: ContactsInfo;
}

// Course Progress interface
export interface CourseProgress {
  id: string;
  title: string;
  progress: number;
  status: string;
  lastAccessed?: string;
  completedAt?: string;
}

// Contacts interface
export interface ContactsInfo {
  manager: {
    phone: string;
    name: string;
  };
  curator: {
    phone: string;
    name: string;
  };
  discordGroup: string;
  telegramGroup: string;
}

// Progress Statistics interface
export interface ProgressStats {
  overallStats: {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    averageProgress: number;
    totalLessons: number;
    completedLessons: number;
    totalStudyTime: string;
    streakDays: number;
  };
  courseProgress: DetailedCourseProgress[];
  achievements: Achievement[];
  weeklyProgress: WeeklyProgressItem[];
}

// Detailed Course Progress interface
export interface DetailedCourseProgress {
  courseId: string;
  courseName: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  timeSpent: string;
  lastAccessed: string;
  status: string;
}

// Achievement interface
export interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedAt: string;
  icon: string;
}

// Weekly Progress interface
export interface WeeklyProgressItem {
  day: string;
  lessonsCompleted: number;
  timeSpent: string;
}

// Subscription interface
export interface Subscription {
  id: string;
  courseId: string;
  courseName: string;
  subscriptionType: string;
  status: string;
  startDate: string;
  endDate: string;
  progress: number;
  daysRemaining: number;
  isPaid: boolean;
  autoRenewal: boolean;
}

// Subscriptions Response interface
export interface SubscriptionsResponse {
  subscriptions: Subscription[];
  totalActiveSubscriptions: number;
  totalCompletedCourses: number;
}

// User Courses Response interface
export interface UserCoursesResponse {
  courses: UserCourse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  stats: {
    totalCourses: number;
    activeCourses: number;
    completedCourses: number;
    averageProgress: number;
  };
}

// User Course interface
export interface UserCourse {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: string;
  imageUrl: string;
  teacher: {
    id: string;
    name: string;
    avatar: string;
  };
  category: string;
  difficulty: string;
  totalLessons: number;
  completedLessons: number;
  estimatedTime: string;
  lastAccessed: string;
  nextLesson?: {
    id: string;
    title: string;
    order: number;
  };
}

// Wallet interface
export interface WalletInfo {
  balance: number;
  currency: string;
  transactions: Transaction[];
  cards: PaymentCard[];
}

// Transaction interface
export interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
  status: string;
}

// Payment Card interface
export interface PaymentCard {
  id: string;
  lastFour: string;
  brand: string;
  isDefault: boolean;
  expiryMonth: number;
  expiryYear: number;
}

// User Settings interface
export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    courseReminders: boolean;
    achievementAlerts: boolean;
    weeklyReports: boolean;
  };
  privacy: {
    profileVisibility: string;
    showProgress: boolean;
    allowMessages: boolean;
  };
  learning: {
    dailyGoal: number;
    preferredStudyTime: string;
    autoplay: boolean;
    language: string;
  };
}

// Update user profile interface
export interface UpdateUserProfile {
  name?: string;
  second_name?: string;
  age?: number;
  telefon_number?: string;
}

// API Response interface
export interface UpdateUserResponse {
  message: string;
  user: UserProfile;
}

class UserService {
  private getAuthHeaders() {
    const token = authService.getStoredToken();
    if (!token) {
      throw new Error('Токен авторизації не знайдено');
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Get current user profile
   */
  async getCurrentUserProfile(): Promise<UserProfile> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при отриманні профілю');
      }

      const data: UserProfile = await response.json();
      console.log('✅ [UserService] Profile loaded successfully:', data);
      
      return data;
    } catch (error) {
      console.error('❌ [UserService] Error getting current profile:', error);
      throw error;
    }
  }

  /**
   * Get user progress statistics
   */
  async getUserProgress(): Promise<ProgressStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me/progress`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при отриманні статистики прогресу');
      }

      const data: ProgressStats = await response.json();
      return data;
    } catch (error) {
      console.error('❌ [UserService] Error getting user progress:', error);
      throw error;
    }
  }

  /**
   * Get user active subscriptions
   */
  async getUserSubscriptions(): Promise<SubscriptionsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions/me`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при отриманні підписок');
      }

      const data: SubscriptionsResponse = await response.json();
      return data;
    } catch (error) {
      console.error('❌ [UserService] Error getting user subscriptions:', error);
      throw error;
    }
  }

  /**
   * Get user courses
   */
  async getUserCourses(status?: 'active' | 'completed' | 'pending', page = 1, limit = 10): Promise<UserCoursesResponse> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (status) {
        queryParams.append('status', status);
      }

      const response = await fetch(`${API_BASE_URL}/courses/me?${queryParams}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при отриманні курсів');
      }

      const data: UserCoursesResponse = await response.json();
      return data;
    } catch (error) {
      console.error('❌ [UserService] Error getting user courses:', error);
      throw error;
    }
  }

  /**
   * Get user wallet information
   */
  async getUserWallet(): Promise<WalletInfo> {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/wallet/me`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при отриманні інформації про гаманець');
      }

      const data: WalletInfo = await response.json();
      return data;
    } catch (error) {
      console.error('❌ [UserService] Error getting user wallet:', error);
      throw error;
    }
  }

  /**
   * Get user settings
   */
  async getUserSettings(): Promise<UserSettings> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me/settings`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при отриманні налаштувань');
      }

      const data: UserSettings = await response.json();
      return data;
    } catch (error) {
      console.error('❌ [UserService] Error getting user settings:', error);
      throw error;
    }
  }

  /**
   * Update user settings
   */
  async updateUserSettings(settings: Partial<UserSettings>): Promise<{ message: string; settings: UserSettings }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me/settings`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при оновленні налаштувань');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ [UserService] Error updating user settings:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(updateData: UpdateUserProfile): Promise<UpdateUserResponse> {
    try {
      console.log('🔄 [UserService] Updating profile:', updateData);
      
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при оновленні профілю');
      }

      const data: UpdateUserResponse = await response.json();
      console.log('✅ [UserService] Profile updated successfully:', data);
      
      return data;
    } catch (error) {
      console.error('❌ [UserService] Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(file: File): Promise<{ message: string; avatarUrl: string; avatarId: string }> {
    try {
      const token = authService.getStoredToken();
      if (!token) {
        throw new Error('Токен авторизації не знайдено');
      }

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${API_BASE_URL}/avatars/upload/me`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при завантаженні аватара');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ [UserService] Error uploading avatar:', error);
      throw error;
    }
  }

  /**
   * Get user by ID (admin only) - deprecated for profile page
   */
  async getUserById(userId: string): Promise<UserProfile> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при отриманні користувача');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ [UserService] Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при отриманні списку користувачів');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ [UserService] Error getting all users:', error);
      throw error;
    }
  }

  /**
   * Block/unblock user (admin only)
   */
  async updateUserBlockStatus(userId: string, isBlocked: boolean): Promise<{ message: string; user: UserProfile }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/block`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ isBlocked })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при зміні статусу блокування');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ [UserService] Error updating block status:', error);
      throw error;
    }
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при видаленні користувача');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ [UserService] Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Add role to user (admin only)
   */
  async addRoleToUser(userId: string, roleId: string): Promise<UserProfile> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/roles/${roleId}`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при додаванні ролі');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ [UserService] Error adding role:', error);
      throw error;
    }
  }

  /**
   * Remove role from user (admin only)
   */
  async removeRoleFromUser(userId: string, roleId: string): Promise<UserProfile> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/roles/${roleId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при видаленні ролі');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ [UserService] Error removing role:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
