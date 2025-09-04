import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api/adminAPI';
import type { CategoryListResponse, Category as ApiCategory, ApiError } from '../../types/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useConfirm } from './useConfirm';

// Local UI shape (subset of canonical Category)
interface Category {
  id: string;
  name: string;
  description?: string | null;
  slug?: string;
  short_description?: string | null;
  color?: string | null;
  parent_id?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
  order?: number | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[] | null;
}

const CategoriesManager: React.FC = () => {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<{
    id?: string;
    name: string;
    slug: string;
    description: string;
    short_description: string;
    color: string;
    parent_id: string;
    isActive: boolean;
    isFeatured: boolean;
    order: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string; // comma separated input
  }>({
    name: '', slug: '', description: '', short_description: '', color: '', parent_id: '', isActive: true, isFeatured: false, order: '', meta_title: '', meta_description: '', meta_keywords: ''
  });
  const { confirm, ConfirmModal } = useConfirm();

  const load = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getCategories(); // CategoryListResponse
      const list: Category[] = (data as CategoryListResponse).categories.map((c: ApiCategory) => ({
        id: c.id,
        name: c.name,
        description: c.description ?? null,
        slug: (c as any).slug,
        short_description: (c as any).short_description ?? null,
        color: (c as any).color ?? null,
        parent_id: (c as any).parent_id ?? null,
        isActive: (c as any).isActive,
        isFeatured: (c as any).isFeatured,
        order: (c as any).order ?? null,
        meta_title: (c as any).meta_title ?? null,
        meta_description: (c as any).meta_description ?? null,
        meta_keywords: (c as any).meta_keywords ?? null
      }));
      setItems(list);
      setError('');
    } catch (e: any) {
      const msg = (e as ApiError)?.message || e?.message || 'Помилка завантаження категорій';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
  if (!form.name.trim()) return;
  // auto slug if empty
  const slugValue = form.slug.trim() || form.name.trim().toLowerCase().replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'');
    const isEdit = !!form.id;
    const ok = await confirm({ title: isEdit ? 'Змінити категорію' : 'Створити категорію', message: `${isEdit ? 'Зберегти зміни' : 'Створити нову категорію'} «${form.name}»?`, confirmText: isEdit ? 'Зберегти' : 'Створити' });
    if (!ok) return;
    try {
      const payload = {
        name: form.name.trim(),
        slug: slugValue,
        description: form.description.trim() || null,
        short_description: form.short_description.trim() || null,
        color: form.color.trim() || null,
        parent_id: form.parent_id || null,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        order: form.order ? Number(form.order) : undefined,
        meta_title: form.meta_title.trim() || null,
        meta_description: form.meta_description.trim() || null,
        meta_keywords: form.meta_keywords ? form.meta_keywords.split(',').map(k=>k.trim()).filter(Boolean) : []
      };
      if (isEdit) await adminAPI.updateCategory(form.id!, payload);
      else await adminAPI.createCategory(payload);
      setForm({ name: '', slug: '', description: '', short_description: '', color: '', parent_id: '', isActive: true, isFeatured: false, order: '', meta_title: '', meta_description: '', meta_keywords: '' });
      await load();
    } catch (e: any) {
      const msg = (e as ApiError)?.message || e?.message || 'Помилка збереження';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  const startEdit = (c: Category) => setForm({
    id: c.id,
    name: c.name,
    slug: c.slug || '',
    description: c.description || '',
    short_description: c.short_description || '',
    color: c.color || '',
    parent_id: c.parent_id || '',
    isActive: c.isActive ?? true,
    isFeatured: c.isFeatured ?? false,
    order: c.order?.toString() || '',
    meta_title: c.meta_title || '',
    meta_description: c.meta_description || '',
    meta_keywords: (c.meta_keywords || []).join(', ')
  });

  const remove = async (c: Category) => {
    const ok = await confirm({ title: 'Видалення', message: `Видалити категорію «${c.name}»?`, danger: true, confirmText: 'Видалити' });
    if (!ok) return;
    try { await adminAPI.deleteCategory(c.id); await load(); } catch (e: any) {
      const msg = (e as ApiError)?.message || e?.message || 'Помилка видалення';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  return (
    <div className="space-y-6">
      {ConfirmModal}
      <h3 className="text-xl font-semibold">Категорії</h3>
      <form onSubmit={submit} className="bg-gray-800 p-4 rounded grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Назва *" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="Slug (auto)" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} placeholder="#Color" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <select value={form.parent_id} onChange={e => setForm(f => ({ ...f, parent_id: e.target.value }))} className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none">
          <option value="">Без батьківської</option>
          {items.filter(i => !form.id || i.id !== form.id).map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
        <input value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} placeholder="Порядок" type="number" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <div className="flex items-center gap-2 text-xs">
          <label className="flex items-center gap-1"><input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} /> Активна</label>
          <label className="flex items-center gap-1"><input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} /> Featured</label>
        </div>
        <input value={form.short_description} onChange={e => setForm(f => ({ ...f, short_description: e.target.value }))} placeholder="Короткий опис" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none col-span-2" />
        <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Опис" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none col-span-2" />
        <input value={form.meta_title} onChange={e => setForm(f => ({ ...f, meta_title: e.target.value }))} placeholder="Meta Title" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none col-span-2" />
        <input value={form.meta_description} onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))} placeholder="Meta Description" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none col-span-3" />
        <input value={form.meta_keywords} onChange={e => setForm(f => ({ ...f, meta_keywords: e.target.value }))} placeholder="Meta keywords (comma)" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none col-span-3" />
        <button type="submit" className="px-4 py-2 bg-cabinet-blue hover:bg-blue-600 rounded text-sm text-white flex items-center gap-2 col-span-6"><Plus size={16} /> {form.id ? 'Зберегти' : 'Додати'}</button>
      </form>
  {error && <div className="text-red-400 text-sm whitespace-pre-line">{error}</div>}
      {loading ? <div className="text-gray-400 text-sm">Завантаження...</div> : (
        <div className="space-y-2">
          {items.map(c => (
            <div key={c.id} className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded">
              <div>
                <p className="text-white text-sm font-medium flex items-center gap-2">{c.name} {c.isActive === false && <span className="text-red-400 text-[10px] uppercase">inactive</span>} {c.isFeatured && <span className="text-yellow-400 text-[10px] uppercase">featured</span>}</p>
                <div className="text-gray-400 text-[11px] space-x-2">
                  {c.slug && <span>/{c.slug}</span>}
                  {c.order != null && <span>#{c.order}</span>}
                  {c.color && <span style={{ background:c.color }} className="inline-block w-3 h-3 rounded align-middle" />}
                  {c.parent_id && <span>parent: {items.find(i=>i.id===c.parent_id)?.name || c.parent_id}</span>}
                </div>
                {c.short_description && <p className="text-gray-400 text-xs">{c.short_description}</p>}
                {c.description && <p className="text-gray-500 text-[11px] line-clamp-2">{c.description}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(c)} className="p-2 text-blue-400 hover:text-blue-300" title="Редагувати"><Edit2 size={16} /></button>
                <button onClick={() => remove(c)} className="p-2 text-red-400 hover:text-red-300" title="Видалити"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500 text-sm">Немає категорій</p>}
        </div>
      )}
    </div>
  );
};

export default CategoriesManager;
