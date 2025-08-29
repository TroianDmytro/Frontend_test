# API Документация Авторизации

## Базовая информация

### URLs для разных окружений:
- **Development (локально):** `http://localhost:8000/api/auth`
- **Production:** `https://neuronest.pp.ua/api/auth`

**Формат данных:** JSON  
**Кодировка:** UTF-8

---

## 🔐 Эндпоинты авторизации

### 1. Двухэтапная регистрация

#### 1.1. Отправка кода подтверждения на email

**POST** `/auth/register/send-code`

**Описание:** Первый шаг регистрации - пользователь указывает только email и получает 6-значный код подтверждения.

**Тело запроса:**
```json
{
  "email": "user@example.com"
}
```

**Успешный ответ (201):**
```json
{
  "success": true,
  "message": "Код подтверждения отправлен на ваш email. Проверьте почту.",
  "email": "user@example.com"
}
```

**Возможные ошибки:**
- `400` - Некорректный email
- `409` - Пользователь уже зарегистрирован

---

#### 1.2. Подтверждение кода и завершение регистрации

**POST** `/auth/register/verify-code`

**Описание:** Второй шаг регистрации - подтверждение кода и заполнение дополнительных данных. Система автоматически генерирует логин и пароль и отправляет их на email.

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "code": "123456",
  "name": "Иван",
  "second_name": "Иванов",
  "age": 25,
  "telefon_number": "+380 (67) 123-45-67"
}
```

**Успешный ответ (201):**
```json
{
  "success": true,
  "message": "Регистрация завершена! Логин и пароль отправлены на ваш email.",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "login": "userCool123",
    "name": "Иван",
    "second_name": "Иванов",
    "isEmailVerified": true
  }
}
```

**Возможные ошибки:**
- `400` - Неверный или просроченный код

---

#### 1.3. Повторная отправка кода

**POST** `/auth/resend-code`

**Описание:** Отправляет новый 6-значный код подтверждения на email.

**Тело запроса:**
```json
{
  "email": "user@example.com"
}
```

**Успешный ответ (200):**
```json
{
  "success": true,
  "message": "Новый код подтверждения отправлен. Пожалуйста, проверьте вашу почту"
}
```

**Возможные ошибки:**
- `404` - Пользователь не найден
- `409` - Email уже подтвержден

---

### 2. Авторизация

#### 2.1. Вход по логину и паролю

**POST** `/auth/login`

**Описание:** Авторизация пользователя с использованием логина и пароля, полученных на email при регистрации.

**Тело запроса:**
```json
{
  "login": "userCool123",
  "password": "Abc123!@"
}
```

**Успешный ответ (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "login": "userCool123",
    "name": "Иван",
    "second_name": "Иванов",
    "isEmailVerified": true,
    "roles": ["user"]
  }
}
```

**Возможные ошибки:**
- `401` - Неверные учетные данные
- `401` - Email не подтвержден
- `401` - Аккаунт заблокирован

---

### 3. Google OAuth Авторизация

#### 3.1. Начало Google OAuth

**GET** `/auth/google`

**Описание:** Инициирует процесс авторизации через Google. Перенаправляет пользователя на страницу авторизации Google.

**Параметры:** Нет

**Ответ:** Автоматическое перенаправление на Google OAuth

---

#### 3.2. Google OAuth Callback

**GET** `/auth/google/callback`

**Описание:** Обрабатывает ответ от Google после авторизации. В production перенаправляет на фронтенд с токеном.

**Параметры:** Автоматические от Google

**Успешный ответ (в production - редирект):**
```
Редирект на: {frontendUrl}/auth/google/success?token={jwt_token}&user={user_data}
```

---

#### 3.3. Связывание Google аккаунта

**POST** `/auth/google/link`

**Описание:** Связывает Google аккаунт с существующим авторизованным пользователем.

**Заголовки:**
```
Authorization: Bearer {access_token}
```

**Успешный ответ (200):**
```json
{
  "message": "Для связывания Google аккаунта перейдите по ссылке",
  "linkUrl": "/auth/google?link=507f1f77bcf86cd799439011"
}
```

---

#### 3.4. Отвязывание Google аккаунта

**POST** `/auth/google/unlink`

**Описание:** Отвязывает Google аккаунт от текущего пользователя.

**Заголовки:**
```
Authorization: Bearer {access_token}
```

**Успешный ответ (200):**
```json
{
  "success": true,
  "message": "Google аккаунт успешно отвязан"
}
```

**Возможные ошибки:**
- `400` - Нельзя отвязать Google аккаунт без пароля

---

#### 3.5. Статус Google авторизации

**GET** `/auth/google/status`

**Описание:** Возвращает информацию о связанном Google аккаунте.

**Заголовки:**
```
Authorization: Bearer {access_token}
```

**Успешный ответ (200):**
```json
{
  "isLinked": true,
  "googleId": "1234567890",
  "lastGoogleLogin": "2024-01-15T10:30:00.000Z",
  "hasValidToken": true
}
```

---

### 4. Восстановление пароля

#### 4.1. Запрос на восстановление пароля

**POST** `/auth/forgot-password`

**Описание:** Отправляет 6-значный код восстановления на email пользователя.

**Тело запроса:**
```json
{
  "email": "user@example.com"
}
```

**Успешный ответ (200):**
```json
{
  "success": true,
  "message": "Код восстановления пароля отправлен на вашу почту"
}
```

**Возможные ошибки:**
- `404` - Пользователь не найден

---

#### 4.2. Сброс пароля с кодом

**POST** `/auth/reset-password`

**Описание:** Устанавливает новый пароль с использованием кода из email.

**Тело запроса:**
```json
{
  "code": "123456",
  "newPassword": "newPassword123"
}
```

**Успешный ответ (200):**
```json
{
  "success": true,
  "message": "Пароль успешно изменен"
}
```

**Возможные ошибки:**
- `400` - Недействительный или просроченный код

---

### 5. Изменение пароля

#### 5.1. Изменение пароля авторизованным пользователем

**POST** `/auth/change-password`

**Описание:** Позволяет авторизованному пользователю изменить свой пароль.

**Заголовки:**
```
Authorization: Bearer {access_token}
```

**Тело запроса:**
```json
{
  "currentPassword": "currentPassword123",
  "newPassword": "newPassword123"
}
```

**Успешный ответ (200):**
```json
{
  "success": true,
  "message": "Пароль успешно изменен"
}
```

**Возможные ошибки:**
- `400` - Неверный текущий пароль

---

### 6. Тестовые эндпоинты

#### 6.1. Тестовая страница Google OAuth

**GET** `/auth/test`

**Описание:** HTML страница для тестирования Google OAuth интеграции.

**Ответ:** HTML страница с кнопкой авторизации

---

#### 6.2. Проверка конфигурации

**GET** `/auth/test/config`

**Описание:** Возвращает текущую конфигурацию для отладки (без секретов).

**Успешный ответ (200):**
```json
{
  "environment": "development",
  "googleConfig": {
    "clientId": "254445727557-kq6503r77n1427cpv57notcnhaqkjkni.apps.googleusercontent.com",
    "callbackUrl": "https://neuronest.pp.ua/api/auth/google/callback",
    "hasClientSecret": true
  },
  "appConfig": {
    "appUrl": "https://neuronest.pp.ua",
    "frontendUrl": "https://neuronest.pp.ua",
    "allowedOrigins": ["*"]
  }
}
```

---

### 7. Старый эндпоинт (обратная совместимость)

#### 7.1. Подтверждение email по токену

**GET** `/auth/verify-email?token={verification_token}`

**Описание:** Устаревший метод подтверждения email по токену из ссылки.

**Параметры:**
- `token` (query) - Токен верификации

**Ответ:** HTML страница с результатом

---

## 🔧 Структуры данных

### JWT Token Payload
```json
{
  "email": "user@example.com",
  "login": "userCool123",
  "sub": "507f1f77bcf86cd799439011",
  "roles": ["user"],
  "provider": "local", // или "google"
  "googleId": "1234567890", // только для Google пользователей
  "iat": 1673945400,
  "exp": 1674031800
}
```

### User Object
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "login": "userCool123",
  "name": "Иван",
  "second_name": "Иванов",
  "isEmailVerified": true,
  "roles": ["user"],
  "provider": "local", // "local" или "google"
  "avatar_url": "https://...", // только для Google пользователей
  "is_google_user": false
}
```

---

## � Настройка для локальной разработки

### Базовые URL для разработки:
- **API:** `http://localhost:8000/api`
- **Swagger UI:** `http://localhost:8000/api/docs`
- **Тестовая страница:** `http://localhost:8000/api/auth/test`

### Переменные окружения (.env):
```env
# Основные настройки
NODE_ENV=development
PORT=8000
HOST=0.0.0.0

# URL приложения
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Google OAuth (для локальной разработки)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

# База данных
MONGODB_URI=your_mongodb_connection_string

# Email настройки
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### CORS настройки:
API настроен на прием запросов со всех доменов, включая `localhost:3000` для фронтенда.

---

## �🛡️ Безопасность и авторизация

### Использование Bearer Token

Для защищенных эндпоинтов используйте JWT токен в заголовке:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Публичные эндпоинты (не требуют авторизации)

- `POST /auth/register/send-code`
- `POST /auth/register/verify-code`
- `POST /auth/login`
- `GET /auth/google`
- `GET /auth/google/callback`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/resend-code`
- `GET /auth/verify-email`
- `GET /auth/test`
- `GET /auth/test/config`

### Защищенные эндпоинты (требуют Bearer token)

- `POST /auth/change-password`
- `POST /auth/google/link`
- `POST /auth/google/unlink`
- `GET /auth/google/status`

---

## 📧 Email уведомления

### Типы email уведомлений:

1. **Код подтверждения регистрации** - 6-значный код
2. **Логин и пароль** - отправляются после успешной регистрации
3. **Код восстановления пароля** - 6-значный код
4. **Уведомление об изменении пароля** - информационное письмо

---

## 🔄 Процесс регистрации (схема)

```
1. POST /auth/register/send-code
   ↓ (email отправлен)
   
2. POST /auth/register/verify-code
   ↓ (пользователь создан, логин/пароль отправлены на email)
   
3. POST /auth/login
   ↓ (получен access_token)
   
4. Использование API с Bearer token
```

---

## 🔄 Процесс Google OAuth (схема)

```
1. GET /auth/google
   ↓ (редирект на Google)
   
2. Пользователь авторизуется в Google
   ↓ (Google redirect на callback)
   
3. GET /auth/google/callback
   ↓ (пользователь создан/найден, генерирован JWT)
   
4. Редирект на фронтенд с токеном (production)
   ИЛИ
   HTML страница с токеном (development)
```

---

## 🔄 Процесс восстановления пароля (схема)

```
1. POST /auth/forgot-password
   ↓ (код отправлен на email)
   
2. POST /auth/reset-password
   ↓ (пароль изменен)
   
3. POST /auth/login
   ↓ (вход с новым паролем)
```

---

## ⚠️ Важные замечания

### Для фронтенд разработчиков:

1. **Логин генерируется автоматически** - пользователи не выбирают логин самостоятельно
2. **Пароль генерируется автоматически** - отправляется на email после регистрации
3. **Google OAuth в development** - показывает HTML страницу с токеном
4. **Google OAuth в production** - делает редирект на фронтенд с параметрами
5. **Коды подтверждения действуют ограниченное время** - обычно 10-15 минут
6. **JWT токены содержат роли пользователя** - используйте для авторизации на фронтенде

### Обработка ошибок:

Все ошибки возвращаются в стандартном формате:
```json
{
  "statusCode": 400,
  "message": "Описание ошибки",
  "error": "Bad Request"
}
```

### CORS настройки:

API настроен на прием запросов со всех доменов (`allowedOrigins: ['*']`)

---

## 🧪 Тестирование

### Swagger UI доступен по адресу:
- **Development:** `http://localhost:8000/api/docs`
- **Production:** `https://neuronest.pp.ua/api/docs`

### Тестовая страница Google OAuth:
- **Development:** `http://localhost:8000/api/auth/test`
- **Production:** `https://neuronest.pp.ua/api/auth/test`

### Проверка конфигурации:
- **Development:** `http://localhost:8000/api/auth/test/config`
- **Production:** `https://neuronest.pp.ua/api/auth/test/config`

---

## 📋 Примеры использования

### Полный процесс регистрации:

```javascript
// 1. Отправка кода (Development)
const sendCodeResponse = await fetch('http://localhost:8000/api/auth/register/send-code', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' })
});

// 2. Подтверждение кода
const verifyResponse = await fetch('http://localhost:8000/api/auth/register/verify-code', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    code: '123456',
    name: 'Иван',
    second_name: 'Иванов'
  })
});

// 3. Авторизация
const loginResponse = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    login: 'userCool123', // из email
    password: 'Abc123!@'  // из email
  })
});

const { access_token } = await loginResponse.json();
```

### Использование Bearer token:

```javascript
// Защищенный запрос (Development)
const protectedResponse = await fetch('http://localhost:8000/api/protected-endpoint', {
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  }
});
```

### Google OAuth (frontend):

```javascript
// Редирект на Google OAuth (Development)
window.location.href = 'http://localhost:8000/api/auth/google';

// Обработка callback (в production)
// URL: /auth/google/success?token=...&user=...
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const userData = JSON.parse(decodeURIComponent(urlParams.get('user')));
```

---

## 🎯 Контрольный список для интеграции

- [ ] Реализована отправка кода на email
- [ ] Реализовано подтверждение кода с дополнительными данными
- [ ] Реализована авторизация по логину/паролю
- [ ] Настроена обработка JWT токенов
- [ ] Реализован Google OAuth flow
- [ ] Настроена обработка ошибок API
- [ ] Реализовано восстановление пароля
- [ ] Настроено сохранение токенов в localStorage/cookies
- [ ] Реализована автоматическая авторизация при наличии токена
- [ ] Настроена обработка истечения токенов

---

*Документация актуальна на 22 августа 2025 г.*
