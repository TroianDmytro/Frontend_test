// src/api/client.ts
import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Интерфейс для стандартного API ответа
interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    errors?: string[];
}

// Создаем базовый экземпляр axios
const createApiClient = (): AxiosInstance => {
    const client = axios.create({
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Интерцептор для добавления токена авторизации
    client.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Интерцептор для обработки ответов
    client.interceptors.response.use(
        (response: AxiosResponse) => {
            // Если сервер возвращает стандартную структуру, извлекаем данные
            if (response.data && typeof response.data === 'object' && 'data' in response.data) {
                return { ...response, data: response.data.data };
            }
            return response;
        },
        (error: AxiosError) => {
            // Обработка различных типов ошибок
            if (error.response) {
                const { status, data } = error.response;

                // Обработка ошибок авторизации
                if (status === 401) {
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                    return Promise.reject(new Error('Сессия истекла. Необходимо войти в систему.'));
                }

                // Обработка ошибок доступа
                if (status === 403) {
                    return Promise.reject(new Error('Недостаточно прав для выполнения операции.'));
                }

                // Обработка серверных ошибок
                if (status >= 500) {
                    return Promise.reject(new Error('Ошибка сервера. Попробуйте позже.'));
                }

                // Извлекаем сообщение об ошибке из ответа
                const errorMessage = (data as any)?.message || 'Произошла ошибка';
                return Promise.reject(new Error(errorMessage));
            }

            // Обработка сетевых ошибок
            if (error.request) {
                return Promise.reject(new Error('Нет соединения с сервером'));
            }

            return Promise.reject(error);
        }
    );

    return client;
};

export const apiClient = createApiClient();

// Утилиты для работы с API
export const apiUtils = {
    // Обработка параметров запроса
    buildParams: (params: Record<string, any>): URLSearchParams => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value)) {
                    value.forEach(item => searchParams.append(key, item.toString()));
                } else {
                    searchParams.append(key, value.toString());
                }
            }
        });

        return searchParams;
    },

    // Обработка ошибок загрузки файлов
    handleFileUpload: async (file: File, endpoint: string, onProgress?: (progress: number) => void) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await apiClient.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total && onProgress) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onProgress(progress);
                    }
                },
            });

            return response.data;
        } catch (error) {
            throw new Error('Ошибка загрузки файла');
        }
    },

    // Проверка статуса соединения
    healthCheck: async (): Promise<boolean> => {
        try {
            await apiClient.get('/health');
            return true;
        } catch {
            return false;
        }
    }
};

// Типы для работы с API
export type { ApiResponse };