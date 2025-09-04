import React from 'react';
import { Trash2, Lock, Unlock, Pencil } from 'lucide-react';
import type { AdminUser } from './adminTypes';

interface Props {
  users: AdminUser[];
  onBlock: (id: string, isBlocked: boolean) => void;
  onDelete: (id: string) => void;
  onEdit?: (user: AdminUser) => void;
}

const UsersTable: React.FC<Props> = ({ users, onBlock, onDelete, onEdit }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Користувач</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Ролі</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Статус</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Реєстрація</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Дії</th>
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {user.isBlocked ? 'Заблокований' : 'Активний'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('uk-UA') : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(user)}
                        className="p-2 text-blue-400 hover:text-blue-300"
                        title="Редагувати"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onBlock(user.id, !user.isBlocked)}
                      className={`p-2 rounded ${user.isBlocked ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'} transition-colors`}
                      title={user.isBlocked ? 'Розблокувати' : 'Заблокувати'}
                    >
                      {user.isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      title="Видалити користувача"
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
  );
};

export default UsersTable;
