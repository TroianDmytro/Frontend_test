import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api/adminAPI';
import { useConfirm } from './useConfirm';
import { Modal } from '../ui/Modal';

interface Props { user: any | null; onClose: () => void; onSaved: (updated: any) => void; }

const EditUserModal: React.FC<Props> = ({ user, onClose, onSaved }) => {
  const { confirm, ConfirmModal } = useConfirm();
  const [form, setForm] = useState({ name: '', second_name: '', email: '', age: '', telefon_number: '', avatarId: '' });
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const [errors, setErrors] = useState<{ age?: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.firstName || user.name || '',
        second_name: user.lastName || user.second_name || '',
        email: user.email || '',
        age: user.age?.toString() || '',
        telefon_number: user.telefon_number || user.phone || '',
        avatarId: user.avatarId || ''
      });
      setAvatarRemoved(false);
      setErrors({});
    }
  }, [user]);

  const save = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) return;
    const ok = await confirm({ title: 'Оновити користувача', message: 'Зберегти зміни?', confirmText: 'Зберегти' });
    if (!ok) return;
    try {
      setLoading(true); setError('');
      if (errors.age) return;
      await adminAPI.updateUser(user.id, {
        name: form.name.trim() || undefined,
        second_name: form.second_name.trim() || undefined,
        email: form.email.trim() || undefined,
        age: form.age ? Number(form.age) : undefined,
        telefon_number: form.telefon_number.trim() || undefined,
        avatarId: avatarRemoved ? undefined : (form.avatarId.trim() || undefined),
        avatarRemoved: avatarRemoved || undefined
      } as any);
      onSaved({ ...user, firstName: form.name, lastName: form.second_name, ...form });
      onClose();
    } catch (e: any) { setError(e.message || 'Помилка збереження'); }
    finally { setLoading(false); }
  };

  return (
  <Modal isOpen={!!user} onClose={onClose} title="Редагування користувача" size="sm" footer={<><button onClick={onClose} className="px-3 py-1.5 text-sm bg-gray-700 rounded hover:bg-gray-600">Скасувати</button><button onClick={save} disabled={loading || !!errors.age} className={`px-3 py-1.5 text-sm rounded disabled:opacity-50 ${errors.age ? 'bg-gray-500' : 'bg-cabinet-blue hover:bg-blue-600'}`}>Зберегти</button></>}>
      {ConfirmModal}
      <form onSubmit={save} className="space-y-4">
        {error && <div className="text-red-400 text-xs">{error}</div>}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Ім'я</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Прізвище</label>
          <input value={form.second_name} onChange={e => setForm(f => ({ ...f, second_name: e.target.value }))} className="w-full bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Email</label>
          <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Вік</label>
          <input
            value={form.age}
            onChange={e => {
              const v = e.target.value.replace(/[^0-9]/g,'');
              setForm(f => ({ ...f, age: v }));
              if (v && (Number(v) < 0 || Number(v) > 150)) setErrors(er => ({ ...er, age: 'Вік 0-150' })); else setErrors(er => { const { age, ...rest } = er; return rest; });
            }}
            className="w-full bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none"
          />
          {errors.age && <span className="text-xs text-red-400">{errors.age}</span>}
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Телефон</label>
          <input value={form.telefon_number} onChange={e => setForm(f => ({ ...f, telefon_number: e.target.value }))} className="w-full bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Avatar ID</label>
          <div className="flex items-center gap-2">
            <input
              value={form.avatarId}
              onChange={e => { setForm(f => ({ ...f, avatarId: e.target.value })); setAvatarRemoved(false); }}
              className="flex-1 bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none disabled:opacity-50"
              disabled={avatarRemoved}
              placeholder="Avatar ID"
            />
            {user?.avatar && !avatarRemoved && (
              <button type="button" onClick={() => { setAvatarRemoved(true); setForm(f => ({ ...f, avatarId: '' })); }} className="px-2 py-1.5 bg-red-600 rounded text-xs hover:bg-red-500">Удалить</button>
            )}
            {avatarRemoved && <span className="text-xs text-yellow-400">Будет удалён</span>}
          </div>
          {user?.avatar && !avatarRemoved && (
            <img src={user.avatar} alt="avatar" className="mt-2 w-16 h-16 rounded object-cover border border-gray-600" />
          )}
        </div>
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
};

export default EditUserModal;
