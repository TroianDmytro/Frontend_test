// src/components/admin/OwnerPanel.tsx - Полная интегрированная версия
import { useState, useEffect } from 'react';
import { Crown, DollarSign, Users, BookOpen, TrendingUp, CreditCard, Settings, Activity, RefreshCw, UserPlus, Shield, Database, CheckCircle, AlertTriangle, PieChart, BarChart3 } from 'lucide-react';
import { ownerAPI } from '../../api/ownerAPI';
import { adminAPI } from '../../api/adminAPI';

const OwnerPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [statistics, setStatistics] = useState(null);
    const [financialData, setFinancialData] = useState(null);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [revenueAnalytics, setRevenueAnalytics] = useState(null);
    const [userGrowthData, setUserGrowthData] = useState(null);
    const [systemHealth, setSystemHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
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
            setUsers(usersData.users || usersData);
            setRoles(rolesData);
            setRevenueAnalytics(revenueData);
            setUserGrowthData(userGrowth);
            setSystemHealth(healthData);
        } catch (error) {
            console.error('❌ Error loading owner data:', error);
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

    const handleAssignRole = async (userId, roleId) => {
        try {
            await ownerAPI.assignRole(userId, roleId);
            await loadData();
            setShowRoleModal(false);
            setSelectedUser(null);
        } catch (error) {
            console.error('❌ Error assigning role:', error);
            setError('Ошибка при назначении роли: ' + error.message);
        }
    };

    const handleRemoveRole = async (userId, roleId) => {
        try {
            await ownerAPI.removeRole(userId, roleId);
            await loadData();
        } catch (error) {
            console.error('❌ Error removing role:', error);
            setError('Ошибка при удалении роли: ' + error.message);
        }
    };

    const formatCurrency = (amount) => {
        return `₽${amount.toLocaleString('ru-RU')}`;
    };

    const formatPercentage = (value) => {
        return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
    };

    const getRoleColor = (role) => {
        const colors = {
            user: 'bg-green-600',
            teacher: 'bg-blue-600',
            admin: 'bg-purple-600',
            owner: 'bg-yellow-600'
        };
        return colors[role] || 'bg-gray-600';
    };

    const getRoleDisplayName = (role) => {
        const names = {
            user: 'Пользователь',
            teacher: 'Преподаватель',
            admin: 'Администратор',
            owner: 'Владелец'
        };
        return names[role] || role;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-white">Загрузка панели владельца...</p>
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
                            <Crown className="w-8 h-8 text-yellow-500" />
                            <h1 className="text-3xl font-bold">Панель владельца</h1>
                        </div>
                        <p className="text-gray-400">Полный контроль над платформой NeuroNest</p>
                    </div>

                    <button
                        onClick={handleRefreshData}
                        disabled={refreshing}
                        className={`flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors ${refreshing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Обновить
                    </button>
                </div>

                {/* Ошибки */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-600 rounded-lg flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
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
                {statistics && financialData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Общий доход</p>
                                    <p className="text-2xl font-bold text-green-500">{formatCurrency(financialData.totalRevenue)}</p>
                                    <p className="text-xs text-green-400 mt-1">{formatPercentage(financialData.monthlyGrowth)} за месяц</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-green-500" />
                            </div>
                        </div>

                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Активные подписки</p>
                                    <p className="text-2xl font-bold text-blue-500">{financialData.activeSubscriptions.toLocaleString()}</p>
                                    <p className="text-xs text-blue-400 mt-1">+{financialData.newSubscriptionsThisMonth} новых</p>
                                </div>
                                <CreditCard className="w-8 h-8 text-blue-500" />
                            </div>
                        </div>

                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Месячный доход</p>
                                    <p className="text-2xl font-bold text-purple-500">{formatCurrency(financialData.monthlyRevenue)}</p>
                                    <p className="text-xs text-purple-400 mt-1">ARPU: {formatCurrency(financialData.averageRevenuePerUser)}</p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-purple-500" />
                            </div>
                        </div>

                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Всего пользователей</p>
                                    <p className="text-2xl font-bold text-yellow-500">{statistics.users.total.toLocaleString()}</p>
                                    <p className="text-xs text-yellow-400 mt-1">+{statistics.users.newThisMonth} за месяц</p>
                                </div>
                                <Users className="w-8 h-8 text-yellow-500" />
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
                                            ? 'border-yellow-500 text-yellow-500'
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
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                            {/* Ключевые метрики */}
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-white mb-6">Ключевые показатели</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {financialData && (
                                        <>
                                            <div className="text-center">
                                                <p className="text-3xl font-bold text-green-500">
                                                    {formatPercentage(financialData.conversionRate)}
                                                </p>
                                                <p className="text-gray-400 text-sm">Конверсия</p>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-3xl font-bold text-red-500">
                                                    {formatPercentage(financialData.churnRate)}
                                                </p>
                                                <p className="text-gray-400 text-sm">Отток</p>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-3xl font-bold text-blue-500">
                                                    {financialData.metrics?.ltv ? formatCurrency(financialData.metrics.ltv) : 'N/A'}
                                                </p>
                                                <p className="text-gray-400 text-sm">LTV</p>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-3xl font-bold text-purple-500">
                                                    {financialData.metrics?.marginality || 68}%
                                                </p>
                                                <p className="text-gray-400 text-sm">Маржинальность</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Системное здоровье */}
                            {systemHealth && (
                                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                                    <h3 className="text-xl font-bold text-white mb-6">Состояние системы</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <div className={`flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-3 ${systemHealth.database === 'healthy' ? 'bg-green-500/20' :
                                                    systemHealth.database === 'warning' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                                                }`}>
                                                <Database className={`w-6 h-6 ${systemHealth.database === 'healthy' ? 'text-green-500' :
                                                        systemHealth.database === 'warning' ? 'text-yellow-500' : 'text-red-500'
                                                    }`} />
                                            </div>
                                            <h4 className="text-sm font-medium text-gray-300 mb-1">База данных</h4>
                                            <p className={`text-lg font-bold capitalize ${systemHealth.database === 'healthy' ? 'text-green-500' :
                                                    systemHealth.database === 'warning' ? 'text-yellow-500' : 'text-red-500'
                                                }`}>
                                                {systemHealth.database === 'healthy' ? 'Здорова' :
                                                    systemHealth.database === 'warning' ? 'Предупр.' : 'Ошибка'}
                                            </p>
                                        </div>

                                        <div className="text-center">
                                            <div className={`flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-3 ${systemHealth.api === 'healthy' ? 'bg-green-500/20' :
                                                    systemHealth.api === 'warning' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                                                }`}>
                                                <Shield className={`w-6 h-6 ${systemHealth.api === 'healthy' ? 'text-green-500' :
                                                        systemHealth.api === 'warning' ? 'text-yellow-500' : 'text-red-500'
                                                    }`} />
                                            </div>
                                            <h4 className="text-sm font-medium text-gray-300 mb-1">API</h4>
                                            <p className={`text-lg font-bold capitalize ${systemHealth.api === 'healthy' ? 'text-green-500' :
                                                    systemHealth.api === 'warning' ? 'text-yellow-500' : 'text-red-500'
                                                }`}>
                                                {systemHealth.api === 'healthy' ? 'Норма' :
                                                    systemHealth.api === 'warning' ? 'Предупр.' : 'Ошибка'}
                                            </p>
                                        </div>

                                        <div className="text-center">
                                            <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mx-auto mb-3">
                                                <TrendingUp className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <h4 className="text-sm font-medium text-gray-300 mb-1">Uptime</h4>
                                            <p className="text-lg font-bold text-blue-500">{systemHealth.uptime}</p>
                                        </div>

                                        <div className="text-center">
                                            <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mx-auto mb-3">
                                                <Settings className="w-6 h-6 text-purple-500" />
                                            </div>
                                            <h4 className="text-sm font-medium text-gray-300 mb-1">Версия</h4>
                                            <p className="text-lg font-bold text-purple-500">{systemHealth.version}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'finances' && financialData && (
                        <div className="space-y-6">
                            {/* График доходов */}
                            {revenueAnalytics && (
                                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5 text-green-500" />
                                            <h3 className="text-xl font-bold text-white">Аналитика доходов</h3>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="bg-gray-700 rounded-lg p-4">
                                            <p className="text-gray-400 text-sm">Общий доход за период</p>
                                            <p className="text-2xl font-bold text-white">{formatCurrency(revenueAnalytics.total)}</p>
                                        </div>
                                        <div className="bg-gray-700 rounded-lg p-4">
                                            <p className="text-gray-400 text-sm">Средний доход в день</p>
                                            <p className="text-2xl font-bold text-white">{formatCurrency(revenueAnalytics.averagePerDay)}</p>
                                        </div>
                                        <div className="bg-gray-700 rounded-lg p-4">
                                            <p className="text-gray-400 text-sm">Рост за период</p>
                                            <p className={`text-2xl font-bold ${revenueAnalytics.growth > 0 ? 'text-green-500' :
                                                    revenueAnalytics.growth < 0 ? 'text-red-500' : 'text-gray-400'
                                                }`}>
                                                {formatPercentage(revenueAnalytics.growth)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Простой график */}
                                    <div className="bg-gray-700 rounded-lg p-4">
                                        <div className="flex items-end justify-between h-32 gap-2">
                                            {revenueAnalytics.data.slice(-7).map((item, index) => {
                                                const maxRevenue = Math.max(...revenueAnalytics.data.map(d => d.revenue));
                                                const height = (item.revenue / maxRevenue) * 100;
                                                return (
                                                    <div key={index} className="flex flex-col items-center flex-1">
                                                        <div
                                                            className="bg-gradient-to-t from-green-600 to-green-400 rounded-t-sm w-full mb-2"
                                                            style={{ height: `${height}%` }}
                                                            title={`${item.date}: ${formatCurrency(item.revenue)}`}
                                                        />
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(item.date).toLocaleDateString('ru-RU', {
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Статистика по планам */}
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <PieChart className="w-5 h-5 text-blue-500" />
                                    <h3 className="text-xl font-bold text-white">Тарифные планы</h3>
                                </div>

                                {financialData.planStatistics?.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-700">
                                                    <th className="text-left py-3 text-gray-300 font-medium">План</th>
                                                    <th className="text-right py-3 text-gray-300 font-medium">Подписчики</th>
                                                    <th className="text-right py-3 text-gray-300 font-medium">Доход</th>
                                                    <th className="text-right py-3 text-gray-300 font-medium">Рост</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {financialData.planStatistics.map((plan) => (
                                                    <tr key={plan.id} className="border-b border-gray-700">
                                                        <td className="py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className="w-3 h-3 rounded-full"
                                                                    style={{ backgroundColor: plan.color }}
                                                                />
                                                                <div>
                                                                    <p className="text-white font-medium">{plan.name}</p>
                                                                    <p className="text-gray-400 text-sm">{plan.icon}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 text-right">
                                                            <p className="text-white">{plan.subscribers.toLocaleString()}</p>
                                                        </td>
                                                        <td className="py-3 text-right">
                                                            <p className="text-green-500 font-medium">
                                                                {formatCurrency(plan.revenue)}
                                                            </p>
                                                        </td>
                                                        <td className="py-3 text-right">
                                                            <span className={`text-sm font-medium ${plan.growthRate > 0 ? 'text-green-500' :
                                                                    plan.growthRate < 0 ? 'text-red-500' : 'text-gray-400'
                                                                }`}>
                                                                {formatPercentage(plan.growthRate)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-center py-8">Данные по планам не найдены</p>
                                )}
                            </div>

                            {/* Рекомендации */}
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-white mb-6">Финансовые рекомендации</h3>

                                <div className="space-y-4">
                                    {financialData.churnRate > 10 && (
                                        <div className="p-4 bg-red-900/20 border border-red-600 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium text-red-500">Высокий уровень оттока</h4>
                                                    <p className="text-sm text-red-200 mt-1">
                                                        Отток составляет {financialData.churnRate.toFixed(1)}%.
                                                        Рекомендуется провести анализ причин отмены подписок и улучшить качество сервиса.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {financialData.conversionRate < 5 && (
                                        <div className="p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium text-yellow-500">Низкая конверсия</h4>
                                                    <p className="text-sm text-yellow-200 mt-1">
                                                        Конверсия составляет {financialData.conversionRate.toFixed(1)}%.
                                                        Стоит оптимизировать воронку продаж и улучшить пользовательский опыт.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {financialData.monthlyGrowth > 15 && (
                                        <div className="p-4 bg-green-900/20 border border-green-600 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium text-green-500">Отличный рост</h4>
                                                    <p className="text-sm text-green-200 mt-1">
                                                        Рост доходов составляет {financialData.monthlyGrowth.toFixed(1)}%!
                                                        Продолжайте в том же направлении и подумайте о масштабировании.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Управление пользователями и ролями</h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="text-left py-3 px-2 text-gray-300 font-medium">Пользователь</th>
                                            <th className="text-left py-3 px-2 text-gray-300 font-medium">Роли</th>
                                            <th className="text-left py-3 px-2 text-gray-300 font-medium">Статус</th>
                                            <th className="text-right py-3 px-2 text-gray-300 font-medium">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length > 0 ? users.slice(0, 15).map((user) => (
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
                                                            <span
                                                                key={role}
                                                                className={`px-2 py-1 rounded-full text-xs text-white ${getRoleColor(role)}`}
                                                            >
                                                                {getRoleDisplayName(role)}
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
                                                <td className="py-3 px-2">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setShowRoleModal(true);
                                                            }}
                                                            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-colors"
                                                        >
                                                            <UserPlus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="text-center py-8 text-gray-400">
                                                    Пользователи не найдены
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && userGrowthData && (
                        <div className="space-y-6">
                            {/* Аналитика роста пользователей */}
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-white mb-6">Аналитика пользователей</h3>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-blue-500">{userGrowthData.totalUsers.toLocaleString()}</p>
                                        <p className="text-gray-400 text-sm">Всего пользователей</p>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-green-500">{userGrowthData.newUsersThisMonth}</p>
                                        <p className="text-gray-400 text-sm">Новых за месяц</p>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-purple-500">{userGrowthData.retentionRate.toFixed(1)}%</p>
                                        <p className="text-gray-400 text-sm">Удержание</p>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-yellow-500">{userGrowthData.activeUsers.toLocaleString()}</p>
                                        <p className="text-gray-400 text-sm">Активные</p>
                                    </div>
                                </div>

                                {/* График роста пользователей */}
                                <div className="bg-gray-700 rounded-lg p-4">
                                    <h4 className="text-white font-medium mb-4">Рост пользователей по месяцам</h4>
                                    <div className="flex items-end justify-between h-32 gap-1">
                                        {userGrowthData.userGrowth.map((item, index) => {
                                            const maxUsers = Math.max(...userGrowthData.userGrowth.map(d => d.users));
                                            const height = (item.users / maxUsers) * 100;
                                            return (
                                                <div key={index} className="flex flex-col items-center flex-1">
                                                    <div
                                                        className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm w-full mb-2"
                                                        style={{ height: `${height}%` }}
                                                        title={`${item.date}: ${item.users} пользователей`}
                                                    />
                                                    <span className="text-xs text-gray-400">
                                                        {item.date.slice(-2)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'system' && (
                        <div className="space-y-6">
                            {/* Системные операции */}
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-white mb-6">Системное управление</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <button
                                        onClick={async () => {
                                            try {
                                                await ownerAPI.seedBasicPlans();
                                                alert('Базовые планы созданы успешно');
                                                await loadData();
                                            } catch (error) {
                                                setError('Ошибка создания планов: ' + error.message);
                                            }
                                        }}
                                        disabled={refreshing}
                                        className="p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-left disabled:opacity-50"
                                    >
                                        <CheckCircle className="w-6 h-6 mb-2" />
                                        <h4 className="font-medium">Создать базовые планы</h4>
                                        <p className="text-sm text-green-200">Инициализация тарифных планов</p>
                                    </button>

                                    <button
                                        onClick={async () => {
                                            if (confirm('Вы уверены? Это удалит все существующие планы!')) {
                                                try {
                                                    await ownerAPI.recreateBasicPlans();
                                                    alert('Планы пересозданы успешно');
                                                    await loadData();
                                                } catch (error) {
                                                    setError('Ошибка пересоздания планов: ' + error.message);
                                                }
                                            }
                                        }}
                                        disabled={refreshing}
                                        className="p-4 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-left disabled:opacity-50"
                                    >
                                        <RefreshCw className="w-6 h-6 mb-2" />
                                        <h4 className="font-medium">Пересоздать планы</h4>
                                        <p className="text-sm text-red-200">Сброс и создание планов заново</p>
                                    </button>

                                    <button
                                        onClick={handleRefreshData}
                                        disabled={refreshing}
                                        className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-left disabled:opacity-50"
                                    >
                                        <Database className="w-6 h-6 mb-2" />
                                        <h4 className="font-medium">Обновить все данные</h4>
                                        <p className="text-sm text-blue-200">Перезагрузка всей статистики</p>
                                    </button>

                                    <button
                                        onClick={async () => {
                                            try {
                                                await adminAPI.updateAllDifficultyStatistics();
                                                alert('Статистика уровней сложности обновлена');
                                                await loadData();
                                            } catch (error) {
                                                setError('Ошибка обновления статистики: ' + error.message);
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
                                                alert(`Проверено подписок. Истекших: ${result.expiredCount}, уведомлений: ${result.notifiedCount}`);
                                            } catch (error) {
                                                setError('Ошибка проверки подписок: ' + error.message);
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
                                                alert('Статистика категорий обновлена');
                                                await loadData();
                                            } catch (error) {
                                                setError('Ошибка обновления категорий: ' + error.message);
                                            }
                                        }}
                                        disabled={refreshing}
                                        className="p-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors text-left disabled:opacity-50"
                                    >
                                        <BookOpen className="w-6 h-6 mb-2" />
                                        <h4 className="font-medium">Обновить категории</h4>
                                        <p className="text-sm text-indigo-200">Пересчитать статистику категорий</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Модальное окно управления ролями */}
                {showRoleModal && selectedUser && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-screen items-center justify-center p-4">
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                                onClick={() => setShowRoleModal(false)}
                            />

                            {/* Modal */}
                            <div className="relative bg-gray-800 rounded-lg shadow-2xl border border-gray-700 w-full max-w-md mx-auto">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                                    <h3 className="text-lg font-semibold text-white">
                                        Управление ролями: {selectedUser.firstName} {selectedUser.lastName}
                                    </h3>
                                    <button
                                        onClick={() => setShowRoleModal(false)}
                                        className="text-gray-400 hover:text-white text-xl"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-white font-medium mb-2">Текущие роли:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedUser.roles?.length > 0 ? selectedUser.roles.map(role => (
                                                    <div key={role} className="flex items-center gap-2">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-sm text-white ${getRoleColor(role)}`}
                                                        >
                                                            {getRoleDisplayName(role)}
                                                        </span>
                                                        {role !== 'user' && role !== 'owner' && (
                                                            <button
                                                                onClick={() => {
                                                                    const roleObj = roles.find(r => r.name === role);
                                                                    if (roleObj) {
                                                                        handleRemoveRole(selectedUser.id, roleObj.id);
                                                                    }
                                                                }}
                                                                className="text-red-400 hover:text-red-300 text-sm"
                                                                title="Удалить роль"
                                                            >
                                                                ✕
                                                            </button>
                                                        )}
                                                    </div>
                                                )) : <span className="text-gray-500">Нет ролей</span>}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-white font-medium mb-3">Назначить роль:</h4>
                                            <div className="space-y-2">
                                                {roles
                                                    .filter(role => role.name !== 'owner' && !selectedUser.roles?.includes(role.name))
                                                    .map(role => (
                                                        <button
                                                            key={role.id}
                                                            onClick={() => handleAssignRole(selectedUser.id, role.id)}
                                                            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors text-left flex items-center justify-between"
                                                        >
                                                            <span>{getRoleDisplayName(role.name)}</span>
                                                            <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(role.name)}`}>
                                                                {role.name}
                                                            </span>
                                                        </button>
                                                    ))}
                                                {roles.filter(role => role.name !== 'owner' && !selectedUser.roles?.includes(role.name)).length === 0 && (
                                                    <p className="text-gray-400 text-sm">Все доступные роли уже назначены</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
                                    <button
                                        onClick={() => setShowRoleModal(false)}
                                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                                    >
                                        Закрыть
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export { OwnerPanel };