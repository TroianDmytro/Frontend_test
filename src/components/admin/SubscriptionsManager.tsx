import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api/adminAPI';
import type { Subscription } from '../../types/api';
import { formatMoney } from '../../types/api';
import StatusBadge from '../ui/StatusBadge';
import { Pagination } from '../ui/Pagination';
import { RefreshCw, XCircle, RotateCcw, Zap } from 'lucide-react';
import { useConfirm } from './useConfirm';
import { useToast } from '../ui/ToastProvider';
import { extractErrorMessage } from '../../utils/errorFormat';
// Subscription interface now imported from canonical types

const SubscriptionsManager: React.FC = () => {
  const [items, setItems] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<{ userId: string; courseId: string; status: string; plan: string }>({ userId: '', courseId: '', status: '', plan: '' });
  const [detail, setDetail] = useState<Subscription | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { confirm, ConfirmModal } = useConfirm();
  const { push } = useToast();

  const load = async () => {
    try {
      setLoading(true);
  const raw = await adminAPI.getSubscriptions({ page, userId: filters.userId || undefined, courseId: filters.courseId || undefined, status: filters.status || undefined, plan: filters.plan || undefined });
  setItems(raw.subscriptions as Subscription[]);
  if (raw.pagination) setTotalPages(raw.pagination.totalPages || 1);
    } catch (e: any) {
      const msg = extractErrorMessage(e, 'Ошибка загрузки подписок');
      setError(msg);
      push({ type: 'error', message: msg });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page]); // react to page changes

  const act = async (type: 'cancel' | 'renew' | 'activate', s: Subscription) => {
    const labels: Record<string, string> = { cancel: 'Отменить', renew: 'Продлить', activate: 'Активировать' };
    const ok = await confirm({ title: labels[type], message: `${labels[type]} подписку?`, confirmText: labels[type] });
    if (!ok) return;
    try {
      if (type === 'cancel') await adminAPI.cancelSubscription(s.id);
      if (type === 'renew') await adminAPI.renewSubscription(s.id);
      if (type === 'activate') await adminAPI.activateSubscription(s.id);
      push({ type: 'success', message: 'Операция выполнена' });
      await load();
  } catch (e: any) { const msg = extractErrorMessage(e, 'Ошибка операции'); setError(msg); push({ type: 'error', message: msg }); }
  };

  return (
    <div className="space-y-6">
      {ConfirmModal}
      <h3 className="text-xl font-semibold">Подписки</h3>
      <div className="bg-gray-800 p-4 rounded grid md:grid-cols-7 gap-3">
        <input value={filters.userId} onChange={e => setFilters(f => ({ ...f, userId: e.target.value }))} placeholder="Фильтр userId" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <input value={filters.courseId} onChange={e => setFilters(f => ({ ...f, courseId: e.target.value }))} placeholder="Фильтр courseId" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none">
          <option value="">Статус</option>
          <option value="active">active</option>
          <option value="canceled">canceled</option>
          <option value="expired">expired</option>
          <option value="pending">pending</option>
        </select>
        <input value={filters.plan} onChange={e => setFilters(f => ({ ...f, plan: e.target.value }))} placeholder="План (id/slug)" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <button onClick={load} className="px-3 py-2 bg-cabinet-blue hover:bg-blue-600 rounded text-sm text-white flex items-center gap-2"><RefreshCw size={16}/> Обновить</button>
      </div>
  {error && <div className="text-red-400 text-sm whitespace-pre-line">{error}</div>}
      {loading ? <div className="text-gray-400 text-sm">Загрузка...</div> : (
        <div className="space-y-2">
          {items.map(s => (
            <div key={s.id} className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded cursor-pointer hover:bg-gray-700/70" onClick={() => setDetail(s)}>
              <div className="flex-1 pr-4">
                <p className="text-white text-sm font-medium flex items-center gap-2">{s.id} <StatusBadge status={s.status} domain="subscription" /></p>
                <p className="text-gray-400 text-xs space-x-3">
                  {('planId' in (s as any)) && <span>План: {(s as any).planId}</span>}
                  {s.user && <span>Пользователь: {s.user}</span>}
                  {typeof s.price === 'number' && <span>Цена: {formatMoney(s.price, 'human', 2)} UAH</span>}
                  {typeof s.paidAmount === 'number' && <span>Оплачено: {formatMoney(s.paidAmount, 'human', 2)} UAH</span>}
                </p>
              </div>
              <div className="flex gap-2">
                {s.status !== 'canceled' && <button onClick={(e) => { e.stopPropagation(); act('cancel', s); }} className="p-2 text-red-400 hover:text-red-300" title="Отменить"><XCircle size={16}/></button>}
                <button onClick={(e) => { e.stopPropagation(); act('renew', s); }} className="p-2 text-yellow-400 hover:text-yellow-300" title="Продлить"><RotateCcw size={16}/></button>
                {s.status !== 'active' && <button onClick={(e) => { e.stopPropagation(); act('activate', s); }} className="p-2 text-green-400 hover:text-green-300" title="Активировать"><Zap size={16}/></button>}
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500 text-sm">Нет подписок</p>}
          {items.length > 0 && (
            <Pagination page={page} totalPages={totalPages} onChange={setPage} className="pt-2" />
          )}
        </div>
      )}
      {detail && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setDetail(null)}>
          <div className="bg-gray-900 rounded p-5 w-full max-w-lg text-sm space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between"> <h4 className="font-semibold">Подписка {detail.id}</h4> <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-200">✕</button></div>
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-gray-400">Статус:</span><br/><StatusBadge status={detail.status} domain="subscription" /></div>
              {'planId' in (detail as any) && <div><span className="text-gray-400">План:</span><br/>{(detail as any).planId}</div>}
              {detail.user && <div><span className="text-gray-400">Пользователь:</span><br/>{detail.user}</div>}
              {typeof detail.price === 'number' && <div><span className="text-gray-400">Цена:</span><br/>{formatMoney(detail.price,'human',2)} UAH</div>}
              {typeof detail.paidAmount === 'number' && <div><span className="text-gray-400">Оплачено:</span><br/>{formatMoney(detail.paidAmount,'human',2)} UAH</div>}
              {'startedAt' in (detail as any) && (detail as any).startedAt && <div><span className="text-gray-400">Начало:</span><br/>{(detail as any).startedAt}</div>}
              {'expiresAt' in (detail as any) && (detail as any).expiresAt && <div><span className="text-gray-400">Истекает:</span><br/>{(detail as any).expiresAt}</div>}
              {'nextBillingAt' in (detail as any) && (detail as any).nextBillingAt && <div><span className="text-gray-400">След. биллинг:</span><br/>{(detail as any).nextBillingAt}</div>}
            </div>
            <div className="flex justify-end">
              <button onClick={() => setDetail(null)} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-sm">Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsManager;
