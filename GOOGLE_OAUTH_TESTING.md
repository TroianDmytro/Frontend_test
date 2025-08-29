# Тестирование Google OAuth Redirect

## 🧪 Как протестировать

### 1. Запустите приложение в режиме разработки:
```bash
npm run dev
```

### 2. Протестируйте OAuth redirect вручную:

Перейдите по этому URL в браузере (замените на ваш URL):
```
http://localhost:3000/?token=YOUR_TOKEN&user=YOUR_USER_DATA
```

Пример URL для тестирования:
```
http://localhost:3000/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InphenBsYXkzODgxQGdtYWlsLmNvbSIsImxvZ2luIjoiemF6cGxheTNnb29nbGU0NjciLCJzdWIiOiI2OGE4ZDllN2ExMmViZjA2YTk1YmFlZTEiLCJyb2xlcyI6WyJ1c2VyIl0sInByb3ZpZGVyIjoiZ29vZ2xlIiwiZ29vZ2xlSWQiOiIxMDAwMDE1MTM4NDM1NzMxMzE1NTQiLCJpYXQiOjE3NTU5MzcyNjcsImV4cCI6MTc1NTk4MDQ2N30.kFdgajXLvxCjaMkq-zGbtRC7M15yZwj6GjvWxMJU17s&user=%7B%22id%22%3A%2268a8d9e7a12ebf06a95baee1%22%2C%22email%22%3A%22zazplay3881%40gmail.com%22%2C%22login%22%3A%22zazplay3google467%22%2C%22name%22%3A%22%D0%92%D0%B8%D0%BA%D1%82%D0%BE%D1%80%22%2C%22second_name%22%3A%22%22%2C%22isEmailVerified%22%3Atrue%2C%22roles%22%3A%5B%22user%22%5D%2C%22provider%22%3A%22google%22%2C%22avatar_url%22%3A%22https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocIFHHz5fHWWCM-sk-rZocTQGfs4wAH9OseEU5KyCyzbSFZouMEa%3Ds96-c%22%2C%22is_google_user%22%3Atrue%7D
```

### 3. Ожидаемое поведение:

1. **Когда пользователь попадает на URL с token и user параметрами:**
   - Показывается loading экран "Авторизація через Google"
   - Токен и данные пользователя сохраняются в localStorage
   - Через 1.5 секунды происходит редирект на `/cabinet`

2. **Если авторизация успешна:**
   - Пользователь попадает в личный кабинет
   - Данные пользователя отображаются в интерфейсе
   - В localStorage сохранены: `auth_token` и `user_data`

3. **Если произошла ошибка:**
   - Через 2 секунды редирект на `/login`

### 4. Проверка localStorage:

Откройте DevTools → Application → Local Storage и убедитесь что есть:
- `auth_token`: JWT токен
- `user_data`: JSON с данными пользователя

### 5. Проверка консоли:

В консоли браузера должны быть логи:
```
🔄 Processing Google OAuth callback...
Google OAuth callback received: { hasToken: true, hasUser: true, tokenLength: XXX }
Parsed Google user data: { id: "...", email: "...", name: "...", provider: "google" }
Google OAuth data saved to localStorage successfully
🔄 Processing Google OAuth callback in useAuth...
✅ Google OAuth successful, updating auth state...
👤 User data: { email: "...", name: "...", provider: "google" }
✅ Auth state updated successfully
✅ Google authentication successful!
```

## 🔧 Настройка Backend

Убедитесь что backend настроен на редирект:
- **Development**: `http://localhost:3000/?token={token}&user={user}`
- **Production**: `https://your-domain.com/?token={token}&user={user}`

## 📝 Основные изменения

1. **Home.tsx** - добавлена обработка OAuth параметров
2. **StartPage.tsx** - добавлена обработка OAuth параметров
3. **GoogleOAuthHandler.tsx** - новый компонент для обработки OAuth
4. **authService.ts** - улучшены логи и обработка ошибок
5. **useAuth.ts** - добавлены подробные логи

## ✅ Готово!

Теперь пользователи после Google авторизации будут:
1. Попадать на главную страницу с параметрами
2. Видеть loading экран
3. Автоматически перенаправляться в кабинет
4. Иметь сохраненную сессию в localStorage
