import React, { useEffect, useState } from 'react';
import { RefreshCw, Ban, Unlock, Edit2 } from 'lucide-react';
import { Pagination } from '../ui/Pagination';
import { Modal } from '../ui/Modal';
import { adminAPI } from '../../api/adminAPI';
import { extractErrorMessage } from '../../utils/errorFormat';
import type { TeacherSummary } from '../../types/api';
import { useConfirm } from './useConfirm';

// Aligning with canonical TeacherSummary while preserving extended editable fields
interface Teacher extends TeacherSummary {
  email?: string;
  name?: string; // backend may use name + second_name or fullName; keep for edit form
  second_name?: string;
  age?: number;
  telefon_number?: string;
  description?: string;
  specialization?: string;
  education?: string;
  experience_years?: number;
  skills?: string[];
  cv_file_url?: string;
  isBlocked?: boolean;
}

interface TeacherEditable {
  email: string;
  name: string; // сохраним объединённое имя (first + last) если бек ждёт name
  second_name: string; // отчество или фамилия по предоставленной схеме? используем как фамилию если нет отчества
  age: number | '';
  telefon_number: string;
  description: string;
  specialization: string;
  education: string;
  experience_years: number | '';
  skills: string; // строка через запятую в UI -> массив при отправке
  cv_file_url: string;
  password: string;
}

const TeachersManager: React.FC = () => {
  const [items, setItems] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Teacher | null>(null);
  const emptyForm: TeacherEditable = { email: '', name: '', second_name: '', age: '', telefon_number: '', description: '', specialization: '', education: '', experience_years: '', skills: '', cv_file_url: '', password: '' };
  const [form, setForm] = useState<TeacherEditable>(emptyForm);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { confirm, ConfirmModal } = useConfirm();

  const load = async () => {
    try {
      setLoading(true);
  const raw = await adminAPI.getTeachers({ page, limit: 10 });
  setItems(raw.teachers as Teacher[]);
  setTotalPages(raw.pagination.totalPages || 1);
  } catch (e: any) { setError(extractErrorMessage(e, 'Помилка завантаження викладачів')); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page]);

  const toggle = async (t: Teacher) => {
    const block = !t.isBlocked;
    const ok = await confirm({ title: block ? 'Заблокувати' : 'Розблокувати', message: `${block ? 'Заблокувати' : 'Розблокувати'} викладача ${t.email}?`, confirmText: block ? 'Заблокувати' : 'Розблокувати', danger: block });
    if (!ok) return;
    try {
      if (block) await adminAPI.blockTeacher(t.id);
      else await adminAPI.unblockTeacher(t.id);
      await load();
  } catch (e: any) { setError(extractErrorMessage(e, block ? 'Помилка блокування' : 'Помилка розблокування')); }
  };

  const startEdit = (t: Teacher) => {
    setEditing(t);
    setForm({
      email: t.email || '',
      name: t.name || '',
      second_name: t.second_name || '',
      age: t.age ?? '',
      telefon_number: t.telefon_number || '',
      description: t.description || '',
      specialization: t.specialization || '',
      education: t.education || '',
      experience_years: t.experience_years ?? '',
      skills: (t.skills || []).join(', '),
      cv_file_url: t.cv_file_url || '',
      password: ''
    });
  };

  const cancelEdit = () => { setEditing(null); setForm(emptyForm); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      const payload: any = {
        email: form.email || undefined,
        name: form.name || undefined,
        second_name: form.second_name || undefined,
        age: form.age === '' ? undefined : Number(form.age),
        telefon_number: form.telefon_number || undefined,
        description: form.description || undefined,
        specialization: form.specialization || undefined,
        education: form.education || undefined,
        experience_years: form.experience_years === '' ? undefined : Number(form.experience_years),
        skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        cv_file_url: form.cv_file_url || undefined,
        password: form.password || undefined
      };
  await adminAPI.updateTeacher(editing.id, payload);
      cancelEdit();
      await load();
  } catch (e: any) { setError(extractErrorMessage(e, 'Помилка збереження')); }
  };

  return (
    <div className="space-y-6">
      {ConfirmModal}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Викладачі</h3>
        <button onClick={load} disabled={loading} className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 text-sm flex items-center gap-2 disabled:opacity-50"><RefreshCw size={16} className={loading ? 'animate-spin' : ''}/>Оновити</button>
      </div>
  {error && <div className="text-red-400 text-sm whitespace-pre-line">{error}</div>}
  {loading ? <div className="text-gray-400 text-sm">Завантаження...</div> : (
        <div className="space-y-2">
          {items.map(t => (
            <div key={t.id} className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded">
              <div className="text-sm">
                <p className="text-white font-medium">{t.name} {t.second_name}</p>
                <p className="text-gray-400 text-xs">{t.email}</p>
                {t.specialization && <p className="text-gray-500 text-xs">{t.specialization}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(t)} className="p-2 text-blue-400 hover:text-blue-300" title="Редагувати"><Edit2 size={18}/></button>
                <button onClick={() => toggle(t)} className={`p-2 ${t.isBlocked ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'}`} title={t.isBlocked ? 'Розблокувати' : 'Заблокувати'}>
                  {t.isBlocked ? <Unlock size={18}/> : <Ban size={18}/>}
                </button>
              </div>
            </div>
          ))}
          {items.length > 0 && (
            <Pagination page={page} totalPages={totalPages} onChange={setPage} className="pt-2" />
          )}
          {items.length === 0 && <p className="text-gray-500 text-sm">Немає викладачів</p>}
          <Modal
            isOpen={!!editing}
            onClose={cancelEdit}
            title={editing ? `Редагувати викладача` : ''}
            size="lg"
            footer={<div className="flex justify-end gap-2 w-full">
              <button onClick={cancelEdit} className="px-3 py-1.5 bg-gray-700 rounded text-sm">Скасувати</button>
              <button onClick={(e)=>save(e as any)} className="px-3 py-1.5 bg-cabinet-blue hover:bg-blue-600 rounded text-sm">Зберегти</button>
            </div>}
          >
            {editing && (
              <form onSubmit={save} className="grid md:grid-cols-3 gap-3">
                <input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="Email" className="bg-gray-800 rounded px-3 py-2 text-sm"/>
                <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Ім'я" className="bg-gray-800 rounded px-3 py-2 text-sm"/>
                <input value={form.second_name} onChange={e=>setForm(f=>({...f,second_name:e.target.value}))} placeholder="Прізвище" className="bg-gray-800 rounded px-3 py-2 text-sm"/>
                <input value={form.age} onChange={e=>setForm(f=>({...f,age:e.target.value.replace(/\D/g,'') as any}))} placeholder="Вік" className="bg-gray-800 rounded px-3 py-2 text-sm"/>
                <input value={form.telefon_number} onChange={e=>setForm(f=>({...f,telefon_number:e.target.value}))} placeholder="Телефон" className="bg-gray-800 rounded px-3 py-2 text-sm"/>
                <input value={form.specialization} onChange={e=>setForm(f=>({...f,specialization:e.target.value}))} placeholder="Спеціалізація" className="bg-gray-800 rounded px-3 py-2 text-sm"/>
                <input value={form.education} onChange={e=>setForm(f=>({...f,education:e.target.value}))} placeholder="Освіта" className="bg-gray-800 rounded px-3 py-2 text-sm col-span-2"/>
                <input value={form.experience_years} onChange={e=>setForm(f=>({...f,experience_years:e.target.value.replace(/\D/g,'') as any}))} placeholder="Роки досвіду" className="bg-gray-800 rounded px-3 py-2 text-sm"/>
                <input value={form.skills} onChange={e=>setForm(f=>({...f,skills:e.target.value}))} placeholder="Навички (через ,)" className="bg-gray-800 rounded px-3 py-2 text-sm col-span-2"/>
                <input value={form.cv_file_url} onChange={e=>setForm(f=>({...f,cv_file_url:e.target.value}))} placeholder="CV URL" className="bg-gray-800 rounded px-3 py-2 text-sm col-span-2"/>
                <input value={form.password} type="password" onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Новий пароль" className="bg-gray-800 rounded px-3 py-2 text-sm"/>
                <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Опис" className="bg-gray-800 rounded px-3 py-2 text-sm col-span-3" rows={3}/>
                <button type="submit" className="hidden" />
              </form>
            )}
          </Modal>
        </div>
      )}
    </div>
  );
};

export default TeachersManager;
