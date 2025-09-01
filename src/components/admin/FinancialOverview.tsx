// src/components/admin/FinancialOverview.tsx
import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Users, CreditCard, PieChart, BarChart3, RefreshCw } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ownerAPI } from '../../api/ownerAPI';
import type { FinancialData, RevenueAnalytics } from '../../types/admin.types';

interface FinancialOverviewProps {
    data: FinancialData;
}

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({ data }) => {
    const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadRevenueAnalytics();
    }, [selectedPeriod]);

    const loadRevenueAnalytics = async () => {
        try {
            setLoading(true);
            const analytics = await ownerAPI.getRevenueAnalytics(selectedPeriod);
            setRevenueAnalytics(analytics);
        } catch (error) {
            console.error('Ошибка загрузки аналитики:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return `₽${amount.toLocaleString('ru-RU')}`;
    };

    const formatPercentage = (value: number) => {
        return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
    };

    return (
        <div className="space-y-6">
            {/* Основная статистика */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Общий доход"
                    value={formatCurrency(data.totalRevenue)}
                    icon={DollarSign}
                    color="text-green-500"
                    change={{
                        value: data.monthlyGrowth,
                        period: 'месяц'
                    }}
                />
                <StatsCard
                    title="Месячный доход"
                    value={formatCurrency(data.monthlyRevenue)}
                    icon={TrendingUp}
                    color="text-blue-500"
                />
                <StatsCard
                    title="Активные подписки"
                    value={data.activeSubscriptions.toString()}
                    icon={CreditCard}
                    color="text-purple-500"
                />
                <StatsCard
                    title="ARPU"
                    value={formatCurrency(data.averageRevenuePerUser)}
                    icon={Users}
                    color="text-yellow-500"
                />
            </div>

            {/* Дополнительная статистика */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Конверсия"
                    value={formatPercentage(data.conversionRate)}
                    icon={TrendingUp}
                    color="text-indigo-500"
                />
                <StatsCard
                    title="Отток (Churn Rate)"
                    value={formatPercentage(data.churnRate)}
                    icon={TrendingUp}
                    color="text-red-500"
                />
                <StatsCard
                    title="Новые подписки"
                    value={data.newSubscriptionsThisMonth.toString()}
                    icon={Users}
                    color="text-cyan-500"
                />
            </div>

            {/* График доходов */}
            <Card>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Аналитика доходов
                    </h3>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-800 rounded-lg p-1">
                            {(['week', 'month', 'year'] as const).map((period) => (
                                <button
                                    key={period}
                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${selectedPeriod === period
                                            ? 'bg-cabinet-blue text-white'
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                    onClick={() => setSelectedPeriod(period)}
                                >
                                    {period === 'week' ? 'Неделя' : period === 'month' ? 'Месяц' : 'Год'}
                                </button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={loadRevenueAnalytics}
                            disabled={loading}
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>

                {revenueAnalytics && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-400 text-sm">Общий доход за период</p>
                                <p className="text-2xl font-bold text-white">{formatCurrency(revenueAnalytics.total)}</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-400 text-sm">Средний доход в день</p>
                                <p className="text-2xl font-bold text-white">{formatCurrency(revenueAnalytics.averagePerDay)}</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-400 text-sm">Рост за период</p>
                                <p className={`text-2xl font-bold ${revenueAnalytics.growth > 0 ? 'text-green-500' :
                                        revenueAnalytics.growth < 0 ? 'text-red-500' : 'text-gray-400'
                                    }`}>
                                    {formatPercentage(revenueAnalytics.growth)}
                                </p>
                            </div>
                        </div>

                        {/* Простой график (можно заменить на библиотеку типа Chart.js) */}
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-end justify-between h-32 gap-2">
                                {revenueAnalytics.data.slice(-7).map((item, index) => {
                                    const height = (item.revenue / Math.max(...revenueAnalytics.data.map(d => d.revenue))) * 100;
                                    return (
                                        <div key={index} className="flex flex-col items-center flex-1">
                                            <div
                                                className="bg-gradient-to-t from-cabinet-blue to-cabinet-purple rounded-t-sm w-full mb-2"
                                                style={{ height: `${height}%` }}
                                                title={`${item.date}: ${formatCurrency(item.revenue)}`}
                                            />
                                            <span className="text-xs text-gray-400">
                                                {new Date(item.date).toLocaleDateString('ru-RU', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {/* Статистика по тарифным планам */}
            <Card>
                <div className="flex items-center gap-2 mb-6">
                    <PieChart className="w-5 h-5 text-cabinet-blue" />
                    <h3 className="text-xl font-bold text-white">Статистика по тарифным планам</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Таблица планов */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left py-3 text-gray-300 font-medium">План</th>
                                    <th className="text-right py-3 text-gray-300 font-medium">Подписчики</th>
                                    <th className="text-right py-3 text-gray-300 font-medium">Доход</th>
                                    <th className="text-right py-3 text-gray-300 font-medium">Рост</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.planStatistics.map((plan) => (
                                    <tr key={plan.id} className="border-b border-gray-800">
                                        <td className="py-3">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: plan.color }}
                                                />
                                                <div>
                                                    <p className="text-white font-medium">{plan.name}</p>
                                                    <p className="text-gray-400 text-sm">{formatCurrency(plan.price)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 text-right">
                                            <p className="text-white">{plan.subscribers.toLocaleString()}</p>
                                        </td>
                                        <td className="py-3 text-right">
                                            <p className="text-green-500 font-medium">
                                                {formatCurrency(plan.revenue)}
                                            </p>
                                        </td>
                                        <td className="py-3 text-right">
                                            <span className={`text-sm font-medium ${plan.growthRate > 0 ? 'text-green-500' :
                                                    plan.growthRate < 0 ? 'text-red-500' : 'text-gray-400'
                                                }`}>
                                                {formatPercentage(plan.growthRate)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Диаграмма долей (простая реализация) */}
                    <div className="flex flex-col justify-center">
                        <h4 className="text-white font-medium mb-4">Распределение подписчиков</h4>
                        <div className="space-y-3">
                            {data.planStatistics.map((plan) => {
                                const totalSubscribers = data.planStatistics.reduce((sum, p) => sum + p.subscribers, 0);
                                const percentage = (plan.subscribers / totalSubscribers) * 100;

                                return (
                                    <div key={plan.id}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-gray-300 text-sm">{plan.name}</span>
                                            <span className="text-gray-400 text-sm">{percentage.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: plan.color
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Прогнозы и рекомендации */}
            <Card>
                <h3 className="text-xl font-bold text-white mb-4">Финансовые показатели</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium text-white">Ключевые метрики</h4>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                                <span className="text-gray-300">LTV/CAC соотношение</span>
                                <span className="text-green-500 font-medium">3.2x</span>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                                <span className="text-gray-300">Время окупаемости</span>
                                <span className="text-blue-500 font-medium">4.2 мес</span>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                                <span className="text-gray-300">Маржинальность</span>
                                <span className="text-purple-500 font-medium">68%</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-medium text-white">Рекомендации</h4>

                        <div className="space-y-3">
                            {data.churnRate > 10 && (
                                <div className="p-3 bg-red-900/20 border border-red-600 rounded-lg">
                                    <p className="text-red-400 text-sm">
                                        🚨 Высокий уровень оттока ({data.churnRate.toFixed(1)}%).
                                        Рекомендуется провести анализ причин отмены подписок.
                                    </p>
                                </div>
                            )}

                            {data.conversionRate < 5 && (
                                <div className="p-3 bg-yellow-900/20 border border-yellow-600 rounded-lg">
                                    <p className="text-yellow-400 text-sm">
                                        ⚠️ Низкая конверсия ({data.conversionRate.toFixed(1)}%).
                                        Стоит оптимизировать воронку продаж.
                                    </p>
                                </div>
                            )}

                            {data.monthlyGrowth > 10 && (
                                <div className="p-3 bg-green-900/20 border border-green-600 rounded-lg">
                                    <p className="text-green-400 text-sm">
                                        ✅ Отличный рост доходов ({data.monthlyGrowth.toFixed(1)}%)!
                                        Продолжайте в том же направлении.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};