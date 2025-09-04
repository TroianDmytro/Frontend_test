// src/api/adminAPI.ts - Исправленная версия с правильными типами
import { API_BASE_URL } from '../services/authService';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
// Canonical types
import type { CategoryListResponse, DifficultyLevelListResponse, Subject, CourseListResponse, SubscriptionPlanListResponse, SubscriptionListResponse, TeacherApplicationsResponse, TeacherListResponse, Pagination } from '../types/api';
import type { AdminStatistics, User as AdminPanelUser } from '../types/admin.types';
import type { ApiError } from '../types/api';

// Local duplicate interfaces removed in favor of canonical definitions in types/admin.types.ts

class AdminAPI {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({ baseURL: API_BASE_URL });
        // Request interceptor: auth token + content-type
        this.client.interceptors.request.use((config) => {
            const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
            if (token) {
                config.headers = {
                    ...(config.headers || {}),
                    Authorization: `Bearer ${token}`
                } as any;
            }
            if (!config.headers?.['Content-Type'] && config.method && ['post','put','patch'].includes(config.method)) {
                config.headers = { ...(config.headers||{}), 'Content-Type': 'application/json' } as any;
            }
            return config;
        });

        // Response error interceptor: normalize error shape -> ApiError
        this.client.interceptors.response.use(
            r => r,
            (error) => {
                const status = error?.response?.status ?? 0;
                const data = error?.response?.data;
                let normalized: ApiError;
                if (data && typeof data === 'object') {
                    normalized = {
                        statusCode: data.statusCode ?? status,
                        message: data.message || data.detail || data.error || 'Unexpected error',
                        error: data.error || data.code || 'Error'
                    };
                } else {
                    normalized = {
                        statusCode: status,
                        message: error?.message || 'Network error',
                        error: 'NetworkError'
                    };
                }
                return Promise.reject(normalized);
            }
        );
    }

    // getAuthHeaders больше не используется напрямую после перехода на axios + интерцепторы

    // ========== СТАТИСТИКА АДМИНА ==========
    async getOverviewStatistics(): Promise<AdminStatistics> {
        try {
            // Параллельно загружаем все данные для админской статистики
            const [
                usersResponse,
                difficultyStatsResponse,
                subscriptionStatsResponse,
                planStatsResponse
            ] = await Promise.all([
                this.client.get('/users'),
                this.client.get('/difficulty-levels/statistics/overview'),
                this.client.get('/subscriptions/statistics/overview'),
                this.client.get('/subscription-plans/statistics/overview')
            ]);

            const users: AdminPanelUser[] = usersResponse.data;
            const difficultyStats = difficultyStatsResponse.data;
            const subscriptionStats = subscriptionStatsResponse.data;
            const planStats = planStatsResponse.data;

            // Обрабатываем статистику пользователей
            const currentDate = new Date();
            const oneMonthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 1));

            const userStatistics = {
                total: users.length,
                active: users.filter((u: AdminPanelUser) => !u.isBlocked).length,
                blocked: users.filter((u: AdminPanelUser) => u.isBlocked).length,
                newThisMonth: users.filter((u: AdminPanelUser) =>
                    new Date(u.createdAt) > oneMonthAgo
                ).length,
                byRole: {
                    users: users.filter((u: AdminPanelUser) => u.roles.includes('user')).length,
                    teachers: users.filter((u: AdminPanelUser) => u.roles.includes('teacher')).length,
                    admins: users.filter((u: AdminPanelUser) => u.roles.includes('admin')).length,
                    owners: users.filter((u: AdminPanelUser) => u.roles.includes('owner')).length
                },
                byAuthProvider: {
                    local: users.filter((u: AdminPanelUser) => u.authProvider === 'local').length,
                    google: users.filter((u: AdminPanelUser) => u.authProvider === 'google').length
                }
            };

            return {
                users: userStatistics,
                courses: {
                    total: difficultyStats.statistics?.totalCourses || 0,
                    published: difficultyStats.statistics?.publishedCourses || 0,
                    draft: difficultyStats.statistics?.totalCourses - difficultyStats.statistics?.publishedCourses || 0,
                    featured: planStats.statistics?.featuredPlans || 0
                },
                subscriptions: {
                    active: subscriptionStats.statistics?.activeSubscriptions || 0,
                    expired: subscriptionStats.statistics?.expiredSubscriptions || 0,
                    cancelled: subscriptionStats.statistics?.cancelledSubscriptions || 0,
                    total: subscriptionStats.statistics?.totalSubscriptions || 0
                },
                difficulties: difficultyStats.statistics || [],
                plans: planStats.statistics ? {
                    total: planStats.statistics?.totalPlans || 0,
                    active: planStats.statistics?.activePlans || 0,
                    subscribers: planStats.statistics?.totalSubscribers || 0
                } : undefined,
                rawData: {
                    users,
                    difficultyStats: difficultyStats.statistics,
                    subscriptionStats: subscriptionStats.statistics,
                    planStats: planStats.statistics
                }
            };
        } catch (error) {
            console.error('❌ [AdminAPI] Error getting overview statistics:', error);
            throw error;
        }
    }

    // ========== УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ==========
    async getUsers(page: number = 1, limit: number = 20, search: string = '') {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(search && { search })
            });

            const response = await this.client.get(`/users?${params.toString()}`);
            const users: AdminPanelUser[] = response.data;

            // Если ответ это массив (как в вашем контроллере)
            if (Array.isArray(users)) {
                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + limit;
                const paginatedUsers = users.slice(startIndex, endIndex);

                return {
                    users: paginatedUsers,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(users.length / limit),
                        totalItems: users.length,
                        itemsPerPage: limit
                    }
                };
            }

            return users;
        } catch (error) {
            console.error('❌ [AdminAPI] Error getting users:', error);
            throw error;
        }
    }

    // Обновление пользователя (имя, фамилия, email и т.д.)
    async updateUser(
        userId: string,
        data: {
            avatarId?: string;
            email?: string;
            name?: string;            // backend expects
            second_name?: string;     // backend expects
            age?: number;
            telefon_number?: string;
            // backward compatibility aliases
            firstName?: string;
            lastName?: string;
            roles?: string[];
        }
    ) {
        try {
            const payload: any = { ...data };
            // Bridge legacy field names -> backend contract if not explicitly provided
            if (!payload.name && payload.firstName) payload.name = payload.firstName;
            if (!payload.second_name && payload.lastName) payload.second_name = payload.lastName;
            // Remove undefined to avoid overwriting unintentionally
            Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);
            const response = await this.client.put(`/users/${userId}`, payload);
            return response.data;
        } catch (error) {
            console.error('❌ [AdminAPI] Error updating user:', error);
            throw error;
        }
    }

    async blockUser(userId: string, isBlocked: boolean) {
        try {
            const response = await this.client.patch(`/users/${userId}/block`, { isBlocked });
            return response.data.user;
        } catch (error) {
            console.error('❌ [AdminAPI] Error blocking user:', error);
            throw error;
        }
    }

    async deleteUser(userId: string) {
        try {
            const response = await this.client.delete(`/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('❌ [AdminAPI] Error deleting user:', error);
            throw error;
        }
    }

    // ========== УПРАВЛЕНИЕ КУРСАМИ ==========

    async toggleCoursePublication(courseId: string, isPublished: boolean) {
        try {
            const response = await this.client.patch(`/courses/${courseId}/publish`, { isPublished });
            return response.data.course;
        } catch (error) {
            console.error('❌ [AdminAPI] Error toggling course publication:', error);
            throw error;
        }
    }

    async getCourseStatistics(courseId: string) {
        try {
            const response = await this.client.get(`/courses/${courseId}/statistics`);
            return response.data.statistics;
        } catch (error) {
            console.error('❌ [AdminAPI] Error getting course statistics:', error);
            throw error;
        }
    }

    // ========== СИСТЕМНЫЕ ОПЕРАЦИИ ==========
    async updateAllDifficultyStatistics() {
        try {
            const response = await this.client.post('/difficulty-levels/update-all-statistics');
            return response.data;
        } catch (error) {
            console.error('❌ [AdminAPI] Error updating difficulty statistics:', error);
            throw error;
        }
    }

    async updateAllCategoriesStatistics() {
        try {
            const response = await this.client.post('/categories/update-all-statistics');
            return response.data;
        } catch (error) {
            console.error('❌ [AdminAPI] Error updating categories statistics:', error);
            throw error;
        }
    }

    async checkExpiringSubscriptions() {
        try {
            const response = await this.client.post('/subscriptions/expire-check');
            return response.data;
        } catch (error) {
            console.error('❌ [AdminAPI] Error checking expiring subscriptions:', error);
            throw error;
        }
    }

    // ========== ДЕТАЛЬНАЯ СТАТИСТИКА ==========
    async getDifficultyLevelsStatistics() {
        try {
            const response = await this.client.get('/difficulty-levels/statistics/overview');
            return response.data.statistics;
        } catch (error) {
            console.error('❌ [AdminAPI] Error getting difficulty statistics:', error);
            throw error;
        }
    }

    async getSubscriptionStatistics() {
        try {
            const response = await this.client.get('/subscriptions/statistics/overview');
            return response.data.statistics;
        } catch (error) {
            console.error('❌ [AdminAPI] Error getting subscription statistics:', error);
            throw error;
        }
    }

    async getSubscriptionPlansStatistics() {
        try {
            const response = await this.client.get('/subscription-plans/statistics/overview');
            return response.data.statistics;
        } catch (error) {
            console.error('❌ [AdminAPI] Error getting subscription plans statistics:', error);
            throw error;
        }
    }

    // ========== ПОЛУЧЕНИЕ КАТЕГОРИЙ ==========
    async getCategories(): Promise<CategoryListResponse> {
        try {
            const response = await this.client.get('/categories');
            return response.data as CategoryListResponse;
        } catch (error) {
            console.error('❌ [AdminAPI] Error getting categories:', error);
            throw error;
        }
    }

    // ========== ПОЛУЧЕНИЕ РОЛЕЙ ==========
    async getRoles() {
        try {
            const response = await this.client.get('/roles');
            return response.data;
        } catch (error) {
            console.error('❌ [AdminAPI] Error getting roles:', error);
            throw error;
        }
    }

    // ========== CATEGORIES CRUD ==========
    async createCategory(data: { name: string; description?: string | null; slug?: string; short_description?: string | null; color?: string | null; parent_id?: string | null; isActive?: boolean; isFeatured?: boolean; order?: number; meta_title?: string | null; meta_description?: string | null; meta_keywords?: string[] }) {
    const res = await this.client.post('/categories', data);
    return res.data;
    }

    async updateCategory(id: string, data: { name?: string; description?: string | null; slug?: string; short_description?: string | null; color?: string | null; parent_id?: string | null; isActive?: boolean; isFeatured?: boolean; order?: number; meta_title?: string | null; meta_description?: string | null; meta_keywords?: string[] }) {
    const res = await this.client.put(`/categories/${id}`, data);
    return res.data;
    }

    async deleteCategory(id: string) {
    const res = await this.client.delete(`/categories/${id}`);
    return res.data;
    }

    // ========== DIFFICULTY LEVELS CRUD ==========
    async getDifficultyLevels(): Promise<DifficultyLevelListResponse> {
        const res = await this.client.get('/difficulty-levels');
        return res.data as DifficultyLevelListResponse;
    }

    async createDifficulty(data: { name: string; description?: string | null; slug?: string; code?: string; level?: number; color?: string | null; isActive?: boolean; order?: number }) {
    const res = await this.client.post('/difficulty-levels', data);
    return res.data;
    }

    async updateDifficulty(id: string, data: { name?: string; description?: string | null; slug?: string; code?: string; level?: number; color?: string | null; isActive?: boolean; order?: number }) {
    const res = await this.client.put(`/difficulty-levels/${id}`, data);
    return res.data;
    }

    async deleteDifficulty(id: string) {
    const res = await this.client.delete(`/difficulty-levels/${id}`);
    return res.data;
    }

    // ========== COURSES BASIC CRUD ==========
    async getCourses(params: { page?: number; limit?: number } = {}): Promise<CourseListResponse> {
        // Some environments currently reject pagination params ("property page should not exist").
        // We'll try a sequence of query param patterns and normalize result.
        const page = params.page ?? 1;
        const limit = Math.min(params.limit ?? 20, 50);
        const attempts: Array<Record<string, number>> = [
            {},                                     // no pagination params
            { pageNumber: page, pageSize: limit },  // alternative naming
            { skip: (page - 1) * limit, take: limit } // skip/take style
        ];
        let lastError: any = null;
        for (const qp of attempts) {
            const qs = new URLSearchParams();
            Object.entries(qp).forEach(([k, v]) => qs.set(k, String(v)));
            const url = `/courses${qs.toString() ? `?${qs.toString()}` : ''}`;
            try {
                const res = await this.client.get(url);
                const data = res.data;
                // Normalize possible shapes:
                // 1) { courses: [...], pagination: {...} }
                // 2) plain array [...]
                // 3) { data: [...], total / totalItems }
                const coursesRaw = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.courses)
                        ? data.courses
                        : Array.isArray(data?.data)
                            ? data.data
                            : [];
                const totalItems = (data?.pagination?.totalItems) ?? data?.totalItems ?? data?.total ?? coursesRaw.length;
                const totalPages = data?.pagination?.totalPages ?? (limit ? Math.max(1, Math.ceil(totalItems / limit)) : 1);
                const pagination: Pagination = {
                    currentPage: page,
                    totalPages,
                    totalItems,
                    itemsPerPage: limit
                };
                return { courses: coursesRaw, pagination } as CourseListResponse;
            } catch (e: any) {
                lastError = e;
                const msgs: string[] = e?.response?.data && Array.isArray(e.response.data)
                    ? e.response.data : [];
                const hasExtraneous = msgs.some(m => /property (page|limit)/i.test(m));
                if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
                    console.warn('[adminAPI:getCourses] attempt failed', { url, serverData: e?.response?.data });
                }
                if (!hasExtraneous) break; // if error not about extraneous params, abort further attempts
                // else try next pattern
            }
        }
        throw lastError;
    }
    async createCourse(data: { title: string; description?: string | null }) {
    const res = await this.client.post('/courses', data);
    return res.data;
    }

    async updateCourse(id: string, data: { title?: string; description?: string | null }) {
    const res = await this.client.put(`/courses/${id}`, data);
    return res.data;
    }

    async deleteCourse(id: string) {
    const res = await this.client.delete(`/courses/${id}`);
    return res.data;
    }
    async publishCourse(id: string) {
    const res = await this.client.post(`/courses/${id}/publish`);
    return res.data;
    }
    async duplicateCourse(id: string) {
    const res = await this.client.post(`/courses/${id}/duplicate`);
    return res.data;
    }
    async adminEnroll(courseId: string, userId: string) {
    const res = await this.client.post(`/courses/${courseId}/admin-enroll`, { userId });
    return res.data;
    }
    async updateCourseStartDate(courseId: string, startDate: string) {
    const res = await this.client.put(`/courses/${courseId}/start-date`, { startDate });
    return res.data;
    }
    // ========== COURSE SUBJECTS (3-STEP FLOW) ==========
    async addCourseSubject(courseId: string, data: { subjectId: string }) {
        // Шаг 1 — привязка существующего предмета к курсу
    const res = await this.client.post(`/courses/${courseId}/subjects`, data);
    return res.data;
    }
    async assignSubjectTeacher(courseId: string, subjectId: string, teacherId: string) {
    const res = await this.client.put(`/courses/${courseId}/subjects/${subjectId}/teacher`, { teacherId });
    return res.data;
    }
    async setSubjectStartDate(courseId: string, subjectId: string, startDate: string) {
    const res = await this.client.put(`/courses/${courseId}/subjects/${subjectId}/start-date`, { startDate });
    return res.data;
    }
    async getCourseSubjects(courseId: string) {
    const res = await this.client.get(`/courses/${courseId}/subjects`);
    return res.data;
    }
    async deleteCourseSubject(courseId: string, subjectId: string) {
    const res = await this.client.delete(`/courses/${courseId}/subjects/${subjectId}`);
    return res.data;
    }

    // ========== SUBJECTS CRUD ==========
    async getSubjects(): Promise<Subject[]> {
        const res = await this.client.get('/subjects');
        return res.data as Subject[]; // endpoint returns raw array
    }
    async createSubject(data: { name: string; description?: string | null }) {
    const res = await this.client.post('/subjects', data);
    return res.data;
    }
    async updateSubject(id: string, data: { name?: string; description?: string | null }) {
    const res = await this.client.put(`/subjects/${id}`, data);
    return res.data;
    }
    async deleteSubject(id: string) {
    const res = await this.client.delete(`/subjects/${id}`);
    return res.data;
    }

    // ========== SUBJECT STUDY MATERIALS ==========
    async addSubjectMaterial(subjectId: string, data: { title: string; type: string; url?: string | null; description?: string | null }) {
        const res = await this.client.post(`/subjects/${subjectId}/materials`, data);
        return res.data;
    }
    async deleteSubjectMaterial(subjectId: string, materialId: string) {
        const res = await this.client.delete(`/subjects/${subjectId}/materials/${materialId}`);
        return res.data;
    }

    // ========== COURSE STUDENTS / EXTENDED COURSE DATA ==========
    async getCourseStudents(courseId: string) {
    const res = await this.client.get(`/courses/${courseId}/students`);
    return res.data;
    }

    // ========== SUBSCRIPTION PLANS MANAGEMENT ==========
    async getSubscriptionPlans(): Promise<SubscriptionPlanListResponse> {
        const res = await this.client.get('/subscription-plans');
        return res.data as SubscriptionPlanListResponse;
    }
    async createSubscriptionPlan(data: { name: string; slug?: string; price: number; currency?: string; period_type?: string; periodDays?: number | null; description?: string | null; discount_percent?: number; original_price?: number; is_active?: boolean; is_popular?: boolean }) {
        const res = await this.client.post('/subscription-plans', data);
        return res.data;
    }
    async updateSubscriptionPlan(id: string, data: { name?: string; slug?: string; price?: number; currency?: string; period_type?: string; periodDays?: number | null; description?: string | null; discount_percent?: number; original_price?: number; is_active?: boolean; is_popular?: boolean }) {
        const res = await this.client.put(`/subscription-plans/${id}`, data);
        return res.data;
    }
    async deleteSubscriptionPlan(id: string) {
    const res = await this.client.delete(`/subscription-plans/${id}`);
    return res.data;
    }
    async activateSubscriptionPlan(id: string) {
    const res = await this.client.put(`/subscription-plans/${id}/activate`);
    return res.data;
    }

    // ========== SUBSCRIPTIONS MANAGEMENT ==========
    async getSubscriptions(params: { page?: number; limit?: number; userId?: string; courseId?: string; status?: string; plan?: string } = {}): Promise<SubscriptionListResponse> {
        const page = params.page ?? 1;
        const limit = Math.min(params.limit ?? 20, 100);
        // Build filter params independent of pagination fallback attempts
        const baseFilter = (qp: Record<string, any>) => {
            if (params.userId) qp.userId = params.userId;
            if (params.courseId) qp.courseId = params.courseId;
            if (params.status) qp.status = params.status;
            if (params.plan) qp.plan = params.plan;
            return qp;
        };
        const attempts: Array<Record<string, number | string>> = [
            baseFilter({}),
            baseFilter({ pageNumber: page, pageSize: limit }),
            baseFilter({ skip: (page - 1) * limit, take: limit })
        ];
        let lastError: any = null;
        for (const qp of attempts) {
            const qs = new URLSearchParams();
            Object.entries(qp).forEach(([k, v]) => qs.set(k, String(v)));
            const url = `/subscriptions${qs.toString() ? `?${qs.toString()}` : ''}`;
            try {
                const res = await this.client.get(url);
                const data = res.data;
                const subsRaw = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.subscriptions)
                        ? data.subscriptions
                        : Array.isArray(data?.data)
                            ? data.data
                            : [];
                const totalItems = (data?.pagination?.totalItems) ?? data?.totalItems ?? data?.total ?? subsRaw.length;
                const totalPages = data?.pagination?.totalPages ?? (limit ? Math.max(1, Math.ceil(totalItems / limit)) : 1);
                const pagination: Pagination = {
                    currentPage: page,
                    totalPages,
                    totalItems,
                    itemsPerPage: limit
                };
                return { subscriptions: subsRaw, pagination } as SubscriptionListResponse;
            } catch (e: any) {
                lastError = e;
                const msgs: string[] = e?.response?.data && Array.isArray(e.response.data)
                    ? e.response.data : [];
                const hasExtraneous = msgs.some(m => /property (page|limit)/i.test(m));
                if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
                    console.warn('[adminAPI:getSubscriptions] attempt failed', { url, serverData: e?.response?.data });
                }
                if (!hasExtraneous) break;
            }
        }
        throw lastError;
    }
    async cancelSubscription(id: string, reason?: string) {
    const res = await this.client.post(`/subscriptions/${id}/cancel`, reason ? { reason } : {});
    return res.data;
    }
    async renewSubscription(id: string) {
    const res = await this.client.post(`/subscriptions/${id}/renew`);
    return res.data;
    }
    async activateSubscription(id: string) {
    const res = await this.client.post(`/subscriptions/${id}/activate`);
    return res.data;
    }

    // ========== PAYMENTS (MINIMAL ADMIN VIEW) ==========
    async getPaymentsByUser(userId: string) {
    const res = await this.client.get(`/payments/user/${userId}`);
    return res.data;
    }
    async getPayment(id: string) {
    const res = await this.client.get(`/payments/${id}`);
    return res.data;
    }
    async cancelPayment(id: string) {
    const res = await this.client.put(`/payments/${id}/cancel`);
    return res.data;
    }
    async syncPayment(invoiceId: string) {
    const res = await this.client.post(`/payments/${invoiceId}/sync`);
    return res.data;
    }

    // ========== TEACHER APPLICATIONS & MODERATION ==========
    async getTeacherApplications(): Promise<TeacherApplicationsResponse> {
        const res = await this.client.get('/teachers/pending/applications');
        return res.data as TeacherApplicationsResponse;
    }
    async approveTeacher(id: string) {
    const res = await this.client.post(`/teachers/${id}/approve`);
    return res.data;
    }
    async blockTeacher(id: string) {
    const res = await this.client.post(`/teachers/${id}/block`);
    return res.data;
    }

    // ========== TEACHERS LIST (CRUD базового уровня) ==========
    async getTeachers(params: { page?: number; limit?: number } = {}): Promise<TeacherListResponse> {
        const q = new URLSearchParams();
        q.set('page', String(params.page ?? 1));
        if (params.limit) q.set('limit', String(params.limit));
        const res = await this.client.get(`/teachers?${q.toString()}`);
        return res.data as TeacherListResponse;
    }
    async unblockTeacher(id: string) {
    const res = await this.client.post(`/teachers/${id}/unblock`);
    return res.data;
    }

    // ========= TEACHER PROFILE UPDATE =========
    async updateTeacher(id: string, data: {
        email?: string;
        name?: string; // full name or first part depending on backend expectation
        second_name?: string;
        age?: number;
        telefon_number?: string;
        description?: string;
        specialization?: string;
        education?: string;
        experience_years?: number;
        skills?: string[];
        cv_file_url?: string;
        password?: string;
    }) {
        const res = await this.client.put(`/teachers/${id}`, data);
        return res.data;
    }
}

export const adminAPI = new AdminAPI();