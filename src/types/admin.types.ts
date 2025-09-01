// src/types/admin.types.ts

// ========== ПОЛЬЗОВАТЕЛИ ==========
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    isBlocked: boolean;
    isEmailConfirmed: boolean;
    createdAt: string;
    lastActivity: string;
    authProvider: 'local' | 'google';
    avatar?: string;
    phone?: string;
}

// ========== КУРСЫ ==========
export interface Course {
    id: string;
    title: string;
    description: string;
    slug: string;
    imageUrl?: string;
    isPublished: boolean;
    is_active: boolean;
    price: number;
    currency: string;
    duration: number;
    difficulty: string;
    category: {
        id: string;
        name: string;
        slug: string;
    };
    teacher: {
        id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
    };
    studentsCount: number;
    lessonsCount: number;
    rating: number;
    reviewsCount: number;
    createdAt: string;
    updatedAt: string;
}

// ========== СТАТИСТИКА ==========
export interface AdminStatistics {
    users: {
        total: number;
        active: number;
        blocked: number;
        newThisMonth: number;
    };
    courses: {
        total: number;
        published: number;
        draft: number;
        featured: number;
    };
    subscriptions: {
        active: number;
        expired: number;
        cancelled: number;
        total: number;
    };
    difficulties: DifficultyLevelStatistics[];
    categories: CategoryStatistics[];
}

export interface OwnerStatistics extends AdminStatistics {
    financial: {
        totalRevenue: number;
        monthlyRevenue: number;
        yearlyRevenue: number;
        averageRevenuePerUser: number;
        monthlyGrowth: number;
        churnRate: number;
        conversionRate: number;
    };
    subscriptionPlans: SubscriptionPlanStats[];
}

// ========== ФИНАНСЫ ==========
export interface FinancialData {
    totalRevenue: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
    totalSubscribers: number;
    activeSubscriptions: number;
    newSubscriptionsThisMonth: number;
    churnRate: number;
    averageRevenuePerUser: number;
    planStatistics: SubscriptionPlanStats[];
    monthlyGrowth: number;
    conversionRate: number;
}

export interface SubscriptionPlanStats {
    id: string;
    name: string;
    price: number;
    currency: string;
    subscribers: number;
    revenue: number;
    growthRate: number;
    color: string;
    icon: string;
}

// ========== ПОДПИСКИ ==========
export interface SubscriptionStatistics {
    totalSubscriptions: number;
    activeSubscriptions: number;
    expiredSubscriptions: number;
    cancelledSubscriptions: number;
    pendingSubscriptions: number;
    newSubscriptionsThisMonth: number;
    churnRate: number;
    renewalRate: number;
    averageSubscriptionDuration: number;
    mostPopularPlan: string;
    revenueByPlan: Array<{
        planId: string;
        planName: string;
        revenue: number;
        subscribers: number;
    }>;
}

export interface SubscriptionPlanStatistics {
    totalPlans: number;
    activePlans: number;
    popularPlans: number;
    featuredPlans: number;
    totalSubscribers: number;
    totalRevenue: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
    averageRevenuePerUser: number;
    topPlans: Array<{
        id: string;
        name: string;
        subscribers: number;
        revenue: number;
    }>;
}

// ========== КАТЕГОРИИ ==========
export interface CategoryStatistics {
    id: string;
    name: string;
    slug: string;
    coursesCount: number;
    studentsCount: number;
    totalRevenue: number;
    averageRating: number;
    publishedCourses: number;
    draftCourses: number;
}

// ========== УРОВНИ СЛОЖНОСТИ ==========
export interface DifficultyLevelStatistics {
    id: string;
    name: string;
    code: string;
    level: number;
    coursesCount: number;
    studentsCount: number;
    averageRating: number;
    completionRate: number;
    publishedCourses: number;
    draftCourses: number;
}

// ========== РОЛИ ==========
export interface Role {
    id: string;
    name: string;
    description?: string;
    permissions?: string[];
}

// ========== API ОТВЕТЫ ==========
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: string[];
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

// ========== АНАЛИТИКА ==========
export interface RevenueAnalytics {
    data: Array<{
        date: string;
        revenue: number;
        subscriptions: number;
    }>;
    total: number;
    growth: number;
    averagePerDay: number;
}

export interface UserGrowthAnalytics {
    totalUsers: number;
    newUsersThisMonth: number;
    activeUsers: number;
    userGrowth: Array<{
        date: string;
        users: number;
        newUsers: number;
    }>;
    retentionRate: number;
    churnRate: number;
}

export interface CourseAnalytics {
    totalCourses: number;
    publishedCourses: number;
    draftCourses: number;
    averageRating: number;
    totalLessons: number;
    mostPopularCourses: Array<{
        id: string;
        title: string;
        studentsCount: number;
        rating: number;
    }>;
    categoryBreakdown: Array<{
        category: string;
        coursesCount: number;
        studentsCount: number;
    }>;
}

// ========== СИСТЕМНАЯ ИНФОРМАЦИЯ ==========
export interface SystemHealth {
    database: 'healthy' | 'warning' | 'error';
    api: 'healthy' | 'warning' | 'error';
    storage: 'healthy' | 'warning' | 'error';
    uptime: string;
    version: string;
    lastBackup?: string;
}

// ========== УВЕДОМЛЕНИЯ ==========
export interface AdminNotification {
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
    actionRequired?: boolean;
    link?: string;
}

// ========== НАСТРОЙКИ ==========
export interface SystemSettings {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    emailNotifications: boolean;
    maxFileSize: number;
    allowedFileTypes: string[];
    defaultCurrency: string;
    timezone: string;
}