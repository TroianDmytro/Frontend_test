// src/components/admin/OwnerPanel.tsx - Исправления типов (Часть 1)
import { useState, useEffect } from 'react';
import { Crown, DollarSign, Users, TrendingUp, Settings, Activity, RefreshCw, Database, CheckCircle, AlertTriangle, BarChart3, UserPlus, Shield } from 'lucide-react';
import { ownerAPI } from '../../api/ownerAPI';
import { adminAPI } from '../../api/adminAPI';
import type { AdminStatistics } from '../../types/admin.types';
import { useToast } from '../ui/ToastProvider';
import { extractErrorMessage } from '../../utils/errorFormat';

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

// Removed local AdminStatistics interface in favor of canonical type

interface FinancialData {
    totalRevenue: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
    totalSubscribers: number;
    activeSubscriptions: number;
    newSubscriptionsThisMonth: number;
    churnRate: number;
    averageRevenuePerUser: number;
    conversionRate: number;
    monthlyGrowth: number;
    planStatistics: Array<{
        name: string;
        subscribers: number;
        revenue: number;
        color: string;
    }>;
    metrics: any[];
    rawData: any;
}

interface RevenueAnalytics {
    data: Array<{
        date: string;
        revenue: number;
        subscriptions: number;
    }>;
    total: number;
    growth: number;
    averagePerDay: number;
    period: string;
}

interface UserGrowthData {
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

interface SystemHealth {
    database: string;
    api: string;
    storage: string;
    uptime: string;
    version: string;
    lastBackup: string | null;
}

const OwnerPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { push } = useToast();
    const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
    const [financialData, setFinancialData] = useState<FinancialData | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics | null>(null);
    const [userGrowthData, setUserGrowthData] = useState<UserGrowthData | null>(null);
    const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showRoleModal, setShowRoleModal] = useState(false);

    const tabs = [
        { id: 'dashboard', label: 'Дашборд', icon: Activity },
        { id: 'finances', label: 'Финансы', icon: DollarSign },
        { id: 'users', label: 'Пользователи', icon: Users },
        { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
        { id: 'system', label: 'Система', icon: Settings }
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const [
                statsData,
                financeData,
                usersData,
                rolesData,
                revenueData,
                userGrowth,
                healthData
            ] = await Promise.all([
                adminAPI.getOverviewStatistics(),
                ownerAPI.getFinancialStatistics(),
                adminAPI.getUsers(1, 50),
                ownerAPI.getRoles(),
                ownerAPI.getRevenueAnalytics('month'),
                ownerAPI.getUserGrowthAnalytics(),
                ownerAPI.getSystemHealth()
            ]);

            setStatistics(statsData);
            setFinancialData(financeData);
            setUsers(Array.isArray(usersData) ? usersData : usersData.users || []);
            setRoles(rolesData);
            setRevenueAnalytics(revenueData);
            setUserGrowthData(userGrowth);
            setSystemHealth(healthData);
        } catch (e: any) {
            const msg = extractErrorMessage(e);
            console.error('❌ Error loading owner data:', e);
            setError('Ошибка загрузки данных: ' + msg);
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

    const handleAssignRole = async (userId: string, roleId: string) => {
        try {
            await ownerAPI.assignRole(userId, roleId);
            await loadData();
            setShowRoleModal(false);
            setSelectedUser(null);
        } catch (e: any) {
            const msg = extractErrorMessage(e);
            console.error('❌ Error assigning role:', e);
            setError('Ошибка при назначении роли: ' + msg);
        }
    };

    const handleRemoveRole = async (userId: string, roleId: string) => {
        try {
            await ownerAPI.removeRole(userId, roleId);
            await loadData();
        } catch (e: any) {
            const msg = extractErrorMessage(e);
            console.error('❌ Error removing role:', e);
            setError('Ошибка при удалении роли: ' + msg);
        }
    };

    const formatCurrency = (amount: number): string => {
        return `₽${amount.toLocaleString('ru-RU')}`;
    };

    const formatPercentage = (value: number): string => {
        return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
    };

    const getRoleDisplayName = (role: any): string => {
        const roleNames: Record<string, string> = {
            'user': 'Пользователь',
            'teacher': 'Преподаватель',
            'admin': 'Администратор',
            'owner': 'Владелец'
        };
        return roleNames[role] || role;
    };

    const getRoleColor = (role: any): string => {
        const roleColors: Record<string, string> = {
            'user': 'bg-blue-100 text-blue-800',
            'teacher': 'bg-green-100 text-green-800',
            'admin': 'bg-purple-100 text-purple-800',
            'owner': 'bg-red-100 text-red-800'
        };
        return roleColors[role] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-cabinet-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-cabinet-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-cabinet-white">Загрузка панели владельца...</p>
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
                        <Crown className="w-8 h-8 text-yellow-400 mr-3" />
                        <h1 className="text-3xl font-bold">Панель владельца</h1>
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
                    <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-6 whitespace-pre-line">
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

                {/* Дашборд */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8">
                        {/* Финансовые метрики */}
                        {financialData && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white">
                                    <h3 className="text-lg font-semibold mb-2">Общий доход</h3>
                                    <p className="text-3xl font-bold">{formatCurrency(financialData.totalRevenue)}</p>
                                    <p className="text-sm opacity-80">{formatPercentage(financialData.monthlyGrowth)} за месяц</p>
                                </div>

                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                                    <h3 className="text-lg font-semibold mb-2">Активные подписки</h3>
                                    <p className="text-3xl font-bold">{financialData.activeSubscriptions}</p>
                                    <p className="text-sm opacity-80">+{financialData.newSubscriptionsThisMonth} новых</p>
                                </div>

                                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                                    <h3 className="text-lg font-semibold mb-2">Доход за месяц</h3>
                                    <p className="text-3xl font-bold">{formatCurrency(financialData.monthlyRevenue)}</p>
                                    <p className="text-sm opacity-80">ARPU: {formatCurrency(financialData.averageRevenuePerUser)}</p>
                                </div>

                                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg text-white">
                                    <h3 className="text-lg font-semibold mb-2">Пользователи</h3>
                                    <p className="text-3xl font-bold">{statistics?.users?.total || 0}</p>
                                    <p className="text-sm opacity-80">Активных: {statistics?.users?.active || 0}</p>
                                </div>
                            </div>
                        )}

                        {/* Ключевые метрики */}
                        {userGrowthData && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-gray-800 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                                        <TrendingUp className="w-5 h-5 mr-2" />
                                        Конверсия
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Конверсия в подписку</span>
                                            <span className="text-xl font-bold text-green-400">{formatPercentage(financialData?.conversionRate || 0)}</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-green-400 h-2 rounded-full" style={{ width: `${financialData?.conversionRate || 0}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-800 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                                        <AlertTriangle className="w-5 h-5 mr-2" />
                                        Отток
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Churn Rate</span>
                                            <span className="text-xl font-bold text-red-400">{formatPercentage(userGrowthData.churnRate)}</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-red-400 h-2 rounded-full" style={{ width: `${userGrowthData.churnRate}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Системное здоровье */}
                        {systemHealth && (
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold mb-4 flex items-center">
                                    <Activity className="w-5 h-5 mr-2" />
                                    Состояние системы
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* База данных */}
                                    <div className="space-y-2">
                                        <div className={`flex items-center p-3 rounded ${systemHealth.database === 'Подключена' ? 'bg-green-900 border-green-600' : 'bg-red-900 border-red-600'
                                            } border`}>
                                            <Database className="w-5 h-5 mr-2" />
                                            <span className="font-medium">База данных</span>
                                        </div>
                                        <p className={`text-sm ${systemHealth.database === 'Подключена' ? 'text-green-400' : 'text-red-400'}`}>
                                            {systemHealth.database}
                                        </p>
                                    </div>

                                    {/* API */}
                                    <div className="space-y-2">
                                        <div className={`flex items-center p-3 rounded ${systemHealth.api === 'Работает' ? 'bg-green-900 border-green-600' : 'bg-red-900 border-red-600'
                                            } border`}>
                                            <Settings className="w-5 h-5 mr-2" />
                                            <span className="font-medium">API сервис</span>
                                        </div>
                                        <p className={`text-sm ${systemHealth.api === 'Работает' ? 'text-green-400' : 'text-red-400'}`}>
                                            {systemHealth.api}
                                        </p>
                                    </div>

                                    {/* Uptime */}
                                    <div className="space-y-2">
                                        <div className="flex items-center p-3 rounded bg-blue-900 border-blue-600 border">
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            <span className="font-medium">Время работы</span>
                                        </div>
                                        <p className="text-sm text-blue-400">{systemHealth.uptime}</p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Версия системы: {systemHealth.version}</span>
                                        <span className="text-gray-400">
                                            Последний бэкап: {systemHealth.lastBackup ? new Date(systemHealth.lastBackup).toLocaleString('ru-RU') : 'Не выполнен'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                )}
                // Дополнительные вкладки для OwnerPanel - добавьте к основному компоненту

                {/* Финансы */}
                {activeTab === 'finances' && financialData && revenueAnalytics && (
                    <div className="space-y-8">
                        {/* Детальная финансовая статистика */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <div className="bg-gray-800 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold mb-4">Динамика доходов</h3>
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-green-400">{formatCurrency(revenueAnalytics.total)}</p>
                                            <p className="text-sm text-gray-400">Общий доход за период</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-blue-400">{formatCurrency(revenueAnalytics.averagePerDay)}</p>
                                            <p className="text-sm text-gray-400">Средний доход в день</p>
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-2xl font-bold ${revenueAnalytics.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {formatPercentage(revenueAnalytics.growth)}
                                            </p>
                                            <p className="text-sm text-gray-400">Рост за период</p>
                                        </div>
                                    </div>

                                    {/* График доходов */}
                                    <div className="h-64 bg-gray-900 rounded p-4 flex items-center justify-center">
                                        <p className="text-gray-500">График доходов (требует Chart.js)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Статистика по планам */}
                                <div className="bg-gray-800 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4">Подписки по планам</h3>
                                    {financialData.planStatistics && financialData.planStatistics.length > 0 ? (
                                        <div className="space-y-3">
                                            {financialData.planStatistics.map((plan: any, index: number) => (
                                                <div key={index} className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium">{plan.name}</span>
                                                        <span className="text-sm text-gray-400">{plan.subscribers}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                                        <div
                                                            className="h-2 rounded-full"
                                                            style={{
                                                                backgroundColor: plan.color,
                                                                width: `${(plan.subscribers / Math.max(...financialData.planStatistics.map((p: any) => p.subscribers))) * 100}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">Нет данных по планам</p>
                                    )}
                                </div>

                                {/* Ключевые метрики */}
                                <div className="bg-gray-800 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4">Ключевые метрики</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Churn Rate</span>
                                            <span className="font-medium">{formatPercentage(financialData.churnRate)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Конверсия</span>
                                            <span className="font-medium">{formatPercentage(financialData.conversionRate)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Рост за месяц</span>
                                            <span className="font-medium">{formatPercentage(financialData.monthlyGrowth)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Управление пользователями */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Управление пользователями</h2>
                            <button
                                onClick={() => setShowRoleModal(true)}
                                className="flex items-center px-4 py-2 bg-cabinet-purple hover:bg-purple-700 rounded-lg transition-colors"
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Назначить роль
                            </button>
                        </div>

                        {/* Статистика пользователей */}
                        {statistics && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-gray-800 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">Активных</h3>
                                    <p className="text-2xl font-bold text-blue-400">{statistics.users?.active || 0}</p>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">Заблокированных</h3>
                                    <p className="text-2xl font-bold text-red-400">{statistics.users?.blocked || 0}</p>
                                </div>
                            </div>
                        )}

                        {/* Таблица пользователей */}
                        <div className="bg-gray-800 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Пользователь</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Роли</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Статус</th>
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
                                                        {user.roles && user.roles.map((role: any, index: number) => (
                                                            <span key={index} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role.name || role)}`}>
                                                                {getRoleDisplayName(role.name || role)}
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setShowRoleModal(true);
                                                            }}
                                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                                            title="Управление ролями"
                                                        >
                                                            <Shield className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Модальное окно управления ролями */}
                        {showRoleModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                                    <h3 className="text-lg font-semibold mb-4">
                                        {selectedUser ? `Роли пользователя ${selectedUser.firstName} ${selectedUser.lastName}` : 'Управление ролями'}
                                    </h3>

                                    {selectedUser && (
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-400 mb-2">Текущие роли:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedUser.roles && selectedUser.roles.length > 0 ? selectedUser.roles.map((role: any, index: number) => (
                                                        <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                                            {getRoleDisplayName(role.name || role)}
                                                            <button
                                                                onClick={() => handleRemoveRole(selectedUser.id, role.id || role)}
                                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                                                title="Удалить роль"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    )) : (
                                                        <span className="text-gray-500">Нет назначенных ролей</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-medium text-gray-400 mb-2">Добавить роль:</h4>
                                                <select
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                                    onChange={(e) => {
                                                        if (e.target.value && selectedUser) {
                                                            handleAssignRole(selectedUser.id, e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                >
                                                    <option value="">Выберите роль</option>
                                                    {roles.map((role: any) => (
                                                        <option key={role.id} value={role.id}>
                                                            {getRoleDisplayName(role.name)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex space-x-3 mt-6">
                                        <button
                                            onClick={() => {
                                                setShowRoleModal(false);
                                                setSelectedUser(null);
                                            }}
                                            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
                                        >
                                            Закрыть
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Аналитика */}
                {activeTab === 'analytics' && userGrowthData && (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold">Аналитика пользователей</h2>

                        {/* Основные метрики */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Всего пользователей</h3>
                                <p className="text-3xl font-bold text-blue-400">{userGrowthData.totalUsers}</p>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Новых за месяц</h3>
                                <p className="text-3xl font-bold text-green-400">{userGrowthData.newUsersThisMonth}</p>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Retention Rate</h3>
                                <p className="text-3xl font-bold text-purple-400">{formatPercentage(userGrowthData.retentionRate)}</p>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Активных</h3>
                                <p className="text-3xl font-bold text-orange-400">{userGrowthData.activeUsers}</p>
                            </div>
                        </div>

                        {/* График роста пользователей */}
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-4">Рост пользовательской базы</h3>
                            <div className="h-64 bg-gray-900 rounded p-4 flex items-center justify-center">
                                {userGrowthData.userGrowth && userGrowthData.userGrowth.map((item: any, index: number) => (
                                    <div key={index} className="text-xs text-gray-500 mr-2">
                                        {new Date(item.date).toLocaleDateString('ru-RU')}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Система */}
                {activeTab === 'system' && (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold">Системное управление</h2>

                        {/* Системные операции */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <button
                                onClick={async () => {
                                    try {
                                        await adminAPI.updateAllDifficultyStatistics();
                                        push({ type: 'success', message: 'Статистика сложности обновлена' });
                                        await loadData();
                                    } catch (e: any) {
                                        const msg = extractErrorMessage(e);
                                        setError('Ошибка обновления статистики: ' + msg);
                                        push({ type: 'error', message: msg || 'Ошибка обновления статистики' });
                                    }
                                }}
                                disabled={refreshing}
                                className="p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-left disabled:opacity-50"
                            >
                                <Settings className="w-6 h-6 mb-2" />
                                <h4 className="font-medium">Обновить статистику</h4>
                                <p className="text-sm text-purple-200">Пересчитать данные курсов</p>
                            </button>

                            <button
                                onClick={async () => {
                                    try {
                                        const result = await adminAPI.checkExpiringSubscriptions();
                                        push({ type: 'info', message: `Проверено подписок. Истекших: ${result?.expiredCount || 0}, уведомлений: ${result?.notifiedCount || 0}` });
                                    } catch (e: any) {
                                        const msg = extractErrorMessage(e);
                                        setError('Ошибка проверки подписок: ' + msg);
                                        push({ type: 'error', message: msg || 'Ошибка проверки подписок' });
                                    }
                                }}
                                disabled={refreshing}
                                className="p-4 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors text-left disabled:opacity-50"
                            >
                                <AlertTriangle className="w-6 h-6 mb-2" />
                                <h4 className="font-medium">Проверить подписки</h4>
                                <p className="text-sm text-orange-200">Найти истекающие подписки</p>
                            </button>

                            <button
                                onClick={async () => {
                                    try {
                                        await adminAPI.updateAllCategoriesStatistics();
                                        push({ type: 'success', message: 'Статистика категорий обновлена' });
                                        await loadData();
                                    } catch (e: any) {
                                        const msg = extractErrorMessage(e);
                                        setError('Ошибка обновления категорий: ' + msg);
                                        push({ type: 'error', message: msg || 'Ошибка обновления категорий' });
                                    }
                                }}
                                disabled={refreshing}
                                className="p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-left disabled:opacity-50"
                            >
                                <Database className="w-6 h-6 mb-2" />
                                <h4 className="font-medium">Обновить категории</h4>
                                <p className="text-sm text-green-200">Пересчитать статистику категорий</p>
                            </button>
                        </div>
                    </div>
                )}
                <h3>Всего пользователей</h3>
                <p className="text-2xl font-bold">{statistics?.users?.total || 0}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-400 mb-1">Новых за месяц</h3>
                <p className="text-2xl font-bold text-green-400">{statistics?.users?.newThisMonth || 0}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-400 mb-1"></h3>
            </div>
        </div >
    );
};

export default OwnerPanel;