import React, { useEffect, useState } from 'react';
import { Check, Ban, RefreshCw } from 'lucide-react';
import { adminAPI } from '../../api/adminAPI';
import type { TeacherApplicationsResponse } from '../../types/api';
import { extractErrorMessage } from '../../utils/errorFormat';
import { useConfirm } from './useConfirm';

interface TeacherApplication { id: string; userId: string; firstName?: string; lastName?: string; email?: string; createdAt?: string; status?: string; }

const TeacherApplicationsManager: React.FC = () => {
  const [items, setItems] = useState<TeacherApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { confirm, ConfirmModal } = useConfirm();

  const load = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getTeacherApplications();
      const resp = data as TeacherApplicationsResponse;
      const list = resp.applications.map(a => ({
        id: a.id,
        userId: a.id, // backend currently provides application id; using same as userId until spec extends
        email: a.email,
        status: a.approvalStatus,
        createdAt: a.createdAt
      }));
      setItems(list);
  } catch (e: any) { setError(extractErrorMessage(e, 'Помилка завантаження заявок')); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const approve = async (app: TeacherApplication) => {
    const ok = await confirm({ title: 'Підтвердити викладача', message: `Схвалити заявку «${app.email || app.userId}»?`, confirmText: 'Схвалити' });
    if (!ok) return;
  try { await adminAPI.approveTeacher(app.userId); await load(); } catch (e: any) { setError(extractErrorMessage(e, 'Помилка схвалення')); }
  };

  const block = async (app: TeacherApplication) => {
    const ok = await confirm({ title: 'Відхилити', message: `Відхилити/заблокувати заявку «${app.email || app.userId}»?`, danger: true, confirmText: 'Відхилити' });
    if (!ok) return;
  try { await adminAPI.blockTeacher(app.userId); await load(); } catch (e: any) { setError(extractErrorMessage(e, 'Помилка блокування')); }
  };

  return (
    <div className="space-y-6">
      {ConfirmModal}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Заявки викладачів</h3>
        <button onClick={load} disabled={loading} className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 text-sm flex items-center gap-2 disabled:opacity-50"><RefreshCw className={loading ? 'animate-spin' : ''} size={16}/>Оновити</button>
      </div>
  {error && <div className="text-red-400 text-sm whitespace-pre-line">{error}</div>}
      {loading ? <div className="text-gray-400 text-sm">Завантаження...</div> : (
        <div className="space-y-2">
          {items.map(a => (
            <div key={a.id || a.userId} className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded">
              <div className="flex flex-col">
                <span className="text-white text-sm font-medium">{a.firstName || ''} {a.lastName || ''}</span>
                <span className="text-gray-400 text-xs">{a.email || a.userId}</span>
                {a.createdAt && <span className="text-gray-500 text-xs">{new Date(a.createdAt).toLocaleString('uk-UA')}</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => approve(a)} className="p-2 text-green-400 hover:text-green-300" title="Схвалити"><Check size={18}/></button>
                <button onClick={() => block(a)} className="p-2 text-red-400 hover:text-red-300" title="Відхилити"><Ban size={18}/></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500 text-sm">Немає заявок</p>}
        </div>
      )}
    </div>
  );
};

export default TeacherApplicationsManager;
