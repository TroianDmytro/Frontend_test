import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api/adminAPI';
import type { DifficultyLevelListResponse, DifficultyLevel as ApiDifficultyLevel } from '../../types/api';
import { extractErrorMessage } from '../../utils/errorFormat';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useConfirm } from './useConfirm';

interface DifficultyLevel { id: string; name: string; order?: number; slug?: string; code?: string; level?: number; color?: string | null; description?: string | null; isActive?: boolean; }

const DifficultiesManager: React.FC = () => {
  const [items, setItems] = useState<DifficultyLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<{ id?: string; name: string; slug: string; code: string; level: string; order: string; color: string; description: string; isActive: boolean }>({ name: '', slug: '', code: '', level: '', order: '', color: '', description: '', isActive: true });
  const { confirm, ConfirmModal } = useConfirm();

  const load = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getDifficultyLevels();
      const list: DifficultyLevel[] = (data as DifficultyLevelListResponse).levels.map((lvl: ApiDifficultyLevel) => ({
        id: lvl.id,
        name: lvl.name,
        order: (lvl as any).order,
        slug: (lvl as any).slug,
        code: (lvl as any).code,
        level: (lvl as any).level,
        color: (lvl as any).color,
        description: (lvl as any).description,
        isActive: (lvl as any).isActive
      }));
      setItems(list);
      setError('');
    } catch (e: any) { setError(extractErrorMessage(e, 'Помилка завантаження рівнів')); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
  if (!form.name.trim()) return;
  const problems: string[] = [];
  const slugValue = form.slug.trim() || form.name.trim().toLowerCase().replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'');
  if (form.level && isNaN(Number(form.level))) problems.push('Level must be a number');
  if (form.order && isNaN(Number(form.order))) problems.push('Order must be a number');
  if (problems.length) { setError(problems.join('\n')); return; }
    const isEdit = !!form.id;
    const ok = await confirm({ title: isEdit ? 'Змінити рівень' : 'Створити рівень', message: `${isEdit ? 'Зберегти зміни' : 'Створити новий рівень'} «${form.name}»?`, confirmText: isEdit ? 'Зберегти' : 'Створити' });
    if (!ok) return;
    try {
      const payload: any = {
        name: form.name.trim(),
        slug: slugValue,
        code: form.code.trim() || undefined,
        level: form.level ? Number(form.level) : undefined,
        order: form.order ? Number(form.order) : undefined,
        color: form.color.trim() || null,
        description: form.description.trim() || null,
        isActive: form.isActive
      };
      if (isEdit) await adminAPI.updateDifficulty(form.id!, payload);
      else await adminAPI.createDifficulty(payload);
      setForm({ name: '', slug: '', code: '', level: '', order: '', color: '', description: '', isActive: true });
      await load();
  } catch (e: any) { setError(extractErrorMessage(e, 'Помилка збереження')); }
  };

  const startEdit = (d: DifficultyLevel) => setForm({
    id: d.id,
    name: d.name,
    slug: d.slug || '',
    code: d.code || '',
    level: d.level?.toString() || '',
    order: d.order?.toString() || '',
    color: d.color || '',
    description: d.description || '',
    isActive: d.isActive ?? true
  });

  const remove = async (d: DifficultyLevel) => {
    const ok = await confirm({ title: 'Видалення', message: `Видалити рівень «${d.name}»?`, danger: true, confirmText: 'Видалити' });
    if (!ok) return;
  try { await adminAPI.deleteDifficulty(d.id); await load(); } catch (e: any) { setError(extractErrorMessage(e, 'Помилка видалення')); }
  };

  return (
    <div className="space-y-6">
      {ConfirmModal}
      <h3 className="text-xl font-semibold">Рівні складності</h3>
      <form onSubmit={submit} className="bg-gray-800 p-4 rounded grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Назва *" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="Slug" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="Code" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <input value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} placeholder="Level" type="number" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <input value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} placeholder="Order" type="number" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} placeholder="#Color" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Опис" rows={2} className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none col-span-3" />
        <div className="flex items-center gap-2 text-xs">
          <label className="flex items-center gap-1"><input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} /> Active</label>
        </div>
        <button type="submit" className="px-4 py-2 bg-cabinet-blue hover:bg-blue-600 rounded text-sm text-white flex items-center gap-2 col-span-6"><Plus size={16} /> {form.id ? 'Зберегти' : 'Додати'}</button>
      </form>
  {error && <div className="text-red-400 text-sm whitespace-pre-line">{error}</div>}
      {loading ? <div className="text-gray-400 text-sm">Завантаження...</div> : (
        <div className="space-y-2">
          {items.map(d => (
            <div key={d.id} className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded">
              <div>
                <p className="text-white text-sm font-medium flex items-center gap-2">{d.name} {d.isActive === false && <span className="text-red-400 text-[10px] uppercase">inactive</span>}</p>
                <div className="text-gray-400 text-[11px] space-x-3">
                  {d.slug && <span>/{d.slug}</span>}
                  {d.code && <span>code: {d.code}</span>}
                  {typeof d.level === 'number' && <span>L{d.level}</span>}
                  {typeof d.order === 'number' && <span># {d.order}</span>}
                  {d.color && <span style={{ background:d.color }} className="inline-block w-3 h-3 rounded align-middle" />}
                </div>
                {d.description && <p className="text-gray-500 text-[11px] line-clamp-2">{d.description}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(d)} className="p-2 text-blue-400 hover:text-blue-300" title="Редагувати"><Edit2 size={16} /></button>
                <button onClick={() => remove(d)} className="p-2 text-red-400 hover:text-red-300" title="Видалити"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500 text-sm">Немає рівнів</p>}
        </div>
      )}
    </div>
  );
};

export default DifficultiesManager;
