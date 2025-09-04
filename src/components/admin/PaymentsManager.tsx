import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api/adminAPI';
import { RefreshCw, RotateCw, Ban, Eye } from 'lucide-react';
import { useToast } from '../ui/ToastProvider';
import { useConfirm } from './useConfirm';
import type { Payment } from '../../types/api';
import { formatMoney } from '../../types/api';
import StatusBadge from '../ui/StatusBadge';
import { extractErrorMessage } from '../../utils/errorFormat';

const PaymentsManager: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const { push } = useToast();
  const [detail, setDetail] = useState<Payment | null>(null);
  const { confirm, ConfirmModal } = useConfirm();

  const load = async () => {
    if (!userId.trim()) return;
    try {
      setLoading(true);
  const raw = await adminAPI.getPaymentsByUser(userId.trim());
  setPayments((raw.payments || raw.payment ? (raw.payments || [raw.payment]) : []) as Payment[]);
  } catch (e: any) { const msg = extractErrorMessage(e, 'Ошибка загрузки платежей'); setError(msg); push({ type: 'error', message: msg }); }
    finally { setLoading(false); }
  };

  const cancel = async (p: Payment) => {
    const ok = await confirm({ title: 'Отмена платежа', message: 'Отменить платеж?', confirmText: 'Отменить', danger: true });
    if (!ok) return;
  try { await adminAPI.cancelPayment(p.id); push({ type: 'success', message: 'Платеж отменён' }); await load(); } catch (e: any) { const msg = extractErrorMessage(e, 'Ошибка отмены'); setError(msg); push({ type: 'error', message: msg }); }
  };

  const sync = async (p: Payment) => {
  try { await adminAPI.syncPayment(p.invoiceId); push({ type: 'success', message: 'Синхронизировано' }); await load(); } catch (e: any) { const msg = extractErrorMessage(e, 'Ошибка синхронизации'); setError(msg); push({ type: 'error', message: msg }); }
  };

  useEffect(() => { /* wait for user action */ }, []);

  return (
    <div className="space-y-6">
      {ConfirmModal}
      <h3 className="text-xl font-semibold">Платежи</h3>
      <div className="bg-gray-800 p-4 rounded flex flex-col md:flex-row gap-4">
        <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="userId" className="flex-1 bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <button onClick={load} className="px-4 py-2 bg-cabinet-blue hover:bg-blue-600 rounded text-sm text-white flex items-center gap-2"><RefreshCw size={16}/> Загрузить</button>
      </div>
  {error && <div className="text-red-400 text-sm whitespace-pre-line">{error}</div>}
      {loading ? <div className="text-gray-400 text-sm">Загрузка...</div> : (
        <div className="space-y-2">
          {payments.map(p => (
            <div key={p.id} className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded cursor-pointer hover:bg-gray-700/70" onClick={() => setDetail(p)}>
              <div className="flex-1 pr-4">
                <p className="text-white text-sm font-medium flex items-center gap-2">{p.id} <StatusBadge status={p.status} domain="payment" /></p>
                <p className="text-gray-400 text-xs space-x-3">
                  <span>Invoice: {p.invoiceId}</span>
                  <span>Сумма: {formatMoney(p.amount, 'minor', 2)} {p.currency}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); setDetail(p); }} className="p-2 text-cyan-400 hover:text-cyan-300" title="Детали"><Eye size={16}/></button>
                <button onClick={() => sync(p)} className="p-2 text-green-400 hover:text-green-300" title="Синхронизировать"><RotateCw size={16}/></button>
                {p.status !== 'canceled' && p.status !== 'success' && <button onClick={() => cancel(p)} className="p-2 text-red-400 hover:text-red-300" title="Отменить"><Ban size={16}/></button>}
              </div>
            </div>
          ))}
          {payments.length === 0 && <p className="text-gray-500 text-sm">Нет платежей</p>}
        </div>
      )}
      {detail && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setDetail(null)}>
          <div className="bg-gray-900 rounded p-5 w-full max-w-lg text-sm space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between"> <h4 className="font-semibold">Платёж {detail.id}</h4> <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-200">✕</button></div>
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-gray-400">Статус:</span><br/><StatusBadge status={detail.status} domain="payment" /></div>
              <div><span className="text-gray-400">Invoice:</span><br/>{detail.invoiceId}</div>
              <div><span className="text-gray-400">Сумма:</span><br/>{formatMoney(detail.amount,'minor',2)} {detail.currency}</div>
              {'userId' in (detail as any) && (detail as any).userId && <div><span className="text-gray-400">User:</span><br/>{(detail as any).userId}</div>}
              {'subscriptionId' in (detail as any) && (detail as any).subscriptionId && <div><span className="text-gray-400">Subscription:</span><br/>{(detail as any).subscriptionId}</div>}
              {'courseId' in (detail as any) && (detail as any).courseId && <div><span className="text-gray-400">Course:</span><br/>{(detail as any).courseId}</div>}
              {'createdAt' in (detail as any) && (detail as any).createdAt && <div><span className="text-gray-400">Создан:</span><br/>{(detail as any).createdAt}</div>}
              {'updatedAt' in (detail as any) && (detail as any).updatedAt && <div><span className="text-gray-400">Обновлён:</span><br/>{(detail as any).updatedAt}</div>}
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

export default PaymentsManager;
