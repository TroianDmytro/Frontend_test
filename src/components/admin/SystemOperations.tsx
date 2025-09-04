import React from 'react';
import { TrendingUp, BookOpen } from 'lucide-react';

interface Props {
  refreshing: boolean;
  onOp: (op: string) => void;
}

const SystemOperations: React.FC<Props> = ({ refreshing, onOp }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <button
        onClick={() => onOp('update-difficulty-stats')}
        disabled={refreshing}
        className="p-6 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-left disabled:opacity-50"
      >
        <TrendingUp className="w-8 h-8 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Обновить статистику сложности</h3>
        <p className="text-sm text-blue-200">Пересчитать данные о сложности курсов</p>
      </button>

      <button
        onClick={() => onOp('update-categories-stats')}
        disabled={refreshing}
        className="p-6 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-left disabled:opacity-50"
      >
        <BookOpen className="w-8 h-8 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Обновить категории</h3>
        <p className="text-sm text-green-200">Пересчитать статистику категорий</p>
      </button>
    </div>
  );
};

export default SystemOperations;
