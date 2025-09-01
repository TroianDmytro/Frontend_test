// src/components/admin/CourseManagement.tsx
import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BookOpen, Plus, Edit } from 'lucide-react';

export const CourseManagement: React.FC = () => {
    return (
        <div className="space-y-6">
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Управление курсами
                    </h3>

                    <Button variant="primary" icon={Plus}>
                        Создать курс
                    </Button>
                </div>

                <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-white mb-2">
                        Управление курсами
                    </h4>
                    <p className="text-gray-400 mb-6">
                        Здесь будет интерфейс для создания, редактирования и управления курсами
                    </p>

                    <div className="flex justify-center gap-4">
                        <Button variant="outline" icon={Plus}>
                            Создать новый курс
                        </Button>
                        <Button variant="outline" icon={Edit}>
                            Редактировать курсы
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Заглушка статистики курсов */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center">
                    <h4 className="text-lg font-medium text-white mb-2">Всего курсов</h4>
                    <p className="text-3xl font-bold text-cabinet-blue">24</p>
                </Card>

                <Card className="text-center">
                    <h4 className="text-lg font-medium text-white mb-2">Опубликованные</h4>
                    <p className="text-3xl font-bold text-green-500">18</p>
                </Card>

                <Card className="text-center">
                    <h4 className="text-lg font-medium text-white mb-2">Черновики</h4>
                    <p className="text-3xl font-bold text-yellow-500">6</p>
                </Card>
            </div>
        </div>
    );
};

