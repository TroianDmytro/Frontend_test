import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api/adminAPI';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission, Permissions } from '../../auth/roles';
import { Plus, Edit2, Trash2, Rocket, Copy, UserPlus, Calendar, List } from 'lucide-react';
import { useConfirm } from './useConfirm';
import { useToast } from '../ui/ToastProvider';
import { Modal } from '../ui/Modal';
import { extractErrorMessage } from '../../utils/errorFormat';
import { Pagination } from '../ui/Pagination';

import type { Course, Category, DifficultyLevel as Difficulty, Subject } from '../../types/api';

// Local narrowed view model (can extend base types if needed)
interface UICourse extends Course { slug?: string; currency?: string; duration?: number; is_active?: boolean; isFeatured?: boolean; }
interface GlobalSubject { id: string; name?: string; title?: string; description?: string | null; }

const emptyForm = {
  id: undefined as string | undefined,
  title: '',
  slug: '',
  description: '',
  categoryId: '',
  difficultyLevelId: '',
  price: '' as any, // keep as string for controlled input then coerce
  currency: 'UAH',
  duration: '' as any,
  is_active: true,
  isFeatured: false,
  startDate: ''
};

const CoursesManager: React.FC = () => {
  const [courses, setCourses] = useState<UICourse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const { confirm, ConfirmModal } = useConfirm();
  const { user } = useAuth();
  const canManage = hasPermission(user?.roles, Permissions.MANAGE_COURSES);
  const [subjectsFor, setSubjectsFor] = useState<string | null>(null);
  const [courseSubjects, setCourseSubjects] = useState<(Subject & { id: string })[]>([]);
  const [subjectLoading, setSubjectLoading] = useState(false);
  const [startDateInput, setStartDateInput] = useState<string>('');
  const [allSubjects, setAllSubjects] = useState<GlobalSubject[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { push } = useToast();

  // Generic action modal state (enroll user / add subject / assign teacher / set subject start)
  const [actionModal, setActionModal] = useState<null | { type: 'enroll' | 'add-subject' | 'subject-teacher' | 'subject-start'; courseId: string; subjectId?: string }>(null);
  const [actionValue, setActionValue] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const [catsRes, diffsRes, subjectsRes, coursesRes] = await Promise.all([
        adminAPI.getCategories(),
        adminAPI.getDifficultyLevels(),
        adminAPI.getSubjects(),
        adminAPI.getCourses({ page, limit: 50 })
      ]);
      setCategories(catsRes.categories);
      setDifficulties(diffsRes.levels as Difficulty[]);
      setAllSubjects(subjectsRes.map(s => ({ id: s.id, name: s.name, title: s.name, description: s.description })));
      setCourses(coursesRes.courses);
      if (coursesRes.pagination) setTotalPages(coursesRes.pagination.totalPages || 1);
  } catch (e: any) { const msg = extractErrorMessage(e, 'Помилка завантаження'); setError(msg); push({ type: 'error', message: msg }); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side validation mirroring backend messages
    const problems: string[] = [];
    if (!form.title.trim()) problems.push('Название не может быть пустым');
    if (!form.slug.trim()) problems.push('Slug не может быть пустым');
    if (form.slug && typeof form.slug !== 'string') problems.push('Slug должен быть строкой');
    const priceNum = form.price === '' ? 0 : Number(form.price);
    if (isNaN(priceNum)) problems.push('Цена должна быть числом');
    else if (priceNum < 0) problems.push('Цена не может быть отрицательной');
    if (!form.currency?.trim()) problems.push('Валюта не может быть пустой');
    else if (typeof form.currency !== 'string') problems.push('Валюта должна быть строкой');
    const durationNum = form.duration === '' ? 0 : Number(form.duration);
    if (isNaN(durationNum)) problems.push('Длительность должна быть числом');
    else if (durationNum <= 0) problems.push('Длительность должна быть положительной');
    if (form.startDate) {
      const d = new Date(form.startDate);
      if (isNaN(d.getTime())) problems.push('Дата начала должна быть валидной датой');
    }
    if (!problems.length && typeof form.is_active !== 'boolean') problems.push('is_active должно быть булевым значением');
    if (problems.length) { setError(problems.join('\n')); return; }
    const isEdit = !!form.id;
    const ok = await confirm({ title: isEdit ? 'Изменить курс' : 'Создать курс', message: `${isEdit ? 'Сохранить изменения' : 'Создать новый курс'} «${form.title}»?`, confirmText: isEdit ? 'Сохранить' : 'Создать' });
    if (!ok) return;
    try {
      const payload: any = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description?.trim() || null,
        price: priceNum,
        currency: form.currency.trim(),
        duration: durationNum,
        is_active: !!form.is_active,
        isFeatured: !!form.isFeatured,
        startDate: form.startDate || undefined
      };
      if (form.categoryId) payload.categoryId = form.categoryId;
      if (form.difficultyLevelId) payload.difficultyLevelId = form.difficultyLevelId;
      if (isEdit) await adminAPI.updateCourse(form.id!, payload);
      else await adminAPI.createCourse(payload);
      setForm(emptyForm);
      await load();
      push({ type: 'success', message: isEdit ? 'Курс обновлён' : 'Курс создан' });
  } catch (e: any) { const msg = extractErrorMessage(e, 'Ошибка сохранения'); setError(msg); push({ type: 'error', message: msg }); }
  };

  const startEdit = (c: UICourse) => setForm({
    id: c.id,
    title: c.title || '',
    slug: (c as any).slug || '',
    description: c.description || '',
    categoryId: c.categoryId || '',
    difficultyLevelId: c.difficultyLevelId || '',
    price: (c as any).price ?? '',
    currency: (c as any).currency || 'UAH',
    duration: (c as any).duration ?? '',
    is_active: (c as any).is_active ?? true,
    isFeatured: (c as any).isFeatured ?? false,
    startDate: (c as any).startDate || ''
  });

  const remove = async (c: UICourse) => {
    const ok = await confirm({ title: 'Удаление', message: `Удалить курс «${c.title}»?`, danger: true, confirmText: 'Удалить' });
    if (!ok) return;
  try { await adminAPI.deleteCourse(c.id); await load(); push({ type: 'success', message: 'Курс удалён' }); } catch (e: any) { const msg = extractErrorMessage(e, 'Ошибка удаления'); setError(msg); push({ type: 'error', message: msg }); }
  };

  const publish = async (c: UICourse) => {
    const ok = await confirm({ title: c.isPublished ? 'Снять с публикации' : 'Публикация курса', message: `${c.isPublished ? 'Снять курс' : 'Опубликовать курс'} «${c.title}»?`, confirmText: c.isPublished ? 'Снять' : 'Опубликовать' });
    if (!ok) return;
  try { await adminAPI.publishCourse(c.id); await load(); push({ type: 'success', message: c.isPublished ? 'Курс снят с публикации' : 'Курс опубликован' }); } catch (e: any) { const msg = extractErrorMessage(e, 'Ошибка публикации'); setError(msg); push({ type: 'error', message: msg }); }
  };

  const duplicate = async (c: UICourse) => {
    const ok = await confirm({ title: 'Дублировать курс', message: `Создать копию курса «${c.title}»?`, confirmText: 'Дублировать' });
    if (!ok) return;
  try { await adminAPI.duplicateCourse(c.id); await load(); push({ type: 'success', message: 'Курс продублирован' }); } catch (e: any) { const msg = extractErrorMessage(e, 'Ошибка дублирования'); setError(msg); push({ type: 'error', message: msg }); }
  };

  const openEnroll = (c: UICourse) => {
    setActionValue('');
    setActionModal({ type: 'enroll', courseId: c.id });
  };

  const openSubjects = async (c: UICourse) => {
    setSubjectsFor(c.id);
    setCourseSubjects([]);
    setSubjectLoading(true);
    try {
  const data = await adminAPI.getCourseSubjects(c.id);
  // Assuming backend returns { course: { ... } } or list directly of courseSubjects mapping; adapt to spec structure
  const list = Array.isArray(data) ? data : (data?.subjects || []);
  setCourseSubjects(list);
  } catch (e: any) { const msg = extractErrorMessage(e, 'Ошибка загрузки предметов'); setError(msg); push({ type: 'error', message: msg }); } finally { setSubjectLoading(false); }
  };

  const openAddSubject = () => {
    if (!subjectsFor) return;
    setActionValue('');
    setActionModal({ type: 'add-subject', courseId: subjectsFor });
  };

  const openSetSubjectTeacher = (subjectId: string) => {
    if (!subjectsFor) return;
    setActionValue('');
    setActionModal({ type: 'subject-teacher', courseId: subjectsFor, subjectId });
  };

  const openSetSubjectStart = (subjectId: string) => {
    if (!subjectsFor) return;
    setActionValue('');
    setActionModal({ type: 'subject-start', courseId: subjectsFor, subjectId });
  };

  const deleteSubject = async (subjectId: string) => {
    if (!subjectsFor) return;
    const ok = await confirm({ title: 'Удалить предмет', message: 'Удалить предмет?', danger: true, confirmText: 'Удалить' });
    if (!ok) return;
  try { await adminAPI.deleteCourseSubject(subjectsFor, subjectId); await openSubjects({ id: subjectsFor, title: '' }); push({ type: 'success', message: 'Предмет удалён' }); } catch (e: any) { const msg = extractErrorMessage(e, 'Ошибка удаления предмета'); setError(msg); push({ type: 'error', message: msg }); }
  };

  const updateStartDate = async (c: UICourse) => {
    if (!startDateInput) return;
    const ok = await confirm({ title: 'Дата старта курса', message: `Установить дату старта ${startDateInput}?`, confirmText: 'Сохранить' });
    if (!ok) return;
  try { await adminAPI.updateCourseStartDate(c.id, startDateInput); setStartDateInput(''); push({ type: 'success', message: 'Дата старта обновлена' }); } catch (e: any) { const msg = extractErrorMessage(e, 'Ошибка обновления даты'); setError(msg); push({ type: 'error', message: msg }); }
  };

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionModal) return;
    const { type, courseId, subjectId } = actionModal;
    try {
      if (type === 'enroll') {
        if (!actionValue.trim()) return;
        const ok = await confirm({ title: 'Адм. запись', message: `Записать пользователя ${actionValue} на курс?`, confirmText: 'Записать' });
        if (!ok) return;
        await adminAPI.adminEnroll(courseId, actionValue.trim());
        push({ type: 'success', message: 'Пользователь записан' });
      } else if (type === 'add-subject') {
        if (!actionValue) return; // actionValue = subjectId
        const ok = await confirm({ title: 'Добавить предмет', message: `Привязать выбранный предмет к курсу?`, confirmText: 'Добавить' });
        if (!ok) return;
        await adminAPI.addCourseSubject(courseId, { subjectId: actionValue });
        push({ type: 'success', message: 'Предмет привязан' });
        await openSubjects({ id: courseId, title: '' });
      } else if (type === 'subject-teacher') {
        if (!actionValue.trim() || !subjectId) return;
        await adminAPI.assignSubjectTeacher(courseId, subjectId, actionValue.trim());
        push({ type: 'success', message: 'Преподаватель назначен' });
        await openSubjects({ id: courseId, title: '' });
      } else if (type === 'subject-start') {
        if (!actionValue.trim() || !subjectId) return;
        await adminAPI.setSubjectStartDate(courseId, subjectId, actionValue.trim());
        push({ type: 'success', message: 'Дата старта предмета сохранена' });
        await openSubjects({ id: courseId, title: '' });
      }
      setActionModal(null);
      setActionValue('');
    } catch (e: any) {
      const msg = extractErrorMessage(e, 'Ошибка операции');
      setError(msg);
      push({ type: 'error', message: msg });
    }
  };

  return (
    <div className="space-y-6">
      {ConfirmModal}
      <h3 className="text-xl font-semibold">Курси</h3>
      <form onSubmit={submit} className="bg-gray-800 p-4 rounded grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Назва" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none col-span-2" />
        <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="Slug" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none">
          <option value="">Категорія</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={form.difficultyLevelId} onChange={e => setForm(f => ({ ...f, difficultyLevelId: e.target.value }))} className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none">
          <option value="">Рівень</option>
          {difficulties.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <input type="number" min={0} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="Цена" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <input value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} placeholder="Валюта" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <input type="number" min={1} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="Длительность" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-1 cursor-pointer select-none">
            <input type="checkbox" checked={!!form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
            <span>Активен</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer select-none">
            <input type="checkbox" checked={!!form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} />
            <span>Featured</span>
          </label>
        </div>
        <input type="datetime-local" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none" />
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Опис" className="bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none col-span-3" rows={2} />
        <button type="submit" className="px-4 py-2 bg-cabinet-blue hover:bg-blue-600 rounded text-sm text-white flex items-center gap-2 col-span-3"><Plus size={16} /> {form.id ? 'Зберегти' : 'Додати'}</button>
      </form>
  {error && <div className="text-red-400 text-sm whitespace-pre-line">{error}</div>}
      {loading ? <div className="text-gray-400 text-sm">Завантаження...</div> : (
        <div className="space-y-2">
    {courses.map(c => (
            <div key={c.id} className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded">
              <div className="pr-4 flex-1">
                <p className="text-white text-sm font-medium flex items-center gap-2">{c.title} {c.isFeatured && <span className="text-[10px] uppercase bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">Featured</span>}</p>
                <p className="text-gray-400 text-xs space-x-2">
      {c.categoryId && <span>Категорія: {categories.find(cat => cat.id === c.categoryId)?.name || c.categoryId}</span>}
      {c.difficultyLevelId && <span>Рівень: {difficulties.find(d => d.id === c.difficultyLevelId)?.name || c.difficultyLevelId}</span>}
                </p>
                {c.description && <p className="text-gray-500 text-xs mt-1 line-clamp-2">{c.description}</p>}
              </div>
              <div className="flex gap-2">
                {canManage && (
                  <>
                    <button onClick={() => startEdit(c)} className="p-2 text-blue-400 hover:text-blue-300" title="Редагувати"><Edit2 size={16} /></button>
                    <button onClick={() => publish(c)} className="p-2 text-purple-400 hover:text-purple-300" title={c.isPublished ? 'Зняти з публікації' : 'Опубліковати'}><Rocket size={16}/></button>
                    <button onClick={() => duplicate(c)} className="p-2 text-yellow-400 hover:text-yellow-300" title="Дублювати"><Copy size={16}/></button>
                    <button onClick={() => openEnroll(c)} className="p-2 text-green-400 hover:text-green-300" title="Адм. запис"><UserPlus size={16}/></button>
                    <button onClick={() => openSubjects(c)} className="p-2 text-indigo-400 hover:text-indigo-300" title="Предмети"><List size={16}/></button>
                    <div className="flex items-center gap-1">
                      <input type="datetime-local" value={startDateInput} onChange={e => setStartDateInput(e.target.value)} className="bg-gray-700 text-xs px-1 py-1 rounded" />
                      <button onClick={() => updateStartDate(c)} className="p-2 text-cyan-400 hover:text-cyan-300" title="Встановити дату"><Calendar size={16}/></button>
                    </div>
                    <button onClick={() => remove(c)} className="p-2 text-red-400 hover:text-red-300" title="Видалити"><Trash2 size={16} /></button>
                  </>
                )}
              </div>
            </div>
          ))}
          {courses.length === 0 && <p className="text-gray-500 text-sm">Немає курсів</p>}
          {courses.length > 0 && (
            <Pagination page={page} totalPages={totalPages} onChange={setPage} className="pt-2" />
          )}
        </div>
      )}
      {subjectsFor && (
        <div className="mt-8 bg-gray-900 p-4 rounded">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold">Предмети курсу</h4>
            <div className="flex gap-2">
              <button onClick={openAddSubject} className="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600">Додати</button>
              <button onClick={() => { setSubjectsFor(null); setCourseSubjects([]); }} className="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600">Закрити</button>
            </div>
          </div>
          {subjectLoading ? <p className="text-gray-400 text-sm">Завантаження...</p> : (
            <div className="space-y-2">
              {courseSubjects.map(s => (
                <div key={s.id} className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded">
                  <div className="text-sm text-white flex-1">
                    <p className="font-medium">{s.name}</p>
                    <p className="text-gray-400 text-xs">{s.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openSetSubjectTeacher(s.id)} className="p-1 text-blue-400 hover:text-blue-300 text-xs" title="Призначити викладача">T</button>
                    <button onClick={() => openSetSubjectStart(s.id)} className="p-1 text-cyan-400 hover:text-cyan-300 text-xs" title="Дата старту">D</button>
                    <button onClick={() => deleteSubject(s.id)} className="p-1 text-red-400 hover:text-red-300 text-xs" title="Видалити">X</button>
                  </div>
                </div>
              ))}
              {courseSubjects.length === 0 && <p className="text-gray-500 text-sm">Немає предметів</p>}
            </div>
          )}
        </div>
      )}
      {actionModal && (
        <Modal
          isOpen={!!actionModal}
          onClose={() => { setActionModal(null); setActionValue(''); }}
          title={
            actionModal.type === 'enroll' ? 'Адміністративний запис' :
            actionModal.type === 'add-subject' ? 'Додати предмет' :
            actionModal.type === 'subject-teacher' ? 'Призначити викладача' :
            'Дата старту предмета'
          }
          size="sm"
          footer={
            <>
              <button
                onClick={() => { setActionModal(null); setActionValue(''); }}
                className="px-3 py-1.5 text-sm bg-gray-700 rounded hover:bg-gray-600"
              >Скасувати</button>
              <button
                onClick={(e) => { (handleActionSubmit as any)(e); }}
                className="px-3 py-1.5 text-sm bg-cabinet-blue rounded hover:bg-blue-600"
              >Зберегти</button>
            </>
          }
        >
          <form onSubmit={handleActionSubmit} className="space-y-3">
            {actionModal.type === 'enroll' && (
              <div className="space-y-1">
                <label className="text-xs text-gray-400">ID користувача</label>
                <input
                  autoFocus
                  value={actionValue}
                  onChange={e => setActionValue(e.target.value)}
                  className="w-full bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none"
                  placeholder="userId"
                />
              </div>
            )}
            {actionModal.type === 'add-subject' && (
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Виберіть предмет</label>
                <select
                  autoFocus
                  value={actionValue}
                  onChange={e => setActionValue(e.target.value)}
                  className="w-full bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">-- вибрати --</option>
                  {allSubjects.map((s: GlobalSubject) => (
                    <option key={s.id} value={s.id}>{s.name || s.title}</option>
                  ))}
                </select>
              </div>
            )}
            {actionModal.type === 'subject-teacher' && (
              <div className="space-y-1">
                <label className="text-xs text-gray-400">ID викладача</label>
                <input
                  autoFocus
                  value={actionValue}
                  onChange={e => setActionValue(e.target.value)}
                  className="w-full bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none"
                  placeholder="teacherId"
                />
              </div>
            )}
            {actionModal.type === 'subject-start' && (
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Дата старту</label>
                <input
                  type="datetime-local"
                  autoFocus
                  value={actionValue}
                  onChange={e => setActionValue(e.target.value)}
                  className="w-full bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none"
                />
              </div>
            )}
            <button type="submit" className="hidden" />
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CoursesManager;
