import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api/adminAPI';
import { Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { useConfirm } from './useConfirm';
import { useToast } from '../ui/ToastProvider';
import type { SubscriptionPlan } from '../../types/api';
import { formatMoney } from '../../types/api';
import { extractErrorMessage } from '../../utils/errorFormat';
import StatusBadge from '../ui/StatusBadge';

interface PlanForm { id?: string; name: string; slug: string; price: string; period_type: string; periodDays: string; currency: string; discount_percent: string; original_price: string; description: string; is_active: boolean; is_popular: boolean; }
type Plan = SubscriptionPlan;

const empty: PlanForm = { name: '', slug: '', price: '', period_type: '1_month', periodDays: '', currency: 'UAH', discount_percent: '', original_price: '', description: '', is_active: true, is_popular: false };

const SubscriptionPlansManager: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<PlanForm>(empty);
  const { confirm, ConfirmModal } = useConfirm();
  const { push } = useToast();

  const load = async () => {
    try {
      setLoading(true);
  const raw = await adminAPI.getSubscriptionPlans();
  setPlans(raw.plans as Plan[]);
    } catch (e: any) {
      const msg = extractErrorMessage(e, 'Ошибка загрузки планов');
      setError(msg);
      push({ type: 'error', message: msg });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const problems: string[] = [];
    const priceNum = form.price ? Number(form.price) : 0;
    if (isNaN(priceNum) || priceNum < 0) problems.push('Цена должна быть неотрицательным числом');
    if (form.discount_percent && (isNaN(Number(form.discount_percent)) || Number(form.discount_percent) < 0)) problems.push('Скидка должна быть >= 0');
    if (form.original_price && isNaN(Number(form.original_price))) problems.push('Original price must be numeric');
    if (problems.length) { setError(problems.join('\n')); return; }
    const isEdit = !!form.id;
    const ok = await confirm({ title: isEdit ? 'Изменить план' : 'Создать план', message: `${isEdit ? 'Сохранить изменения' : 'Создать новый план'} «${form.name}»?`, confirmText: isEdit ? 'Сохранить' : 'Создать' });
    if (!ok) return;
    try {
      const payload: any = {
        name: form.name.trim(),
        slug: (form.slug || form.name).trim().toLowerCase().replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,''),
        price: priceNum,
        currency: form.currency.trim(),
        period_type: form.period_type,
        periodDays: form.periodDays ? Number(form.periodDays) : null,
        description: form.description.trim() || null,
        discount_percent: form.discount_percent ? Number(form.discount_percent) : undefined,
        original_price: form.original_price ? Number(form.original_price) : undefined,
        is_active: form.is_active,
        is_popular: form.is_popular
      };
      if (isEdit) await adminAPI.updateSubscriptionPlan(form.id!, payload);
      else await adminAPI.createSubscriptionPlan(payload);
      push({ type: 'success', message: isEdit ? 'План обновлён' : 'План создан' });
      setForm(empty);
      await load();
    } catch (e: any) {
      const msg = extractErrorMessage(e, 'Ошибка сохранения');
      setError(msg);
      push({ type: 'error', message: msg });
    }
  };

  const startEdit = (p: Plan) => setForm({
    id: p.id,
    name: p.name,
    slug: (p as any).slug || '',
    price: String(p.price),
    period_type: (p as any).period_type || '1_month',
    periodDays: p.periodDays != null ? String(p.periodDays) : '',
    currency: (p as any).currency || 'UAH',
    discount_percent: (p as any).discount_percent != null ? String((p as any).discount_percent) : '',
    original_price: (p as any).original_price != null ? String((p as any).original_price) : '',
    description: p.description || '',
    is_active: (p as any).is_active ?? true,
    is_popular: (p as any).is_popular ?? false
  });

  const remove = async (p: Plan) => {
    const ok = await confirm({ title: 'Удаление плана', message: `Удалить план «${p.name}»?`, danger: true, confirmText: 'Удалить' });
    if (!ok) return;
  try { await adminAPI.deleteSubscriptionPlan(p.id); push({ type: 'success', message: 'План удалён' }); await load(); } catch (e: any) { const msg = extractErrorMessage(e, 'Ошибка удаления'); setError(msg); push({ type: 'error', message: msg }); }
  };

  const activate = async (p: Plan) => {
    const ok = await confirm({ title: 'Активация', message: `Активировать план «${p.name}»?`, confirmText: 'Активировать' });
    if (!ok) return;
  try { await adminAPI.activateSubscriptionPlan(p.id); push({ type: 'success', message: 'План активирован' }); await load(); } catch (e: any) { const msg = extractErrorMessage(e, 'Ошибка активации'); setError(msg); push({ type: 'error', message: msg }); }
  };

  return (
    <div className="space-y-6">
      {ConfirmModal}
      <h3 className="text-xl font-semibold">Тарифные планы</h3>
      <form onSubmit={submit} className="bg-gray-800 p-4 rounded grid gap-3 md:grid-cols-4 lg:grid-cols-8">
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Название *" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="Slug" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="Цена" type="number" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <input value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} placeholder="Валюта" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <select value={form.period_type} onChange={e => setForm(f => ({ ...f, period_type: e.target.value }))} className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none">
          <option value="1_month">1 мес</option>
          <option value="3_months">3 мес</option>
          <option value="6_months">6 мес</option>
          <option value="12_months">12 мес</option>
        </select>
        <input value={form.periodDays} onChange={e => setForm(f => ({ ...f, periodDays: e.target.value }))} placeholder="Дней (override)" type="number" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <input value={form.discount_percent} onChange={e => setForm(f => ({ ...f, discount_percent: e.target.value }))} placeholder="Скидка %" type="number" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <input value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))} placeholder="Старая цена" type="number" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Описание" rows={2} className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none col-span-4" />
        <div className="flex items-center gap-4 text-xs col-span-2">
          <label className="flex items-center gap-1"><input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} /> Active</label>
          <label className="flex items-center gap-1"><input type="checkbox" checked={form.is_popular} onChange={e => setForm(f => ({ ...f, is_popular: e.target.checked }))} /> Popular</label>
        </div>
        <button type="submit" className="px-4 py-2 bg-cabinet-blue hover:bg-blue-600 rounded text-sm text-white flex items-center gap-2 justify-center col-span-2"><Plus size={16} /> {form.id ? 'Сохранить' : 'Добавить'}</button>
      </form>
  {error && <div className="text-red-400 text-sm whitespace-pre-line">{error}</div>}
      {loading ? <div className="text-gray-400 text-sm">Загрузка...</div> : (
        <div className="space-y-2">
          {plans.map(p => (
            <div key={p.id} className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded">
              <div className="pr-4 flex-1">
                <p className="text-white text-sm font-medium flex items-center gap-2">{p.name} {p.is_active && <StatusBadge status="active" domain="subscription" />} {(p as any).is_popular && <span className="text-yellow-400 text-[10px] uppercase">popular</span>}</p>
                <p className="text-gray-400 text-xs space-x-3">
                  <span>Цена: {formatMoney(p.price, 'human', 2)} UAH</span>
                  {p.periodDays != null && <span>Период: {p.periodDays} дн.</span>}
                  {(p as any).period_type && <span>{(p as any).period_type}</span>}
                  {(p as any).discount_percent != null && <span>Скидка: {(p as any).discount_percent}%</span>}
                </p>
                {p.description && <p className="text-gray-500 text-xs mt-1 line-clamp-2">{p.description}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="p-2 text-blue-400 hover:text-blue-300" title="Редактировать"><Edit2 size={16}/></button>
                {!p.is_active && <button onClick={() => activate(p)} className="p-2 text-green-400 hover:text-green-300" title="Активировать"><CheckCircle2 size={16}/></button>}
                <button onClick={() => remove(p)} className="p-2 text-red-400 hover:text-red-300" title="Удалить"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
          {plans.length === 0 && <p className="text-gray-500 text-sm">Нет планов</p>}
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlansManager;
