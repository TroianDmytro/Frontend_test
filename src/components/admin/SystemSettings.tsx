// src/components/admin/SystemSettings.tsx
import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Settings, Shield, UserPlus, RefreshCw, Database } from 'lucide-react';

interface SystemSettingsProps {
    isOwner: boolean;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({ isOwner }) => {
    return (
        <div className="space-y-6">
            <Card>
                <div className="flex items-center gap-2 mb-6">
                    <Settings className="w-5 h-5 text-cabinet-blue" />
                    <h3 className="text-xl font-bold text-white">Системные настройки</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Управление пользователями */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium text-white">Управление пользователями</h4>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                                <span className="text-gray-300">Регистрация новых пользователей</span>
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="w-4 h-4 text-cabinet-blue bg-gray-700 border-gray-600 rounded focus:ring-cabinet-blue"
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                                <span className="text-gray-300">Email подтверждение</span>
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="w-4 h-4 text-cabinet-blue bg-gray-700 border-gray-600 rounded focus:ring-cabinet-blue"
                                />
                            </div>

                            {isOwner && (
                                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                                    <span className="text-gray-300">Назначить администратора</span>
                                    <Button variant="secondary" size="sm" icon={UserPlus}>
                                        Назначить
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Системные операции */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium text-white">Системные операции</h4>

                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                icon={RefreshCw}
                            >
                                Обновить статистику курсов
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                icon={Database}
                            >
                                Проверить целостность данных
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                icon={Shield}
                            >
                                Проверить безопасность
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Статистика системы */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg mx-auto mb-3">
                        <Database className="w-6 h-6 text-green-500" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">База данных</h4>
                    <p className="text-lg font-bold text-green-500">Здорова</p>
                </Card>

                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mx-auto mb-3">
                        <Shield className="w-6 h-6 text-blue-500" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Безопасность</h4>
                    <p className="text-lg font-bold text-blue-500">Норма</p>
                </Card>

                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mx-auto mb-3">
                        <RefreshCw className="w-6 h-6 text-purple-500" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Uptime</h4>
                    <p className="text-lg font-bold text-purple-500">99.9%</p>
                </Card>

                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-lg mx-auto mb-3">
                        <Settings className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Версия</h4>
                    <p className="text-lg font-bold text-yellow-500">2.1.0</p>
                </Card>
            </div>

            {/* Предупреждение для админов */}
            {!isOwner && (
                <Card className="border-yellow-600 bg-yellow-900/10">
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-yellow-500 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-yellow-500">Ограниченный доступ</h4>
                            <p className="text-sm text-yellow-200 mt-1">
                                Некоторые настройки доступны только владельцу платформы.
                                Для полного доступа обратитесь к администратору.
                            </p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};