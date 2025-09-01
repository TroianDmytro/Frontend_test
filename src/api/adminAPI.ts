// src/api/adminAPI.ts - Исправленная версия с правильными типами
import { API_BASE_URL } from '../services/authService';

// Интерфейсы
interface User {
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
}

interface AdminStatistics {
    users: {
        total: number;
        active: number;
        blocked: number;
        newThisMonth: number;
        byRole: {
            users: number;
            teachers: number;
            admins: number;
            owners: number;
        };
        byAuthProvider: {
            local: number;
            google: number;
        };
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
    difficulties: any[];
    plans: {
        total: number;
        active: number;
        subscribers: number;
    };
    rawData?: any;
}

class AdminAPI {
    private getAuthHeaders() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Токен авторизации не найден');
        }

        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

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
                fetch(`${API_BASE_URL}/users`, {
                    method: 'GET',
                    headers: this.getAuthHeaders()
                }),
                fetch(`${API_BASE_URL}/difficulty-levels/statistics/overview`, {
                    method: 'GET',
                    headers: this.getAuthHeaders()
                }),
                fetch(`${API_BASE_URL}/subscriptions/statistics/overview`, {
                    method: 'GET',
                    headers: this.getAuthHeaders()
                }),
                fetch(`${API_BASE_URL}/subscription-plans/statistics/overview`, {
                    method: 'GET',
                    headers: this.getAuthHeaders()
                })
            ]);

            const users: User[] = await usersResponse.json();
            const difficultyStats = await difficultyStatsResponse.json();
            const subscriptionStats = await subscriptionStatsResponse.json();
            const planStats = await planStatsResponse.json();

            // Обрабатываем статистику пользователей
            const currentDate = new Date();
            const oneMonthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 1));

            const userStatistics = {
                total: users.length,
                active: users.filter((u: User) => !u.isBlocked).length,
                blocked: users.filter((u: User) => u.isBlocked).length,
                newThisMonth: users.filter((u: User) =>
                    new Date(u.createdAt) > oneMonthAgo
                ).length,
                byRole: {
                    users: users.filter((u: User) => u.roles.includes('user')).length,
                    teachers: users.filter((u: User) => u.roles.includes('teacher')).length,
                    admins: users.filter((u: User) => u.roles.includes('admin')).length,
                    owners: users.filter((u: User) => u.roles.includes('owner')).length
                },
                byAuthProvider: {
                    local: users.filter((u: User) => u.authProvider === 'local').length,
                    google: users.filter((u: User) => u.authProvider === 'google').length
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
                plans: {
                    total: planStats.statistics?.totalPlans || 0,
                    active: planStats.statistics?.activePlans || 0,
                    subscribers: planStats.statistics?.totalSubscribers || 0
                },
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

            const response = await fetch(`${API_BASE_URL}/users?${params}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке пользователей');
            }

            const users: User[] = await response.json();

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

    async blockUser(userId: string, isBlocked: boolean) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}/block`, {
                method: 'PATCH',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ isBlocked })
            });

            if (!response.ok) {
                throw new Error('Ошибка при изменении статуса блокировки');
            }

            const result = await response.json();
            return result.user;
        } catch (error) {
            console.error('❌ [AdminAPI] Error blocking user:', error);
            throw error;
        }
    }

    async deleteUser(userId: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Ошибка при удалении пользователя');
            }

            return await response.json();
        } catch (error) {
            console.error('❌ [AdminAPI] Error deleting user:', error);
            throw error;
        }
    }

    // ========== УПРАВЛЕНИЕ КУРСАМИ ==========
    async getCourses(page: number = 1, limit: number = 20) {
        try {
            // Используем админский эндпоинт для получения полной информации
            const response = await fetch(`${API_BASE_URL}/courses?page=${page}&limit=${limit}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке курсов');
            }

            return await response.json();
        } catch (error) {
            console.error('❌ [AdminAPI] Error getting courses:', error);
            throw error;
        }
    }

    async toggleCoursePublication(courseId: string, isPublished: boolean) {
        try {
            const response = await fetch(`${API_BASE_URL}/courses/${courseId}/publish`, {
                method: 'PATCH',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ isPublished })
            });

            if (!response.ok) {
                throw new Error('Ошибка при изменении статуса публикации');
            }

            const result = await response.json();
            return result.course;
        } catch (error) {
            console.error('❌ [AdminAPI] Error toggling course publication:', error);
            throw error;
        }
    }

    async getCourseStatistics(courseId: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/courses/${courseId}/statistics`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке статистики курса');
            }

            const result = await response.json();
            return result.statistics;
        } catch (error) {
            console.error('❌ [AdminAPI] Error getting course statistics:', error);
            throw error;
        }
    }

    // ========== СИСТЕМНЫЕ ОПЕРАЦИИ ==========
    async updateAllDifficultyStatistics() {
        try {
            const response = await fetch(`${API_BASE_URL}/difficulty-levels/update-all-statistics`, {
                method: 'POST',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Ошибка при обновлении статистики уровней сложности');
            }

            return await response.json();
        } catch (error) {
            console.error('❌ [AdminAPI] Error updating difficulty statistics:', error);
            throw error;
        }
    }

    async updateAllCategoriesStatistics() {
        try {
            const response = await fetch(`${API_BASE_URL}/categories/update-all-statistics`, {
                method: 'POST',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Ошибка при обновлении статистики категорий');
            }

            return await response.json();
        } catch (error) {
            console.error('❌ [AdminAPI] Error updating categories statistics:', error);
            throw error;
        }
    }

    async checkExpiringSubscriptions() {
        try {
            const response = await fetch(`${API_BASE_URL}/subscriptions/expire-check`, {
                method: 'POST',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Ошибка при проверке истекающих подписок');
            }

            return await response.json();
        } catch (error) {
            console.error('❌ [AdminAPI] Error checking expiring subscriptions:', error);
            throw error;
        }
    }

    // ========== ДЕТАЛЬНАЯ СТАТИСТИКА ==========
    async getDifficultyLevelsStatistics() {
        try {
            const response = await fetch(`${API_BASE_URL}/difficulty-levels/statistics/overview`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке статистики уровней сложности');
            }

            const result = await response.json();
            return result.statistics;
        } catch (error) {
            console.error('❌ [AdminAPI] Error getting difficulty statistics:', error);
            throw error;
        }
    }

    async getSubscriptionStatistics() {
        try {
            const response = await fetch(`${API_BASE_URL}/subscriptions/statistics/overview`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке статистики подписок');
            }

            const result = await response.json();
            return result.statistics;
        } catch (error) {
            console.error('❌ [AdminAPI] Error getting subscription statistics:', error);
            throw error;
        }
    }

    async getSubscriptionPlansStatistics() {
        try {
            const response = await fetch(`${API_BASE_URL}/subscription-plans/statistics/overview`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке статистики тарифных планов');
            }

            const result = await response.json();
            return result.statistics;
        } catch (error) {
            console.error('❌ [AdminAPI] Error getting subscription plans statistics:', error);
            throw error;
        }
    }

    // ========== ПОЛУЧЕНИЕ КАТЕГОРИЙ ==========
    async getCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке категорий');
            }

            return await response.json();
        } catch (error) {
            console.error('❌ [AdminAPI] Error getting categories:', error);
            throw error;
        }
    }

    // ========== ПОЛУЧЕНИЕ РОЛЕЙ ==========
    async getRoles() {
        try {
            const response = await fetch(`${API_BASE_URL}/roles`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке ролей');
            }

            return await response.json();
        } catch (error) {
            console.error('❌ [AdminAPI] Error getting roles:', error);
            throw error;
        }
    }
}

export const adminAPI = new AdminAPI();