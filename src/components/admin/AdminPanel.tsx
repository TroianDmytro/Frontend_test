// src/components/admin/AdminPanel.tsx - Интегрированная версия с реальными данными
import React, { useState, useEffect } from 'react';
import { Shield, Users, BookOpen, Settings, Activity, Ban, AlertTriangle, TrendingUp, RefreshCw, Database, CheckCircle, XCircle } from 'lucide-react';
import { adminAPI } from '../../api/adminAPI';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [statistics, setStatistics] = useState(null);
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const tabs = [
        { id: 'overview', label: 'Обзор', icon: Activity },
        { id: 'users', label: 'Пользователи', icon: Users },
        { id: 'courses', label: 'Курсы', icon: BookOpen },
        { id: 'system', label: 'Система', icon: Settings }
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const [statsData, usersData, coursesData] = await Promise.all([
                adminAPI.getOverviewStatistics(),
                adminAPI.getUsers(1, 20),
                adminAPI.getCourses(1, 20)
            ]);

            setStatistics(statsData);
            setUsers(usersData.users || usersData);
            setCourses(coursesData.courses || coursesData);
        } catch (error) {
            console.error('❌ Error loading admin data:', error);
            setError('Ошибка загрузки данных: ' + error.message);
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

    const handleBlockUser = async (userId, isBlocked) => {
        try {
            const updatedUser = await adminAPI.blockUser(userId, isBlocked);
            setUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, ...updatedUser } : user
            ));
        } catch (error) {
            console.error('❌ Error blocking user:', error);
            setError('Ошибка при изменении статуса пользователя: ' + error.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Вы уверены, что хотите удалить пользователя?')) return;

        try {
            await adminAPI.deleteUser(userId);
            setUsers(prev => prev.filter(user => user.id !== userId));
        } catch (error) {
            console.error('❌ Error deleting user:', error);
            setError('Ошибка при удалении пользователя: ' + error.message);
        }
    };

    const handleSystemOperation = async (operation) => {
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
                    alert(`Проверено подписок. Истекших: ${result.expiredCount}, уведомлений отправлено: ${result.notifiedCount}`);
                    break;
            }

            await loadData(); // Перезагружаем данные
        } catch (error) {
            console.error('❌ Error in system operation:', error);
            setError('Ошибка системной операции: ' + error.message);
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-white">Загрузка админской панели...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Заголовок */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="w-8 h-8 text-purple-500" />
                            <h1 className="text-3xl font-bold">Админ панель</h1>
                        </div>
                        <p className="text-gray-400">Управление пользователями и контентом платформы NeuroNest</p>
                    </div>

                    <button
                        onClick={handleRefreshData}
                        disabled={refreshing}
                        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors ${refreshing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Обновить
                    </button>
                </div>

                {/* Ошибки */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-600 rounded-lg flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-red-500">Произошла ошибка</h4>
                            <p className="text-sm text-red-200 mt-1">{error}</p>
                            <button
                                onClick={() => setError('')}
                                className="text-sm text-red-400 hover:text-red-300 mt-2"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                )}

                {/* Основная статистика */}
                {statistics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Всего пользователей</p>
                                    <p className="text-2xl font-bold text-blue-500">{statistics.users.total.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500 mt-1">Новых за месяц: +{statistics.users.newThisMonth}</p>
                                </div>
                                <Users className="w-8 h-8 text-blue-500" />
                            </div>
                        </div>

                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Активные курсы</p>
                                    <p className="text-2xl font-bold text-green-500">{statistics.courses.published}</p>
                                    <p className="text-xs text-gray-500 mt-1">Черновиков: {statistics.courses.draft}</p>
                                </div>
                                <BookOpen className="w-8 h-8 text-green-500" />
                            </div>
                        </div>

                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Подписки</p>
                                    <p className="text-2xl font-bold text-purple-500">{statistics.subscriptions.active.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500 mt-1">Истекших: {statistics.subscriptions.expired}</p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-purple-500" />
                            </div>
                        </div>

                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Заблокированные</p>
                                    <p className="text-2xl font-bold text-red-500">{statistics.users.blocked}</p>
                                    <p className="text-xs text-gray-500 mt-1">Активных: {statistics.users.active}</p>
                                </div>
                                <Ban className="w-8 h-8 text-red-500" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Навигация */}
                <div className="border-b border-gray-700 mb-8">
                    <nav className="flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                            ? 'border-blue-600 text-blue-500'
                                            : 'border-transparent text-gray-400 hover:text-white'
                                        }`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Контент вкладок */}
                <div className="space-y-6">
                    {activeTab === 'overview' && statistics && (
                        <div className="space-y-6">
                            {/* Статистика по ролям */}
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-white mb-4">Пользователи по ролям</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-500">{statistics.users.byRole?.users || 0}</p>
                                        <p className="text-gray-400 text-sm">Пользователи</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-500">{statistics.users.byRole?.teachers || 0}</p>
                                        <p className="text-gray-400 text-sm">Преподаватели</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-purple-500">{statistics.users.byRole?.admins || 0}</p>
                                        <p className="text-gray-400 text-sm">Администраторы</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-yellow-500">{statistics.users.byRole?.owners || 0}</p>
                                        <p className="text-gray-400 text-sm">Владельцы</p>
                                    </div>
                                </div>
                            </div>

                            {/* Статистика по методам регистрации */}
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-white mb-4">Методы регистрации</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-500">{statistics.users.byAuthProvider?.local || 0}</p>
                                        <p className="text-gray-400 text-sm">Email/Пароль</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-red-500">{statistics.users.byAuthProvider?.google || 0}</p>
                                        <p className="text-gray-400 text-sm">Google OAuth</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Управление пользователями</h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="text-left py-3 px-2 text-gray-300 font-medium">Пользователь</th>
                                            <th className="text-left py-3 px-2 text-gray-300 font-medium">Роли</th>
                                            <th className="text-left py-3 px-2 text-gray-300 font-medium">Статус</th>
                                            <th className="text-left py-3 px-2 text-gray-300 font-medium">Регистрация</th>
                                            <th className="text-right py-3 px-2 text-gray-300 font-medium">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length > 0 ? users.slice(0, 10).map((user) => (
                                            <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                                <td className="py-3 px-2">
                                                    <div>
                                                        <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                                                        <p className="text-gray-400 text-sm">{user.email}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles?.map((role) => (
                                                            <span key={role} className={`px-2 py-1 rounded-full text-xs text-white ${role === 'admin' ? 'bg-purple-600' :
                                                                    role === 'teacher' ? 'bg-blue-600' :
                                                                        role === 'owner' ? 'bg-yellow-600' : 'bg-green-600'
                                                                }`}>
                                                                {role}
                                                            </span>
                                                        )) || <span className="text-gray-500 text-sm">Нет ролей</span>}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${user.isBlocked ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                                                        }`}>
                                                        {user.isBlocked ? 'Заблокирован' : 'Активен'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2 text-gray-400 text-sm">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'Н/Д'}
                                                </td>
                                                <td className="py-3 px-2">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleBlockUser(user.id, !user.isBlocked)}
                                                            className={`px-3 py-1 rounded text-sm transition-colors ${user.isBlocked
                                                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                                                    : 'bg-red-600 hover:bg-red-700 text-white'
                                                                }`}
                                                        >
                                                            {user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                                                        </button>

                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                                                        >
                                                            Удалить
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-8 text-gray-400">
                                                    Пользователи не найдены
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'courses' && (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Управление курсами</h3>

                            {Array.isArray(courses) && courses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {courses.slice(0, 6).map((course) => (
                                        <div key={course.id} className="bg-gray-700 rounded-lg p-4">
                                            <h4 className="font-medium text-white mb-2">{course.title}</h4>
                                            <p className="text-gray-400 text-sm mb-3">{course.description?.slice(0, 100)}...</p>

                                            <div className="flex items-center justify-between">
                                                <span className={`px-2 py-1 rounded text-xs ${course.isPublished
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-yellow-600 text-white'
                                                    }`}>
                                                    {course.isPublished ? 'Опубликован' : 'Черновик'}
                                                </span>

                                                <span className="text-gray-400 text-sm">
                                                    👥 {course.studentsCount || 0}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center py-8">Курсы не найдены</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'system' && (
                        <div className="space-y-6">
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-white mb-6">Системные операции</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => handleSystemOperation('update-difficulty-stats')}
                                        disabled={refreshing}
                                        className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-left disabled:opacity-50"
                                    >
                                        <Database className="w-6 h-6 mb-2" />
                                        <h4 className="font-medium">Обновить статистику уровней</h4>
                                        <p className="text-sm text-blue-200">Пересчитать данные по сложности курсов</p>
                                    </button>

                                    <button
                                        onClick={() => handleSystemOperation('update-categories-stats')}
                                        disabled={refreshing}
                                        className="p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-left disabled:opacity-50"
                                    >
                                        <BookOpen className="w-6 h-6 mb-2" />
                                        <h4 className="font-medium">Обновить статистику категорий</h4>
                                        <p className="text-sm text-green-200">Пересчитать данные по категориям</p>
                                    </button>

                                    <button
                                        onClick={() => handleSystemOperation('check-subscriptions')}
                                        disabled={refreshing}
                                        className="p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-left disabled:opacity-50"
                                    >
                                        <CheckCircle className="w-6 h-6 mb-2" />
                                        <h4 className="font-medium">Проверить подписки</h4>
                                        <p className="text-sm text-purple-200">Проверить истекающие подписки</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Предупреждение о ограничениях */}
                <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-yellow-500">Ограниченный доступ</h4>
                        <p className="text-sm text-yellow-200 mt-1">
                            Финансовая информация и назначение ролей доступны только владельцу платформы.
                            Для получения полных прав обратитесь к администратору системы.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { AdminPanel };