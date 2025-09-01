// src/components/admin/StatisticsOverview.tsx
import React from 'react';
import { TrendingUp, Users, BookOpen, Target } from 'lucide-react';
import { Card } from '../ui/Card';
import { StatsCard } from './StatsCard';
import type { AdminStatistics, OwnerStatistics } from '../../types/admin.types';

interface StatisticsOverviewProps {
    statistics: AdminStatistics | OwnerStatistics;
}

export const StatisticsOverview: React.FC<StatisticsOverviewProps> = ({ statistics }) => {
    const isOwnerStats = 'financial' in statistics;

    return (
        <div className="space-y-6">
            {/* Общая статистика */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Всего пользователей"
                    value={statistics.users.total.toString()}
                    icon={Users}
                    change={{
                        value: ((statistics.users.newThisMonth / statistics.users.total) * 100),
                        period: 'месяц'
                    }}
                />

                <StatsCard
                    title="Активные курсы"
                    value={statistics.courses.published.toString()}
                    icon={BookOpen}
                    color="text-blue-500"
                />

                <StatsCard
                    title="Подписки"
                    value={statistics.subscriptions.active.toString()}
                    icon={Target}
                    color="text-green-500"
                />

                {isOwnerStats && (
                    <StatsCard
                        title="Месячный доход"
                        value={`₽${(statistics as OwnerStatistics).financial.monthlyRevenue.toLocaleString()}`}
                        icon={TrendingUp}
                        color="text-purple-500"
                        change={{
                            value: (statistics as OwnerStatistics).financial.monthlyGrowth,
                            period: 'месяц'
                        }}
                    />
                )}
            </div>

            {/* Детальная статистика по категориям */}
            <Card>
                <h3 className="text-xl font-bold text-white mb-6">Статистика по категориям</h3>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left py-3 text-gray-300 font-medium">Категория</th>
                                <th className="text-right py-3 text-gray-300 font-medium">Курсы</th>
                                <th className="text-right py-3 text-gray-300 font-medium">Студенты</th>
                                <th className="text-right py-3 text-gray-300 font-medium">Рейтинг</th>
                                {isOwnerStats && (
                                    <th className="text-right py-3 text-gray-300 font-medium">Доход</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {statistics.categories.map((category) => (
                                <tr key={category.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="py-3">
                                        <span className="text-white font-medium">{category.name}</span>
                                    </td>
                                    <td className="py-3 text-right text-gray-300">
                                        {category.coursesCount}
                                    </td>
                                    <td className="py-3 text-right text-gray-300">
                                        {category.studentsCount.toLocaleString()}
                                    </td>
                                    <td className="py-3 text-right">
                                        <span className="text-yellow-500">
                                            ⭐ {category.averageRating.toFixed(1)}
                                        </span>
                                    </td>
                                    {isOwnerStats && (
                                        <td className="py-3 text-right text-green-500 font-medium">
                                            ₽{category.totalRevenue.toLocaleString()}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Статистика по уровням сложности */}
            <Card>
                <h3 className="text-xl font-bold text-white mb-6">Статистика по уровням сложности</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statistics.difficulties.map((level) => (
                        <div key={level.id} className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-white font-medium">{level.name}</h4>
                                <span className="text-xs text-gray-400 uppercase">{level.code}</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Курсы:</span>
                                    <span className="text-white">{level.coursesCount}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Студенты:</span>
                                    <span className="text-white">{level.studentsCount.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Завершение:</span>
                                    <span className="text-green-500">{level.completionRate.toFixed(1)}%</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Рейтинг:</span>
                                    <span className="text-yellow-500">⭐ {level.averageRating.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Финансовые показатели (только для owner) */}
            {isOwnerStats && (
                <Card>
                    <h3 className="text-xl font-bold text-white mb-6">Ключевые финансовые показатели</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-500">
                                {(statistics as OwnerStatistics).financial.conversionRate.toFixed(1)}%
                            </p>
                            <p className="text-gray-400 text-sm">Конверсия</p>
                        </div>

                        <div className="text-center">
                            <p className="text-3xl font-bold text-red-500">
                                {(statistics as OwnerStatistics).financial.churnRate.toFixed(1)}%
                            </p>
                            <p className="text-gray-400 text-sm">Отток</p>
                        </div>

                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-500">
                                ₽{(statistics as OwnerStatistics).financial.averageRevenuePerUser.toLocaleString()}
                            </p>
                            <p className="text-gray-400 text-sm">ARPU</p>
                        </div>

                        <div className="text-center">
                            <p className="text-3xl font-bold text-purple-500">
                                {(statistics as OwnerStatistics).financial.monthlyGrowth > 0 ? '+' : ''}
                                {(statistics as OwnerStatistics).financial.monthlyGrowth.toFixed(1)}%
                            </p>
                            <p className="text-gray-400 text-sm">Рост</p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};