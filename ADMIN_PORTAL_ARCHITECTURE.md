# Архитектурное описание и план развития кабинетов (Admin / Owner / Teacher)

## 1. Текущее состояние проекта

Технологии:
- React 23.10.0 + TypeScript
- Vite (build & dev)
- TailwindCSS (utility стили) + собственные CSS модули
- Локальное состояние авторизации через Context (`AuthContext`)
- Навигация: `react-router-dom` v6
- Анимации: framer-motion + собственные transition компоненты

Основные домены UI:
- Публичные страницы (курсы / pricing / стартовая / демо-страницы)
- Пользовательский кабинет (`/cabinet/*`) — одиночный адаптивный контейнер `CabinetResponsive`
- Модули оплаты (PaymentPage / PaymentSuccess)
- Google OAuth callback (`/auth/google/success`)
- Административные панели: `AdminPanel` (`/admin`), `OwnerPanel` (`/owner`)

Авторизация и пользователи:
- `AuthContext` хранит: `user`, `token`, `isAuthenticated`, `isLoading`
- Пользовательские роли: массив строк (`roles: string[]`) в объекте пользователя (типы в `src/types/auth.ts`)
- В `ProtectedRoute` пока НЕ реализована реальная проверка ролей (параметр `requiredRoles` не используется)
- Токен и данные пользователя лежат в `localStorage`
- Валидация токена: простая проверка exp через base64 decode

## 2. Наблюдаемые проблемы / пробелы
- Нет централизованной модели ролей (дублирование логики отображения в панелях)
- `ProtectedRoute` не учитывает роли (риск доступа неавторизованных по ролям)
- Админские API клиенты (`adminAPI`, `ownerAPI`) не типизированы общими интерфейсами
- Панели (`AdminPanel.tsx`, `OwnerPanel.tsx`) монолитны, отсутствует декомпозиция на переиспользуемые блоки (таблицы, виджеты, графики)
- Нет слоя сервисов/репозиториев для отделения fetch логики от UI
- Нет общего layout-а для админского домена / будущего teacher dashboard
- Нет механизма динамической конфигурации доступа (feature flags / capability map)

## 3. Целевые роли и их зоны ответственности
| Роль | Основные задачи | Доступ к данным | Примеры действий |
|------|-----------------|-----------------|------------------|
| User | Обучение, подписка | Свои курсы, профиль | Просмотр, оплата |
| Teacher (преподаватель) | Управление курсами и контентом | Свои курсы, материалы студентов | Публикация модуля, проверка заданий |
| Admin | Операционное администрирование | Пользователи, курсы, подписки (агрегировано) | Блокировка пользователя, пересчёт статистики |
| Owner | Стратегия и финансы | Полные метрики + управление ролями | Назначение ролей, просмотр финансов |

## 4. План эволюции архитектуры
### 4.1 Ближайшие шаги (этап 1)
1. Добавить проверку ролей в `ProtectedRoute` (используя `requiredRoles`)
2. Вынести роль пользователя в enum + нормализовать типы (`Role = 'user' | 'teacher' | 'admin' | 'owner'`)
3. Создать модуль `src/roles/permissions.ts` с матрицей возможностей
4. Ввести API слой: `src/services/api/*.ts`
5. Декомпозировать `AdminPanel` на компоненты: `StatsGrid`, `UsersTable`, `CoursesTable`, `SystemOps`
6. Аналогично декомпозировать `OwnerPanel` (финансы / аналитика / роли / система)

### 4.2 Этап 2 (Teacher Dashboard + расширение)
1. Добавить маршрут `/teacher` + панель преподавателя
2. Выделить общий каркас `AdminLayout` (sidebar + content area) для reuse
3. Ввести ленивую загрузку: динамические `React.lazy` для панелей
4. Ввести глобальный кэш данных (react-query или простая in-memory map)
5. Вынести форматирование (валюта, проценты, даты) в `utils/format.ts`

### 4.3 Этап 3 (Расширяемость и безопасность)
1. Перейти на refresh токены + silent renew
2. WebSocket канал/SignalR (чат/реалтайм метрики)
3. Аудит действий (логирование в UI + backend)
4. Feature flags (возможности включаются конфигурацией)
5. Добавить тесты: unit для permissions + smoke для ProtectedRoute

## 5. Предлагаемая структура директорий (обновлённая)
```
src/
  api/
    admin.ts
    owner.ts
    teacher.ts
    httpClient.ts
  auth/
    AuthContext.tsx (перенести из contexts)
    ProtectedRoute.tsx
    roles.ts
    permissions.ts
  components/
    admin/
      AdminPanel/
        index.tsx
        StatsGrid.tsx
        UsersTable.tsx
        CoursesTable.tsx
        SystemOperations.tsx
      OwnerPanel/
        index.tsx
        FinancialOverview.tsx
        GrowthAnalytics.tsx
        RoleManagement.tsx
        SystemHealth.tsx
      TeacherPanel/
        index.tsx
        CourseEditor.tsx
        ReviewQueue.tsx
  layouts/
    AdminLayout.tsx
  utils/
    format.ts
    dates.ts
```

## 6. Роли и права (черновик матрицы)
```ts
export type Role = 'user' | 'teacher' | 'admin' | 'owner';

export const Permissions = {
  VIEW_USERS: 'view_users',
  EDIT_USERS: 'edit_users',
  MANAGE_ROLES: 'manage_roles',
  VIEW_FINANCE: 'view_finance',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_COURSES: 'manage_courses',
  SYSTEM_OPERATIONS: 'system_operations'
} as const;

type Permission = typeof Permissions[keyof typeof Permissions];

export const rolePermissions: Record<Role, Permission[]> = {
  user: [],
  teacher: [Permissions.MANAGE_COURSES],
  admin: [
    Permissions.VIEW_USERS,
    Permissions.EDIT_USERS,
    Permissions.MANAGE_COURSES,
    Permissions.SYSTEM_OPERATIONS,
    Permissions.VIEW_ANALYTICS
  ],
  owner: [
    Permissions.VIEW_USERS,
    Permissions.EDIT_USERS,
    Permissions.MANAGE_ROLES,
    Permissions.MANAGE_COURSES,
    Permissions.SYSTEM_OPERATIONS,
    Permissions.VIEW_FINANCE,
    Permissions.VIEW_ANALYTICS
  ]
};
```

## 7. Модификация ProtectedRoute (план)
```tsx
interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRoles?: Role[];
}

if (requiredRoles && requiredRoles.length > 0) {
  const hasRole = user?.roles?.some(r => requiredRoles.includes(r as Role));
  if (!hasRole) return <Navigate to="/cabinet" replace />;
}
```

## 8. API слой (пример)
```ts
// api/httpClient.ts
export const http = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const token = localStorage.getItem('auth_token');
  const headers = { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};
```

## 9. План внедрения (итерации)
Итерация 1 (быстро):
- Реализовать roles.ts + обновить ProtectedRoute
- Ввести файл permissions.ts (rolePermissions)
- Мини-рефакторинг AdminPanel: вынести UsersTable

Итерация 2:
- Вынести общий AdminLayout
- Декомпозировать OwnerPanel
- Добавить TeacherPanel (скелет)

Итерация 3:
- Добавить react-query (или аналог) для кэширования
- Ленивая загрузка панелей
- Тесты + утилиты форматирования

Итерация 4:
- Улучшенный auth (refresh tokens)
- WebSocket для лайв-метрик
- Аудит логов (UI компонент + API)

## 10. Риски и рекомендации
- Риск рассинхронизации ролей клиента и сервера → следует получать разрешения от backend (в идеале)
- Без разграничения по действиям (permissions) сложно масштабировать — внедряем на раннем этапе
- Монолитные панели затрудняют performance оптимизации → декомпозиция обязательна
- Дублирование форматирования (валюта/проценты) → вынести в utils

## 11. Что дальше (actionable)
1. Создать `src/auth/roles.ts` и `src/auth/permissions.ts`
2. Обновить `ProtectedRoute` для реальной проверки ролей
3. Добавить файл `utils/format.ts`
4. Вынести таблицу пользователей из AdminPanel
5. Создать каркас TeacherPanel (route + компонент)

---
Документ предназначен как опорная архитектурная база для реализации кабинетов администратора, владельца и преподавателя.
