// src/components/admin/AdminPanel.tsx - Исправления типов
import { useState, useEffect } from 'react';
import { Users, BookOpen, CreditCard, TrendingUp, RefreshCw, Shield, Trash2, Lock, Unlock } from 'lucide-react';
import { adminAPI } from '../../api/adminAPI';

// Интерфейсы для типизации
interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: any[];
    isBlocked: boolean;
    isEmailConfirmed?: boolean;
    createdAt: string;
    lastActivity?: string;
    authProvider?: 'local' | 'google';
}

interface Course {
    id: string;
    title: string;
    description: string;
    isPublished: boolean;
    studentsCount?: number;
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
}

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const tabs = [
        { id: 'overview', label: 'Обзор', icon: TrendingUp },
        { id: 'users', label: 'Пользователи', icon: Users },
        { id: 'courses', label: 'Курсы', icon: BookOpen },
        { id: 'subscriptions', label: 'Подписки', icon: CreditCard },
        { id: 'system', label: 'Система', icon: Shield }
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const [statsData, usersData] = await Promise.all([
                adminAPI.getOverviewStatistics(),
                adminAPI.getUsers(1, 50)
            ]);

            setStatistics(statsData);
            setUsers(Array.isArray(usersData) ? usersData : usersData.users || []);
        } catch (error: any) {
            console.error('❌ Error loading admin data:', error);
            setError('Ошибка загрузки данных: ' + (error?.message || 'Неизвестная ошибка'));
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshData = async () => {
        try {
            setRefreshing(true);
            await loadData();
        } finally {
            setRefreshing(false);
        }
    };

    const handleBlockUser = async (userId: string, isBlocked: boolean) => {
        try {
            await adminAPI.blockUser(userId, isBlocked);
            setUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, isBlocked } : user
            ));
        } catch (error: any) {
            console.error('❌ Error blocking user:', error);
            setError('Ошибка при изменении статуса пользователя: ' + (error?.message || 'Неизвестная ошибка'));
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Вы уверены, что хотите удалить пользователя?')) return;

        try {
            await adminAPI.deleteUser(userId);
            setUsers(prev => prev.filter(user => user.id !== userId));
        } catch (error: any) {
            console.error('❌ Error deleting user:', error);
            setError('Ошибка при удалении пользователя: ' + (error?.message || 'Неизвестная ошибка'));
        }
    };

    const handleSystemOperation = async (operation: string) => {
        try {
            setRefreshing(true);

            switch (operation) {
                case 'update-difficulty-stats':
                    await adminAPI.updateAllDifficultyStatistics();
                    break;
                case 'update-categories-stats':
                    await adminAPI.updateAllCategoriesStatistics();
                    break;
                case 'check-subscriptions':
                    const result = await adminAPI.checkExpiringSubscriptions();
                    alert(`Проверено подписок. Истекших: ${result?.expiredCount || 0}, уведомлений: ${result?.notifiedCount || 0}`);
                    break;
                default:
                    break;
            }

            alert('Операция выполнена успешно');
            await loadData();
        } catch (error: any) {
            console.error('❌ Error performing system operation:', error);
            setError('Ошибка выполнения операции: ' + (error?.message || 'Неизвестная ошибка'));
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-cabinet-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-cabinet-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-cabinet-white">Загрузка данных администратора...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cabinet-black text-cabinet-white">
            <div className="container mx-auto px-6 py-8">
                {/* Заголовок */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <Shield className="w-8 h-8 text-cabinet-blue mr-3" />
                        <h1 className="text-3xl font-bold">Панель администратора</h1>
                    </div>
                    <button
                        onClick={handleRefreshData}
                        disabled={refreshing}
                        className="flex items-center px-4 py-2 bg-cabinet-blue hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Обновить
                    </button>
                </div>

                {/* Ошибка */}
                {error && (
                    <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Навигация */}
                <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === tab.id
                                    ? 'bg-cabinet-blue text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                }`}
                        >
                            <tab.icon className="w-4 h-4 mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Контент */}
                {activeTab === 'overview' && statistics && (
                    <div className="space-y-8">
                        {/* Статистика пользователей */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Всего пользователей</h3>
                                <p className="text-3xl font-bold text-cabinet-blue">{statistics.users?.total || 0}</p>
                                <p className="text-sm text-gray-400">+{statistics.users?.newThisMonth || 0} в этом месяце</p>
                            </div>

                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Активные</h3>
                                <p className="text-3xl font-bold text-green-400">{statistics.users?.active || 0}</p>
                                <p className="text-sm text-gray-400">Заблокированных: {statistics.users?.blocked || 0}</p>
                            </div>

                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Курсы</h3>
                                <p className="text-3xl font-bold text-cabinet-blue">{statistics.courses?.total || 0}</p>
                                <p className="text-sm text-gray-400">Опубликовано: {statistics.courses?.published || 0}</p>
                            </div>

                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Подписки</h3>
                                <p className="text-3xl font-bold text-green-400">{statistics.subscriptions?.active || 0}</p>
                                <p className="text-sm text-gray-400">Всего: {statistics.subscriptions?.total || 0}</p>
                            </div>
                        </div>

                        {/* Роли пользователей */}
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-4">Распределение по ролям</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-400">{statistics.users?.byRole?.users || 0}</p>
                                    <p className="text-sm text-gray-400">Пользователи</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-400">{statistics.users?.byRole?.teachers || 0}</p>
                                    <p className="text-sm text-gray-400">Преподаватели</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-400">{statistics.users?.byRole?.admins || 0}</p>
                                    <p className="text-sm text-gray-400">Администраторы</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-red-400">{statistics.users?.byRole?.owners || 0}</p>
                                    <p className="text-sm text-gray-400">Владельцы</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Управление пользователями */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Управление пользователями</h2>

                        <div className="bg-gray-800 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Пользователь</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Роли</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Статус</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Дата регистрации</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {users.map(user => (
                                            <tr key={user.id} className="hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-white">{user.firstName} {user.lastName}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles?.map((role: any, index: number) => (
                                                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {role.name || role}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {user.isBlocked ? 'Заблокирован' : 'Активен'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleBlockUser(user.id, !user.isBlocked)}
                                                            className={`p-2 rounded ${user.isBlocked
                                                                    ? 'text-green-400 hover:text-green-300'
                                                                    : 'text-red-400 hover:text-red-300'
                                                                } transition-colors`}
                                                            title={user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                                                        >
                                                            {user.isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                                        </button>

                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                                            title="Удалить пользователя"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Управление курсами */}
                {activeTab === 'courses' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Управление курсами</h2>

                        <div className="bg-gray-800 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Название</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Описание</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Статус</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Студенты</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {courses.map(course => (
                                            <tr key={course.id} className="hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{course.title}</td>
                                                <td className="px-6 py-4 text-sm text-gray-300">{course.description}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${course.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {course.isPublished ? 'Опубликован' : 'Черновик'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {course.studentsCount || 0}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Системные операции */}
                {activeTab === 'system' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Системные операции</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <button
                                onClick={() => handleSystemOperation('update-difficulty-stats')}
                                disabled={refreshing}
                                className="p-6 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-left disabled:opacity-50"
                            >
                                <TrendingUp className="w-8 h-8 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Обновить статистику сложности</h3>
                                <p className="text-sm text-blue-200">Пересчитать данные о сложности курсов</p>
                            </button>

                            <button
                                onClick={() => handleSystemOperation('update-categories-stats')}
                                disabled={refreshing}
                                className="p-6 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-left disabled:opacity-50"
                            >
                                <BookOpen className="w-8 h-8 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Обновить категории</h3>
                                <p className="text-sm text-green-200">Пересчитать статистику категорий</p>
                            </button>

                            <button
                                onClick={() => handleSystemOperation('check-subscriptions')}
                                disabled={refreshing}
                                className="p-6 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors text-left disabled:opacity-50"
                            >
                                <CreditCard className="w-8 h-8 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Проверить подписки</h3>
                                <p className="text-sm text-orange-200">Найти истекающие подписки</p>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;