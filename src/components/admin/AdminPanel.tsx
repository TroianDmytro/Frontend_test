// src/components/admin/AdminPanel.tsx - Исправления типов
import { useState, useEffect } from 'react';
import { Users, BookOpen, TrendingUp, RefreshCw, Shield, Layers, ListChecks, DollarSign, CreditCard, GraduationCap, Settings } from 'lucide-react';
import StatsOverview from './StatsOverview';
import UsersTable from './UsersTable';
import SystemOperations from './SystemOperations';
import type { AdminUser } from './adminTypes';
import type { AdminStatistics } from '../../types/admin.types';
import { adminAPI } from '../../api/adminAPI';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission, Permissions } from '../../auth/roles';
import CategoriesManager from './CategoriesManager';
import DifficultiesManager from './DifficultiesManager';
import CoursesManager from './CoursesManager';
import SubjectsManager from './SubjectsManager';
import TeacherApplicationsManager from './TeacherApplicationsManager';
import { useConfirm } from './useConfirm';
import SubscriptionPlansManager from './SubscriptionPlansManager';
import SubscriptionsManager from './SubscriptionsManager';
import PaymentsManager from './PaymentsManager';
import { useToast } from '../ui/ToastProvider';
import TeachersManager from './TeachersManager';
import EditUserModal from './EditUserModal';
import { extractErrorMessage } from '../../utils/errorFormat';

// Интерфейсы для типизации
// Типы вынесены в adminTypes.ts

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { user } = useAuth();
    const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [editUser, setEditUser] = useState<any | null>(null);

    const tabs = [
        { id: 'overview', label: 'Огляд', icon: TrendingUp },
        { id: 'users', label: 'Користувачі', icon: Users },
        { id: 'teachers', label: 'Викладачі', icon: GraduationCap },
        { id: 'categories', label: 'Категорії', icon: Layers },
        { id: 'difficulties', label: 'Рівні складності', icon: ListChecks },
    { id: 'subjects', label: 'Предмети', icon: BookOpen },
    { id: 'courses', label: 'Курси', icon: BookOpen },
    { id: 'plans', label: 'Тарифні плани', icon: DollarSign },
    { id: 'subscriptions', label: 'Підписки', icon: CreditCard },
    { id: 'payments', label: 'Платежі', icon: CreditCard },
        { id: 'teacherApps', label: 'Заявки викладачів', icon: GraduationCap },
        { id: 'system', label: 'Система', icon: Settings }
    ];
    const { confirm, ConfirmModal } = useConfirm();
    const { push } = useToast();

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
        } catch (e: any) {
            const msg = extractErrorMessage(e);
            console.error('❌ Error loading admin data:', e);
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

    const handleBlockUser = async (userId: string, isBlocked: boolean) => {
        const ok = await confirm({
            title: isBlocked ? 'Блокировка пользователя' : 'Разблокировка пользователя',
            message: `${isBlocked ? 'Заблокировать' : 'Разблокировать'} пользователя?`,
            confirmText: isBlocked ? 'Заблокировать' : 'Разблокировать'
        });
        if (!ok) return;
        try {
            await adminAPI.blockUser(userId, isBlocked);
            setUsers(prev => prev.map(user => user.id === userId ? { ...user, isBlocked } : user));
        } catch (e: any) {
            const msg = extractErrorMessage(e);
            console.error('❌ Error blocking user:', e);
            setError('Ошибка при изменении статуса пользователя: ' + msg);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        const ok = await confirm({ title: 'Удаление пользователя', message: 'Удалить пользователя без возможности восстановления?', danger: true, confirmText: 'Удалить' });
        if (!ok) return;
        try {
            await adminAPI.deleteUser(userId);
            setUsers(prev => prev.filter(user => user.id !== userId));
        } catch (e: any) {
            const msg = extractErrorMessage(e);
            console.error('❌ Error deleting user:', e);
            setError('Ошибка при удалении пользователя: ' + msg);
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
            push({ type: 'info', message: `Проверено подписок. Истекших: ${result?.expiredCount || 0}, уведомлений: ${result?.notifiedCount || 0}` });
                    break;
                default:
                    break;
            }
        push({ type: 'success', message: 'Операция выполнена успешно' });
            await loadData();
        } catch (e: any) {
            const msg = extractErrorMessage(e);
            console.error('❌ Error performing system operation:', e);
            setError('Ошибка выполнения операции: ' + msg);
            push({ type: 'error', message: msg || 'Ошибка выполнения операции' });
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
        <div className="min-h-screen bg-cabinet-black text-cabinet-white flex">
            {ConfirmModal}
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
                <div className="p-4 flex items-center gap-2 border-b border-gray-800">
                    <Shield className="w-6 h-6 text-cabinet-blue" />
                    <span className="font-semibold">Адмін панель</span>
                </div>
                <nav className="flex-1 overflow-y-auto py-2">
                    {tabs.filter(t => !(t.id === 'system' && !hasPermission(user?.roles, Permissions.SYSTEM_OPERATIONS))).map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors ${activeTab === tab.id ? 'bg-cabinet-blue/20 text-white border-l-4 border-cabinet-blue' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="p-3 text-xs text-gray-500 border-t border-gray-800">© {new Date().getFullYear()}</div>
            </aside>
            {/* Main */}
            <main className="flex-1 p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        {tabs.find(t => t.id === activeTab)?.label}
                    </h1>
                    <button
                        onClick={handleRefreshData}
                        disabled={refreshing}
                        className="flex items-center px-4 py-2 bg-cabinet-blue hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />Оновити
                    </button>
                </div>
                {error && <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-6 whitespace-pre-line">{error}</div>}
                {activeTab === 'overview' && <StatsOverview statistics={statistics} />}
                {activeTab === 'users' && <div className="space-y-6"><UsersTable users={users} onBlock={handleBlockUser} onDelete={handleDeleteUser} onEdit={u => setEditUser(u)} />{editUser && <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSaved={(upd) => setUsers(prev => prev.map(u => u.id === upd.id ? upd : u))} />}</div>}
                {activeTab === 'categories' && <CategoriesManager />}
                {activeTab === 'difficulties' && <DifficultiesManager />}
                {activeTab === 'subjects' && <SubjectsManager />}
                {activeTab === 'courses' && <CoursesManager />}
                {activeTab === 'plans' && <SubscriptionPlansManager />}
                {activeTab === 'subscriptions' && <SubscriptionsManager />}
                {activeTab === 'payments' && <PaymentsManager />}
                {activeTab === 'teacherApps' && <TeacherApplicationsManager />}
                {activeTab === 'system' && <SystemOperations refreshing={refreshing} onOp={handleSystemOperation} />}
                {activeTab === 'teachers' && <TeachersManager />}
            </main>
        </div>
    );
};

export default AdminPanel;