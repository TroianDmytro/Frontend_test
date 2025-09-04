import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, FilePlus2, X, Save } from 'lucide-react';
import { adminAPI } from '../../api/adminAPI';
import { extractErrorMessage } from '../../utils/errorFormat';
import type { Subject } from '../../types/api';
import { useConfirm } from './useConfirm';

const empty: { id: string | undefined; name: string; description: string } = { id: undefined, name: '', description: '' };

interface MaterialForm { id?: string; title: string; type: string; url: string; description: string; }
const emptyMat: MaterialForm = { title: '', type: 'video', url: '', description: '' };

const SubjectsManager: React.FC = () => {
  const [items, setItems] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(empty);
  const [materialsFor, setMaterialsFor] = useState<string | null>(null);
  const [materialForm, setMaterialForm] = useState<MaterialForm>(emptyMat);
  const [savingMaterial, setSavingMaterial] = useState(false);
  const { confirm, ConfirmModal } = useConfirm();

  const load = async () => {
    try {
      setLoading(true);
  const list = await adminAPI.getSubjects(); // Strict Subject[]
  setItems(list);
  } catch (e: any) { setError(extractErrorMessage(e, 'Помилка завантаження предметів')); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const editing = !!form.id;
    const ok = await confirm({ title: editing ? 'Змінити предмет' : 'Створити предмет', message: `${editing ? 'Зберегти зміни' : 'Створити новий предмет'} «${form.name}»?`, confirmText: editing ? 'Зберегти' : 'Створити' });
    if (!ok) return;
    try {
      if (editing) await adminAPI.updateSubject(form.id!, { name: form.name, description: form.description || null });
      else await adminAPI.createSubject({ name: form.name, description: form.description || null });
      setForm(empty);
      await load();
  } catch (e: any) { setError(extractErrorMessage(e, 'Помилка збереження')); }
  };

  const startEdit = (s: Subject) => setForm({ id: s.id, name: s.name, description: s.description || '' });

  const openMaterials = (s: Subject) => {
    setMaterialsFor(s.id);
    setMaterialForm(emptyMat);
  };

  const saveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialsFor || !materialForm.title.trim()) return;
    setSavingMaterial(true);
    try {
      // Backend endpoints hypothetically: POST /subjects/:id/materials  (adjust if different)
      await adminAPI.addSubjectMaterial(materialsFor, {
        title: materialForm.title.trim(),
        type: materialForm.type,
        url: materialForm.url.trim() || null,
        description: materialForm.description.trim() || null
      });
      // reload subjects (assumes backend returns updated subject materials on GET /subjects)
      await load();
      setMaterialForm(emptyMat);
    } catch (e: any) {
      setError(extractErrorMessage(e, 'Помилка збереження матеріалу'));
    } finally { setSavingMaterial(false); }
  };

  const remove = async (s: Subject) => {
    const ok = await confirm({ title: 'Видалення', message: `Видалити предмет «${s.name}»?`, danger: true, confirmText: 'Видалити' });
    if (!ok) return;
  try { await adminAPI.deleteSubject(s.id); await load(); } catch (e: any) { setError(extractErrorMessage(e, 'Помилка видалення')); }
  };

  return (
    <div className="space-y-6">
      {ConfirmModal}
      <h3 className="text-xl font-semibold">Предмети</h3>
      <form onSubmit={submit} className="bg-gray-800 p-4 rounded flex flex-col md:flex-row gap-4">
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Назва" className="flex-1 bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Опис" className="flex-1 bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <button type="submit" className="px-4 py-2 bg-cabinet-blue hover:bg-blue-600 rounded text-sm text-white flex items-center gap-2"><Plus size={16} /> {form.id ? 'Зберегти' : 'Додати'}</button>
      </form>
  {error && <div className="text-red-400 text-sm whitespace-pre-line">{error}</div>}
      {loading ? <div className="text-gray-400 text-sm">Завантаження...</div> : (
        <div className="space-y-2">
          {items.map((s, idx) => {
            if (!s.id && typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
              console.warn('[SubjectsManager] item without id (diagnostic)', s);
            }
            return (
              <div key={s.id || `subject-${idx}`} className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded">
                <div>
                  <p className="text-white text-sm font-medium">{s.name}</p>
                  {s.description && <p className="text-gray-400 text-xs">{s.description}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openMaterials(s)} className="p-2 text-indigo-400 hover:text-indigo-300" title="Матеріали"><FilePlus2 size={16} /></button>
                  <button onClick={() => startEdit(s)} className="p-2 text-blue-400 hover:text-blue-300" title="Редагувати"><Edit2 size={16} /></button>
                  <button onClick={() => remove(s)} className="p-2 text-red-400 hover:text-red-300" title="Видалити"><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })}
          {items.length === 0 && <p className="text-gray-500 text-sm">Немає предметів</p>}
        </div>
      )}
      {materialsFor && (
        <div className="mt-6 bg-gray-900 p-4 rounded">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm">Матеріали предмета</h4>
            <button onClick={() => { setMaterialsFor(null); setMaterialForm(emptyMat); }} className="text-gray-400 hover:text-gray-200" title="Закрити"><X size={16}/></button>
          </div>
          {/* Existing materials list (read-only if present) */}
          <div className="space-y-2 mb-4">
            {items.find(s=>s.id===materialsFor)?.studyMaterials?.map(m => (
              <div key={m.id} className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded text-xs">
                <div className="flex-1 pr-4">
                  <p className="text-white font-medium">{m.title} <span className="text-gray-400">[{m.type}]</span></p>
                  {m.description && <p className="text-gray-400">{m.description}</p>}
                  {m.url && <a href={m.url} target="_blank" rel="noreferrer" className="text-cabinet-blue hover:underline">Переглянути</a>}
                </div>
                {/* Delete material (hypothetical endpoint) */}
                <button onClick={async () => {
                  try {
                    await adminAPI.deleteSubjectMaterial(materialsFor, m.id);
                    await load();
                  } catch (e: any) { setError(extractErrorMessage(e, 'Помилка видалення матеріалу')); }
                }} className="p-1 text-red-400 hover:text-red-300" title="Видалити"><Trash2 size={14}/></button>
              </div>
            ))}
            {!(items.find(s=>s.id===materialsFor)?.studyMaterials?.length) && <p className="text-gray-500 text-xs">Немає матеріалів</p>}
          </div>
          <form onSubmit={saveMaterial} className="grid gap-3 md:grid-cols-5">
            <input value={materialForm.title} onChange={e=>setMaterialForm(f=>({...f,title:e.target.value}))} placeholder="Назва *" className="bg-gray-800 rounded px-3 py-2 text-xs focus:outline-none md:col-span-2" />
            <select value={materialForm.type} onChange={e=>setMaterialForm(f=>({...f,type:e.target.value}))} className="bg-gray-800 rounded px-3 py-2 text-xs focus:outline-none">
              <option value="video">video</option>
              <option value="pdf">pdf</option>
              <option value="link">link</option>
              <option value="zip">zip</option>
            </select>
            <input value={materialForm.url} onChange={e=>setMaterialForm(f=>({...f,url:e.target.value}))} placeholder="URL" className="bg-gray-800 rounded px-3 py-2 text-xs focus:outline-none" />
            <input value={materialForm.description} onChange={e=>setMaterialForm(f=>({...f,description:e.target.value}))} placeholder="Опис" className="bg-gray-800 rounded px-3 py-2 text-xs focus:outline-none" />
            <button type="submit" disabled={savingMaterial} className="px-3 py-2 bg-cabinet-blue hover:bg-blue-600 rounded text-xs text-white flex items-center gap-1 justify-center md:col-span-1 disabled:opacity-50"><Save size={14}/> {materialForm.id ? 'Зберегти' : 'Додати'}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SubjectsManager;
