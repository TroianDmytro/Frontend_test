import React from 'react';

export type BadgeDomain = 'subscription' | 'payment';

interface StatusBadgeProps {
  status: string;
  domain: BadgeDomain;
  className?: string;
}

const subscriptionColors: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  active: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  cancelled: 'bg-gray-500/15 text-gray-300 border-gray-500/40',
  canceled: 'bg-gray-500/15 text-gray-300 border-gray-500/40', // alias
  expired: 'bg-slate-500/15 text-slate-300 border-slate-500/40',
  completed: 'bg-sky-500/15 text-sky-300 border-sky-500/40'
};

const paymentColors: Record<string, string> = {
  created: 'bg-slate-500/15 text-slate-300 border-slate-500/40',
  processing: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  failure: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
  canceled: 'bg-gray-500/15 text-gray-300 border-gray-500/40',
  expired: 'bg-slate-600/15 text-slate-300 border-slate-600/40'
};

const labelMap: Record<string, string> = {
  pending: 'Ожидает',
  active: 'Активна',
  cancelled: 'Отменена',
  canceled: 'Отменён',
  expired: 'Истекла',
  completed: 'Завершена',
  created: 'Создан',
  processing: 'Обработка',
  success: 'Оплачен',
  failure: 'Ошибка'
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, domain, className = '' }) => {
  const normalized = status?.toLowerCase();
  const palette = domain === 'subscription' ? subscriptionColors : paymentColors;
  const color = palette[normalized] || 'bg-gray-600/15 text-gray-300 border-gray-600/40';
  const label = labelMap[normalized] || status;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-medium tracking-wide uppercase ${color} ${className}`}>{label}</span>
  );
};

export default StatusBadge;
