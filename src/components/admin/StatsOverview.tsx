import React from 'react';
import type { AdminStatistics } from '../../types/admin.types';

interface Props { statistics: AdminStatistics | null }

const StatsOverview: React.FC<Props> = ({ statistics }) => {
  if (!statistics) return null;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Распределение по ролям</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{statistics.users.byRole?.users || 0}</p>
            <p className="text-sm text-gray-400">Пользователи</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{statistics.users.byRole?.teachers || 0}</p>
            <p className="text-sm text-gray-400">Преподаватели</p>
          </div>
            <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">{statistics.users.byRole?.admins || 0}</p>
            <p className="text-sm text-gray-400">Администраторы</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">{statistics.users.byRole?.owners || 0}</p>
            <p className="text-sm text-gray-400">Владельцы</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
