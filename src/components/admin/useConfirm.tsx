import { useState, useCallback } from 'react';

export interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

export const useConfirm = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolver, setResolver] = useState<(v: boolean) => void>(() => () => {});

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setOpen(true);
    return new Promise<boolean>(resolve => {
      setResolver(() => resolve);
    });
  }, []);

  const handle = (result: boolean) => {
    setOpen(false);
    resolver(result);
  };

  const ConfirmModal = open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-800 w-full max-w-md rounded-lg shadow-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-2">{options.title || 'Подтверждение'}</h3>
        <p className="text-gray-300 mb-6 whitespace-pre-line">{options.message || 'Вы уверены?'}</p>
        <div className="flex justify-end space-x-3">
          <button onClick={() => handle(false)} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-sm text-white">{options.cancelText || 'Отмена'}</button>
          <button onClick={() => handle(true)} className={`px-4 py-2 rounded text-sm font-medium text-white ${options.danger ? 'bg-red-600 hover:bg-red-500' : 'bg-cabinet-blue hover:bg-blue-600'}`}>{options.confirmText || 'Подтвердить'}</button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, ConfirmModal } as const;
};
