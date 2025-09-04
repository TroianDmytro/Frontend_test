// src/components/admin/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Ban, Trash2, UserPlus, RefreshCw, Download, Edit2, CheckSquare, XSquare, Info } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { adminAPI } from '../../api/adminAPI';
import { ownerAPI } from '../../api/ownerAPI';
import type { User, Role } from '../../types/admin.types';

interface UserManagementProps {
    canManageRoles: boolean;
}

export const UserManagement: React.FC<UserManagementProps> = ({ canManageRoles }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterBlocked, setFilterBlocked] = useState<'all' | 'blocked' | 'active'>('all');
    const [regFrom, setRegFrom] = useState('');
    const [regTo, setRegTo] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [detailUser, setDetailUser] = useState<User | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailSubs, setDetailSubs] = useState<any[]>([]);
    const [detailPays, setDetailPays] = useState<any[]>([]);
    const [editForm, setEditForm] = useState<{ name: string; second_name: string; email: string; age: string; telefon_number: string; avatarId: string }>({ name: '', second_name: '', email: '', age: '', telefon_number: '', avatarId: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showRoleModal, setShowRoleModal] = useState(false);

    useEffect(() => {
        loadUsers();
        if (canManageRoles) {
            loadRoles();
        }
    }, [currentPage, canManageRoles]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getUsers(currentPage, 20, searchTerm);
            setUsers(response.users);
            setTotalPages(response.pagination.totalPages);
        } catch (error) {
            console.error('Ошибка загрузки пользователей:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadRoles = async () => {
        try {
            const rolesData = await ownerAPI.getRoles();
            setRoles(rolesData);
        } catch (error) {
            console.error('Ошибка загрузки ролей:', error);
        }
    };

    const handleBlockUser = async (userId: string, isBlocked: boolean) => {
        try {
            const updatedUser = await adminAPI.blockUser(userId, isBlocked);
            setUsers(prev => prev.map(user =>
                user.id === userId ? updatedUser : user
            ));
        } catch (error) {
            console.error('Ошибка блокировки пользователя:', error);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Вы уверены, что хотите удалить пользователя?')) return;

        try {
            await adminAPI.deleteUser(userId);
            setUsers(prev => prev.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Ошибка удаления пользователя:', error);
        }
    };

    const handleAssignRole = async (userId: string, roleId: string) => {
        try {
            await ownerAPI.assignRole(userId, roleId);
            await loadUsers(); // Перезагружаем список пользователей
            setShowRoleModal(false);
        } catch (error) {
            console.error('Ошибка назначения роли:', error);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) || `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.roles.includes(filterRole);
        const matchesBlocked = filterBlocked === 'all' || (filterBlocked === 'blocked' ? user.isBlocked : !user.isBlocked);
        const created = new Date(user.createdAt).getTime();
        const fromOk = !regFrom || created >= new Date(regFrom).getTime();
        const toOk = !regTo || created <= new Date(regTo).getTime();
        return matchesSearch && matchesRole && matchesBlocked && fromOk && toOk;
    });

    const toggleSelect = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const allOnPageSelected = filteredUsers.length > 0 && filteredUsers.every(u => selectedIds.includes(u.id));
    const toggleSelectAll = () => {
        if (allOnPageSelected) setSelectedIds(prev => prev.filter(id => !filteredUsers.some(u => u.id === id)));
        else setSelectedIds(prev => [...prev, ...filteredUsers.filter(u => !prev.includes(u.id)).map(u => u.id)]);
    };

    const bulkBlock = async (block: boolean) => {
        for (const id of selectedIds) {
            try { await handleBlockUser(id, block); } catch { /* continue */ }
        }
        await loadUsers();
    };

    const openDetail = async (u: User) => {
        setDetailUser(u);
        setDetailLoading(true);
        setDetailSubs([]); setDetailPays([]);
        try {
            // Load subscriptions (first page only) and payments
            const subsResp = await adminAPI.getSubscriptions({ page: 1, userId: u.id });
            setDetailSubs(subsResp.subscriptions?.slice(0, 20) || []);
            const payResp = await adminAPI.getPaymentsByUser(u.id).catch(()=>({ payments: [] }));
            const pays = (payResp.payments || payResp.payment ? (payResp.payments || [payResp.payment]) : []);
            setDetailPays(pays.slice(0, 20));
        } catch (e) { console.error('Ошибка загрузки деталей пользователя', e); }
        finally { setDetailLoading(false); }
    };

    const exportSelected = () => {
        const rows = users.filter(u => selectedIds.includes(u.id)).map(u => ({ id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, roles: u.roles.join(';'), blocked: u.isBlocked }));
        const csv = ['id,email,firstName,lastName,roles,blocked', ...rows.map(r => `${r.id},${r.email},${r.firstName},${r.lastName},${r.roles},${r.blocked}`)].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'users_export.csv';
        a.click();
    };

    const openEdit = (u: User) => {
        setSelectedUser(u);
        setEditForm({
            name: u.firstName || u.name || '',
            second_name: u.lastName || u.second_name || '',
            email: u.email || '',
            age: (u.age?.toString() || ''),
            telefon_number: u.telefon_number || u.phone || '',
            avatarId: u.avatarId || ''
        });
        setShowEditModal(true);
    };

    const saveEdit = async () => {
        if (!selectedUser) return;
        try {
            await adminAPI.updateUser(selectedUser.id, {
                name: editForm.name.trim() || undefined,
                second_name: editForm.second_name.trim() || undefined,
                email: editForm.email.trim() || undefined,
                age: editForm.age ? Number(editForm.age) : undefined,
                telefon_number: editForm.telefon_number.trim() || undefined,
                avatarId: editForm.avatarId.trim() || undefined
            });
            await loadUsers();
            setShowEditModal(false);
        } catch (e) { console.error('Ошибка сохранения профиля', e); }
    };

    const getRoleColor = (role: string) => {
        const colors = {
            user: 'bg-green-600',
            teacher: 'bg-blue-600',
            admin: 'bg-purple-600',
            owner: 'bg-yellow-600'
        };
        return colors[role as keyof typeof colors] || 'bg-gray-600';
    };

    const getRoleDisplayName = (role: string) => {
        const names = {
            user: 'Пользователь',
            teacher: 'Преподаватель',
            admin: 'Администратор',
            owner: 'Владелец'
        };
        return names[role as keyof typeof names] || role;
    };

    return (
        <Card>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-white">Управление пользователями</h3>

                {/* Действия */}
                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadUsers}
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Обновить
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* Экспорт данных */ }}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Экспорт
                    </Button>
                </div>
            </div>

            {/* Фильтры */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Поиск по email или имени..."
                        className="pl-10 pr-4 py-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cabinet-blue"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cabinet-blue"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="all">Все роли</option>
                        <option value="user">Пользователи</option>
                        <option value="teacher">Преподаватели</option>
                        <option value="admin">Администраторы</option>
                        <option value="owner">Владельцы</option>
                    </select>
                                        <select
                                                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cabinet-blue"
                                                value={filterBlocked}
                                                onChange={e => setFilterBlocked(e.target.value as any)}
                                        >
                                                <option value="all">Все</option>
                                                <option value="active">Активные</option>
                                                <option value="blocked">Заблокированные</option>
                                        </select>
                                        <input type="date" value={regFrom} onChange={e => setRegFrom(e.target.value)} className="px-2 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm" title="Регистрация c" />
                                        <input type="date" value={regTo} onChange={e => setRegTo(e.target.value)} className="px-2 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm" title="Регистрация по" />
                                        {selectedIds.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => bulkBlock(true)} className="px-2 py-1 text-xs bg-red-600 rounded hover:bg-red-500">Блокировать выб.</button>
                                                <button onClick={() => bulkBlock(false)} className="px-2 py-1 text-xs bg-green-600 rounded hover:bg-green-500">Разблок. выб.</button>
                                                <button onClick={exportSelected} className="px-2 py-1 text-xs bg-cabinet-blue rounded hover:bg-blue-600">Экспорт выб.</button>
                                            </div>
                                        )}
                </div>
            </div>

            {/* Таблица пользователей */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-2 text-gray-300 font-medium"><input type="checkbox" checked={allOnPageSelected} onChange={toggleSelectAll} /></th>
                            <th className="text-left py-3 px-2 text-gray-300 font-medium">Пользователь</th>
                            <th className="text-left py-3 px-2 text-gray-300 font-medium">Роли</th>
                            <th className="text-left py-3 px-2 text-gray-300 font-medium">Статус</th>
                            <th className="text-left py-3 px-2 text-gray-300 font-medium">Регистрация</th>
                            <th className="text-left py-3 px-2 text-gray-300 font-medium">Активность</th>
                            <th className="text-right py-3 px-2 text-gray-300 font-medium">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cabinet-blue mx-auto"></div>
                                </td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-400">
                                    Пользователи не найдены
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="py-4 px-2 align-top"><input type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => toggleSelect(user.id)} /></td>
                                    <td className="py-4 px-2">
                                        <div className="flex items-center gap-3">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={`${user.firstName} ${user.lastName}`}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cabinet-blue to-cabinet-purple flex items-center justify-center text-white text-sm font-medium">
                                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-white font-medium">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <p className="text-gray-400 text-sm">{user.email}</p>
                                                {user.authProvider === 'google' && (
                                                    <span className="text-xs text-blue-400">Google</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-2">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.map((role) => (
                                                <span
                                                    key={role}
                                                    className={`px-2 py-1 rounded-full text-xs text-white ${getRoleColor(role)}`}
                                                >
                                                    {getRoleDisplayName(role)}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4 px-2">
                                        <div className="flex flex-col gap-1">
                                            <span className={`px-2 py-1 rounded-full text-xs w-fit ${user.isBlocked
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-green-600 text-white'
                                                }`}>
                                                {user.isBlocked ? 'Заблокирован' : 'Активен'}
                                            </span>
                                            {!user.isEmailConfirmed && (
                                                <span className="px-2 py-1 rounded-full text-xs bg-yellow-600 text-white w-fit">
                                                    Email не подтвержден
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 text-gray-400 text-sm">
                                        {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                                    </td>
                                    <td className="py-4 px-2 text-gray-400 text-sm">
                                        {new Date(user.lastActivity).toLocaleDateString('ru-RU')}
                                    </td>
                                    <td className="py-4 px-2">
                                        <div className="flex justify-end gap-2">
                                            {canManageRoles && (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowRoleModal(true);
                                                    }}
                                                    title="Управление ролями"
                                                >
                                                    <UserPlus className="w-4 h-4" />
                                                </Button>
                                            )}

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEdit(user)}
                                                title="Редактировать профиль"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openDetail(user)}
                                                title="Детали"
                                            >
                                                <Info className="w-4 h-4" />
                                            </Button>

                                            <Button
                                                variant={user.isBlocked ? "outline" : "danger"}
                                                size="sm"
                                                onClick={() => handleBlockUser(user.id, !user.isBlocked)}
                                                title={user.isBlocked ? "Разблокировать" : "Заблокировать"}
                                            >
                                                {user.isBlocked ? <Eye className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                            </Button>

                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteUser(user.id)}
                                                title="Удалить пользователя"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-700">
                    <span className="text-gray-400 text-sm">
                        Страница {currentPage} из {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        >
                            Назад
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        >
                            Далее
                        </Button>
                    </div>
                </div>
            )}

            {/* Модальное окно управления ролями */}
            {showRoleModal && selectedUser && (
                <Modal
                    isOpen={showRoleModal}
                    onClose={() => setShowRoleModal(false)}
                    title={`Управление ролями: ${selectedUser.firstName} ${selectedUser.lastName}`}
                >
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-white font-medium mb-2">Текущие роли:</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedUser.roles.map(role => (
                                    <span
                                        key={role}
                                        className={`px-3 py-1 rounded-full text-sm text-white ${getRoleColor(role)}`}
                                    >
                                        {getRoleDisplayName(role)}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-medium mb-2">Назначить роль:</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {roles
                                    .filter(role => !selectedUser.roles.includes(role.name))
                                    .map(role => (
                                        <Button
                                            key={role.id}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleAssignRole(selectedUser.id, role.id)}
                                        >
                                            {getRoleDisplayName(role.name)}
                                        </Button>
                                    ))}
                            </div>
                        </div>
                    </div>
                </Modal>
                        )}

                        {showEditModal && selectedUser && (
                            <Modal
                                isOpen={showEditModal}
                                onClose={() => setShowEditModal(false)}
                                title={`Редактирование: ${selectedUser.firstName} ${selectedUser.lastName}`}
                            >
                                <div className="space-y-4">
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <input value={editForm.name} onChange={e=>setEditForm(f=>({...f, name:e.target.value}))} placeholder="Имя" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
                                        <input value={editForm.second_name} onChange={e=>setEditForm(f=>({...f, second_name:e.target.value}))} placeholder="Фамилия" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
                                        <input value={editForm.email} onChange={e=>setEditForm(f=>({...f, email:e.target.value}))} placeholder="Email" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none md:col-span-2" />
                                        <input value={editForm.age} onChange={e=>setEditForm(f=>({...f, age:e.target.value.replace(/[^0-9]/g,'')}))} placeholder="Возраст" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
                                        <input value={editForm.telefon_number} onChange={e=>setEditForm(f=>({...f, telefon_number:e.target.value}))} placeholder="Телефон" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
                                        <input value={editForm.avatarId} onChange={e=>setEditForm(f=>({...f, avatarId:e.target.value}))} placeholder="Avatar ID" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none md:col-span-2" />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button onClick={()=>setShowEditModal(false)} className="px-4 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 flex items-center gap-1"><XSquare className="w-4 h-4"/> Отмена</button>
                                        <button onClick={saveEdit} className="px-4 py-2 bg-cabinet-blue rounded text-sm hover:bg-blue-600 flex items-center gap-1"><CheckSquare className="w-4 h-4"/> Сохранить</button>
                                    </div>
                                </div>
                            </Modal>
                        )}

                                    {detailUser && (
                                        <Modal
                                            isOpen={!!detailUser}
                                            onClose={() => setDetailUser(null)}
                                            title={`Детали пользователя: ${detailUser.firstName} ${detailUser.lastName}`}
                                            size="lg"
                                        >
                                            {detailLoading ? (
                                                <div className="text-sm text-gray-400">Загрузка...</div>
                                            ) : (
                                                <div className="space-y-6 text-sm">
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="font-semibold text-white mb-2">Профиль</h4>
                                                            <ul className="space-y-1 text-gray-300">
                                                                <li><span className="text-gray-500">ID:</span> {detailUser.id}</li>
                                                                <li><span className="text-gray-500">Email:</span> {detailUser.email}</li>
                                                                <li><span className="text-gray-500">Имя:</span> {detailUser.firstName} {detailUser.lastName}</li>
                                                                <li><span className="text-gray-500">Роли:</span> {detailUser.roles.join(', ')}</li>
                                                                <li><span className="text-gray-500">Создан:</span> {new Date(detailUser.createdAt).toLocaleString('ru-RU')}</li>
                                                                <li><span className="text-gray-500">Последняя активность:</span> {new Date(detailUser.lastActivity).toLocaleString('ru-RU')}</li>
                                                                <li><span className="text-gray-500">Статус:</span> {detailUser.isBlocked ? 'Заблокирован' : 'Активен'}</li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-white mb-2">Подписки (до 20)</h4>
                                                            {detailSubs.length === 0 && <p className="text-gray-500">Нет</p>}
                                                            <ul className="space-y-1 max-h-40 overflow-auto pr-2">
                                                                {detailSubs.map(s => (
                                                                    <li key={s.id} className="flex justify-between border-b border-gray-800 py-1">
                                                                        <span className="text-gray-300 text-xs">{s.id}</span>
                                                                        <span className="text-gray-400 text-xs">{s.status}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-white mb-2">Платежи (до 20)</h4>
                                                        {detailPays.length === 0 && <p className="text-gray-500">Нет</p>}
                                                        <ul className="space-y-1 max-h-52 overflow-auto pr-2">
                                                            {detailPays.map(p => (
                                                                <li key={p.id} className="grid grid-cols-5 gap-2 text-xs border-b border-gray-800 py-1">
                                                                    <span className="col-span-2 truncate" title={p.id}>{p.id}</span>
                                                                    <span>{p.status}</span>
                                                                    <span>{p.amount} {p.currency}</span>
                                                                    <span className="text-gray-500 truncate" title={p.invoiceId}>{p.invoiceId}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                        </Modal>
                                    )}
        </Card>
    );
};