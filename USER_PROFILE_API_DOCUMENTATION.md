# API Документация Профиля Пользователя

## Базовая информация

### URLs для разных окружений:
- **Development (локально):** `http://localhost:8000/api`
- **Production:** `https://neuronest.pp.ua/api`

**Формат данных:** JSON  
**Кодировка:** UTF-8  
**Аутентификация:** Bearer Token (JWT)

---

## 👤 Эндпоинты профиля пользователя

### 1. Получение данных профиля

#### 1.1. Получение своего профиля (текущий пользователь)

**GET** `/users/me`

**Описание:** Возвращает полный профиль текущего авторизованного пользователя со всеми доступными данными для отображения.

**Заголовки:**
```
Authorization: Bearer {access_token}
```

**Роли:** `user`, `admin`, `teacher`

**Успешный ответ (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "zazplay3881@gmail.com",
  "name": "Виктор",
  "second_name": "Не вказано",
  "age": null,
  "telefon_number": null,
  "isEmailVerified": true,
  "isBlocked": false,
  "hasAvatar": true,
  "avatarUrl": "/avatars/507f1f77bcf86cd799439011",
  "roles": ["user"],
  "registrationDate": "23.08.2025",
  "authProvider": "local",
  "isGoogleUser": false,
  "progressStats": {
    "totalCourses": 4,
    "completedCourses": 1,
    "inProgressCourses": 3,
    "overallProgress": 68
  },
  "activeCourses": [
    {
      "id": "507f1f77bcf86cd799439020",
      "title": "Відмінність",
      "progress": 95,
      "status": "В процессі",
      "lastAccessed": "2025-08-23T10:30:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439021",
      "title": "Інструменти",
      "progress": 70,
      "status": "В процессі",
      "lastAccessed": "2025-08-22T15:45:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439022",
      "title": "Баз принципи",
      "progress": 50,
      "status": "В процессі",
      "lastAccessed": "2025-08-21T12:20:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439023",
      "title": "Будова слова",
      "progress": 5,
      "status": "В процессі",
      "lastAccessed": "2025-08-20T09:15:00.000Z"
    }
  ],
  "completedCourses": [
    {
      "id": "507f1f77bcf86cd799439024",
      "title": "Каліграфія",
      "progress": 100,
      "status": "Пройдено",
      "completedAt": "2025-08-15T14:30:00.000Z"
    }
  ],
  "contacts": {
    "manager": {
      "phone": "+380 12 345 67 89",
      "name": "Менеджер"
    },
    "curator": {
      "phone": "+380 98 765 43 21",
      "name": "Куратор"
    },
    "discordGroup": "https://discord.gg/example",
    "telegramGroup": "https://t.me/example"
  }
}
```

**Возможные ошибки:**
- `401` - Не авторизован
- `404` - Пользователь не найден

---

#### 1.2. Получение статистики прогресса пользователя

**GET** `/users/me/progress`

**Описание:** Возвращает детальную статистику прогресса обучения пользователя.

**Заголовки:**
```
Authorization: Bearer {access_token}
```

**Роли:** `user`, `admin`, `teacher`

**Успешный ответ (200):**
```json
{
  "overallStats": {
    "totalCourses": 5,
    "completedCourses": 1,
    "inProgressCourses": 4,
    "averageProgress": 68,
    "totalLessons": 125,
    "completedLessons": 85,
    "totalStudyTime": "45h 30m",
    "streakDays": 12
  },
  "courseProgress": [
    {
      "courseId": "507f1f77bcf86cd799439020",
      "courseName": "Відмінність",
      "progress": 95,
      "totalLessons": 20,
      "completedLessons": 19,
      "timeSpent": "8h 45m",
      "lastAccessed": "2025-08-23T10:30:00.000Z",
      "status": "В процессі"
    },
    {
      "courseId": "507f1f77bcf86cd799439021",
      "courseName": "Інструменти",
      "progress": 70,
      "totalLessons": 25,
      "completedLessons": 17,
      "timeSpent": "12h 15m",
      "lastAccessed": "2025-08-22T15:45:00.000Z",
      "status": "В процессі"
    }
  ],
  "achievements": [
    {
      "id": "first_course_completed",
      "title": "Первый курс завершен",
      "description": "Поздравляем с завершением первого курса!",
      "earnedAt": "2025-08-15T14:30:00.000Z",
      "icon": "🏆"
    }
  ],
  "weeklyProgress": [
    { "day": "Mon", "lessonsCompleted": 3, "timeSpent": "2h 30m" },
    { "day": "Tue", "lessonsCompleted": 2, "timeSpent": "1h 45m" },
    { "day": "Wed", "lessonsCompleted": 4, "timeSpent": "3h 20m" },
    { "day": "Thu", "lessonsCompleted": 1, "timeSpent": "1h 10m" },
    { "day": "Fri", "lessonsCompleted": 3, "timeSpent": "2h 15m" },
    { "day": "Sat", "lessonsCompleted": 0, "timeSpent": "0h 0m" },
    { "day": "Sun", "lessonsCompleted": 2, "timeSpent": "1h 30m" }
  ]
}
```

**Возможные ошибки:**
- `401` - Не авторизован

---

#### 1.3. Получение активных подписок пользователя

**GET** `/subscriptions/me`

**Описание:** Возвращает список активных подписок текущего пользователя.

**Заголовки:**
```
Authorization: Bearer {access_token}
```

**Роли:** `user`, `admin`, `teacher`

**Успешный ответ (200):**
```json
{
  "subscriptions": [
    {
      "id": "507f1f77bcf86cd799439030",
      "courseId": "507f1f77bcf86cd799439020",
      "courseName": "Відмінність",
      "subscriptionType": "course",
      "status": "active",
      "startDate": "2025-08-01T00:00:00.000Z",
      "endDate": "2025-12-01T00:00:00.000Z",
      "progress": 95,
      "daysRemaining": 100,
      "isPaid": true,
      "autoRenewal": false
    },
    {
      "id": "507f1f77bcf86cd799439031",
      "courseId": "507f1f77bcf86cd799439021",
      "courseName": "Інструменти",
      "subscriptionType": "course",
      "status": "active",
      "startDate": "2025-07-15T00:00:00.000Z",
      "endDate": "2025-11-15T00:00:00.000Z",
      "progress": 70,
      "daysRemaining": 84,
      "isPaid": true,
      "autoRenewal": true
    }
  ],
  "totalActiveSubscriptions": 4,
  "totalCompletedCourses": 1
}
```

**Возможные ошибки:**
- `401` - Не авторизован

---

### 2. Обновление профиля

#### 2.1. Обновление основной информации профиля

**PUT** `/users/me`

**Описание:** Обновляет основную информацию профиля текущего пользователя.

**Заголовки:**
```
Authorization: Bearer {access_token}
```

**Роли:** `user`, `admin`, `teacher`

**Тело запроса:**
```json
{
  "name": "Новое Имя",
  "second_name": "Новая Фамилия",
  "age": 26,
  "telefon_number": "+380 (67) 111-22-33"
}
```

**Все поля необязательны:**
- `name` (string, optional) - Имя пользователя
- `second_name` (string, optional) - Фамилия пользователя
- `age` (number, optional) - Возраст (0-150)
- `telefon_number` (string, optional) - Номер телефона

**Успешный ответ (200):**
```json
{
  "message": "Профиль успешно обновлен",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "zazplay3881@gmail.com",
    "name": "Новое Имя",
    "second_name": "Новая Фамилия",
    "age": 26,
    "telefon_number": "+380 (67) 111-22-33",
    "isEmailVerified": true,
    "roles": ["user"]
  }
}
```

**Возможные ошибки:**
- `400` - Некорректные данные
- `401` - Не авторизован

---

#### 2.2. Загрузка аватара

**POST** `/avatars/upload/me`

**Описание:** Загружает новый аватар для текущего пользователя.

**Заголовки:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Роли:** `user`, `admin`, `teacher`

**Тело запроса:**
```
FormData:
- avatar: File (jpg, jpeg, png, gif, webp, максимум 5MB)
```

**Успешный ответ (200):**
```json
{
  "message": "Аватар успешно загружен",
  "avatarUrl": "/avatars/507f1f77bcf86cd799439011",
  "avatarId": "507f1f77bcf86cd799439012"
}
```

**Возможные ошибки:**
- `400` - Некорректный файл или превышен размер
- `401` - Не авторизован

---

### 3. Управление курсами

#### 3.1. Получение курсов пользователя

**GET** `/courses/me`

**Описание:** Возвращает все курсы пользователя (активные и завершенные).

**Заголовки:**
```
Authorization: Bearer {access_token}
```

**Параметры запроса:**
- `status` (query, optional) - Фильтр по статусу: `active`, `completed`, `pending`
- `page` (query, optional) - Номер страницы (по умолчанию 1)
- `limit` (query, optional) - Количество элементов на странице (по умолчанию 10)

**Роли:** `user`, `admin`, `teacher`

**Успешный ответ (200):**
```json
{
  "courses": [
    {
      "id": "507f1f77bcf86cd799439020",
      "title": "Відмінність",
      "description": "Курс по изучению различий в украинском языке",
      "progress": 95,
      "status": "В процессі",
      "imageUrl": "/courses/images/difference.jpg",
      "teacher": {
        "id": "507f1f77bcf86cd799439040",
        "name": "Анна Петрова",
        "avatar": "/avatars/teacher1.jpg"
      },
      "category": "Українська мова",
      "difficulty": "Середній",
      "totalLessons": 20,
      "completedLessons": 19,
      "estimatedTime": "8 годин",
      "lastAccessed": "2025-08-23T10:30:00.000Z",
      "nextLesson": {
        "id": "507f1f77bcf86cd799439050",
        "title": "Остання лекція",
        "order": 20
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 5,
    "itemsPerPage": 10
  },
  "stats": {
    "totalCourses": 5,
    "activeCourses": 4,
    "completedCourses": 1,
    "averageProgress": 68
  }
}
```

**Возможные ошибки:**
- `401` - Не авторизован

---

### 4. Кошелек и платежи

#### 4.1. Получение информации о кошельке

**GET** `/payment/wallet/me`

**Описание:** Возвращает информацию о виртуальном кошельке пользователя.

**Заголовки:**
```
Authorization: Bearer {access_token}
```

**Роли:** `user`, `admin`, `teacher`

**Успешный ответ (200):**
```json
{
  "balance": 150.50,
  "currency": "UAH",
  "transactions": [
    {
      "id": "507f1f77bcf86cd799439060",
      "type": "payment",
      "amount": -99.00,
      "description": "Оплата курса 'Відмінність'",
      "date": "2025-08-01T10:30:00.000Z",
      "status": "completed"
    },
    {
      "id": "507f1f77bcf86cd799439061",
      "type": "refund",
      "amount": 50.00,
      "description": "Возврат за неиспользованные уроки",
      "date": "2025-07-25T14:20:00.000Z",
      "status": "completed"
    }
  ],
  "cards": [
    {
      "id": "507f1f77bcf86cd799439070",
      "lastFour": "1234",
      "brand": "Visa",
      "isDefault": true,
      "expiryMonth": 12,
      "expiryYear": 2027
    }
  ]
}
```

**Возможные ошибки:**
- `401` - Не авторизован

---

### 5. Настройки и уведомления

#### 5.1. Получение настроек профиля

**GET** `/users/me/settings`

**Описание:** Возвращает настройки пользователя для профиля.

**Заголовки:**
```
Authorization: Bearer {access_token}
```

**Роли:** `user`, `admin`, `teacher`

**Успешный ответ (200):**
```json
{
  "notifications": {
    "email": true,
    "push": false,
    "courseReminders": true,
    "achievementAlerts": true,
    "weeklyReports": true
  },
  "privacy": {
    "profileVisibility": "private",
    "showProgress": false,
    "allowMessages": true
  },
  "learning": {
    "dailyGoal": 2,
    "preferredStudyTime": "evening",
    "autoplay": true,
    "language": "uk"
  }
}
```

**Возможные ошибки:**
- `401` - Не авторизован

---

#### 5.2. Обновление настроек профиля

**PUT** `/users/me/settings`

**Описание:** Обновляет настройки пользователя.

**Заголовки:**
```
Authorization: Bearer {access_token}
```

**Роли:** `user`, `admin`, `teacher`

**Тело запроса:**
```json
{
  "notifications": {
    "email": false,
    "courseReminders": false
  },
  "learning": {
    "dailyGoal": 3
  }
}
```

**Успешный ответ (200):**
```json
{
  "message": "Настройки успешно обновлены",
  "settings": {
    "notifications": {
      "email": false,
      "push": false,
      "courseReminders": false,
      "achievementAlerts": true,
      "weeklyReports": true
    },
    "learning": {
      "dailyGoal": 3,
      "preferredStudyTime": "evening",
      "autoplay": true,
      "language": "uk"
    }
  }
}
```

**Возможные ошибки:**
- `400` - Некорректные данные
- `401` - Не авторизован

---

## 🔧 Структуры данных для профиля

### User Profile Object (полный профиль)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "zazplay3881@gmail.com",
  "name": "Виктор",
  "second_name": "Не вказано",
  "age": null,
  "telefon_number": null,
  "isEmailVerified": true,
  "isBlocked": false,
  "hasAvatar": true,
  "avatarUrl": "/avatars/507f1f77bcf86cd799439011",
  "roles": ["user"],
  "registrationDate": "23.08.2025",
  "authProvider": "local",
  "isGoogleUser": false,
  "lastLoginDate": "2025-08-23T10:30:00.000Z",
  "progressStats": {
    "totalCourses": 5,
    "completedCourses": 1,
    "inProgressCourses": 4,
    "overallProgress": 68
  }
}
```

### Course Progress Object
```json
{
  "id": "507f1f77bcf86cd799439020",
  "title": "Відмінність",
  "description": "Курс по изучению различий",
  "progress": 95,
  "status": "В процессі",
  "imageUrl": "/courses/images/difference.jpg",
  "totalLessons": 20,
  "completedLessons": 19,
  "estimatedTime": "8 годин",
  "lastAccessed": "2025-08-23T10:30:00.000Z",
  "teacher": {
    "name": "Анна Петрова",
    "avatar": "/avatars/teacher1.jpg"
  },
  "nextLesson": {
    "id": "507f1f77bcf86cd799439050",
    "title": "Остання лекція",
    "order": 20
  }
}
```

### Subscription Object
```json
{
  "id": "507f1f77bcf86cd799439030",
  "courseId": "507f1f77bcf86cd799439020",
  "courseName": "Відмінність",
  "subscriptionType": "course",
  "status": "active",
  "startDate": "2025-08-01T00:00:00.000Z",
  "endDate": "2025-12-01T00:00:00.000Z",
  "progress": 95,
  "daysRemaining": 100,
  "isPaid": true,
  "autoRenewal": false
}
```

### Contacts Object
```json
{
  "manager": {
    "phone": "+380 12 345 67 89",
    "name": "Менеджер",
    "email": "manager@neuronest.pp.ua"
  },
  "curator": {
    "phone": "+380 98 765 43 21",
    "name": "Куратор",
    "email": "curator@neuronest.pp.ua"
  },
  "discordGroup": "https://discord.gg/example",
  "telegramGroup": "https://t.me/example"
}
```

---

## 🛡️ Безопасность и авторизация

### Права доступа по ролям

#### Роль `user`:
- Просмотр и редактирование своего профиля
- Просмотр своих курсов и прогресса
- Загрузка своего аватара
- Управление своими настройками

#### Роль `teacher`:
- Все права пользователя
- Дополнительная статистика по своим курсам

#### Роль `admin`:
- Все права пользователя
- Просмотр профилей других пользователей
- Редактирование данных других пользователей

### Использование Bearer Token

Для всех эндпоинтов профиля требуется JWT токен в заголовке:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📧 Интеграция с другими модулями

### Связь с модулем курсов
- Получение прогресса по курсам через `/subscriptions/me`
- Отображение активных и завершенных курсов

### Связь с модулем аватаров
- Загрузка и отображение аватаров пользователей
- Автоматическое обновление ссылок на аватары

### Связь с модулем платежей
- Отображение истории платежей
- Управление способами оплаты

### Связь с модулем уведомлений
- Настройки уведомлений по email и push
- Управление типами уведомлений

---

## 📋 Примеры использования

### Получение полного профиля пользователя

```javascript
const response = await fetch('http://localhost:8000/api/users/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  }
});

const userProfile = await response.json();
```

### Обновление профиля пользователя

```javascript
const response = await fetch('http://localhost:8000/api/users/me', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Новое Имя',
    telefon_number: '+380 (67) 111-22-33'
  })
});

const result = await response.json();
```

### Загрузка аватара

```javascript
const formData = new FormData();
formData.append('avatar', fileInput.files[0]);

const response = await fetch('http://localhost:8000/api/avatars/upload/me', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userToken}`
  },
  body: formData
});

const result = await response.json();
```

### Получение прогресса по курсам

```javascript
const response = await fetch('http://localhost:8000/api/users/me/progress', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  }
});

const progressData = await response.json();
```

---

## ⚠️ Важные замечания

### Для фронтенд разработчиков:

1. **JWT токен обязателен** - все эндпоинты профиля требуют авторизации
2. **Кеширование данных** - профиль можно кешировать, но проверяйте актуальность
3. **Загрузка файлов** - для аватаров используйте FormData
4. **Прогресс курсов** - обновляется в реальном времени при прохождении уроков
5. **Настройки** - сохраняются автоматически при изменении

### Обработка ошибок:

Все ошибки возвращаются в стандартном формате:
```json
{
  "statusCode": 401,
  "message": "Не авторизован",
  "error": "Unauthorized"
}
```

### Валидация данных:

- **Возраст:** От 0 до 150
- **Телефон:** В формате +380 (XX) XXX-XX-XX
- **Аватар:** JPG, JPEG, PNG, GIF, WEBP до 5MB
- **Имя/Фамилия:** До 50 символов

---

## 🧪 Тестирование

### Swagger UI доступен по адресу:
- **Development:** `http://localhost:8000/api/docs`
- **Production:** `https://neuronest.pp.ua/api/docs`

### Тестовые сценарии:

1. **Профиль пользователя:**
   - Получение своего профиля
   - Обновление личных данных
   - Загрузка аватара

2. **Прогресс обучения:**
   - Просмотр статистики курсов
   - Отслеживание прогресса
   - Получение достижений

3. **Управление настройками:**
   - Изменение уведомлений
   - Настройка приватности
   - Обновление предпочтений

---

## 🎯 Контрольный список для интеграции

- [ ] Реализован вывод полного профиля пользователя
- [ ] Настроено отображение прогресса по курсам
- [ ] Реализована загрузка и отображение аватаров
- [ ] Настроено обновление профиля пользователя
- [ ] Реализовано отображение активных подписок
- [ ] Настроена статистика прогресса обучения
- [ ] Реализованы контакты поддержки
- [ ] Настроено управление настройками профиля
- [ ] Реализована обработка ошибок профиля
- [ ] Настроена интеграция с модулем платежей

---

*Документация актуальна на 23 августа 2025 г.*
