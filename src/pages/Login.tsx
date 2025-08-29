import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useRegistration, usePasswordRecovery, useGoogleAuth } from '../hooks/useAuth';
import type { LoginFormData, RegistrationFormData, ForgotPasswordFormData, ResetPasswordFormData } from '../types/auth';
import { RegistrationStep } from '../types/auth';
import Header from '../components/AuthHeader';
import folderBg from '../assets/LabelAuth.svg';

type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading: authLoading, error: authError, clearError: clearAuthError, handleGoogleCallback } = useAuthContext();
  const { 
    step: regStep, 
    email: regEmail, 
    sendVerificationCode, 
    verifyCodeAndRegister, 
    resendVerificationCode,
    isLoading: regLoading, 
    error: regError, 
    clearError: clearRegError,
    resetRegistration 
  } = useRegistration();
  const { 
    forgotPassword, 
    resetPassword, 
    email: forgotEmail,
    isLoading: forgotLoading, 
    error: forgotError, 
    clearError: clearForgotError,
    resetState: resetForgotState 
  } = usePasswordRecovery();
  const { redirectToGoogle } = useGoogleAuth();

  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loginFormData, setLoginFormData] = useState<LoginFormData>({ login: '', password: '' });
  const [regFormData, setRegFormData] = useState<RegistrationFormData>({ email: '' });
  const [forgotFormData, setForgotFormData] = useState<ForgotPasswordFormData>({ email: '' });
  const [resetFormData, setResetFormData] = useState<ResetPasswordFormData>({ 
    code: '', 
    newPassword: '', 
    confirmPassword: '' 
  });

  // Handle Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('token')) {
      const success = handleGoogleCallback(urlParams);
      if (success) {
        navigate('/cabinet');
      }
    }
  }, [location, handleGoogleCallback, navigate]);

  // Clear errors when switching modes
  useEffect(() => {
    clearAuthError();
    clearRegError();
    clearForgotError();
  }, [authMode]);

  const handleHome = () => {
    navigate('/home');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginFormData);
      navigate('/cabinet');
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleRegisterEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendVerificationCode(regFormData.email);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleRegisterVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyCodeAndRegister(regFormData);
      // Show success message and switch to login
      setTimeout(() => {
        setAuthMode('login');
        resetRegistration();
      }, 3000);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(forgotFormData);
      setAuthMode('reset-password');
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetFormData.newPassword !== resetFormData.confirmPassword) {
      return;
    }
    try {
      await resetPassword(resetFormData);
      // Show success message and switch to login
      setTimeout(() => {
        setAuthMode('login');
        resetForgotState();
        setResetFormData({ code: '', newPassword: '', confirmPassword: '' });
      }, 3000);
    } catch (error) {
      // Error handled by hook
    }
  };

  const isLoading = authLoading || regLoading || forgotLoading;
  const currentError = authError || regError || forgotError;

  const renderLoginForm = () => (
    <div className="animate-fadeInUp">
      <form onSubmit={handleLoginSubmit} className="relative w-[500px] max-w-full text-black">
        <img
          src={folderBg}
          alt="Folder Background"
          className="w-full select-none pointer-events-none animate-slideInFromLeft"
        />
        
        <div className="absolute inset-0 px-10 pt-12 flex flex-col gap-2">
          <label className="flex flex-col text-left font-semibold animate-slideInFromRight animation-delay-200">
            Логін
          </label>
          <input
            type="text"
            placeholder="userCool123"
            value={loginFormData.login}
            onChange={(e) => setLoginFormData(prev => ({ ...prev, login: e.target.value }))}
            required
            className="mr-8 bg-gray-300/80 border border-white outline-none px-4 py-3 placeholder:text-zinc-600 focus:bg-white animate-slideInFromRight animation-delay-300 transition-all duration-200 focus:border-gray-400"
          />

          <label className="flex flex-col text-left font-semibold mt-2 animate-slideInFromRight animation-delay-400">
            Пароль
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={loginFormData.password}
            onChange={(e) => setLoginFormData(prev => ({ ...prev, password: e.target.value }))}
            required
            className="mr-8 bg-gray-300/80 border border-white outline-none px-4 py-3 placeholder:text-zinc-600 focus:bg-white animate-slideInFromRight animation-delay-500 transition-all duration-200 focus:border-gray-400"
          />

          <button 
            type="submit" 
            disabled={isLoading}
            className="self-end mt-4 mr-10 px-6 py-2 bg-[#121212] text-white hover:bg-[#0a0a0a] disabled:opacity-50 animate-slideInFromRight animation-delay-600 transition-colors duration-200"
          >
            <span className="text-[#EFEFF2] font-TT_Autonomous_Trial_Variable text-lg font-extrabold opacity-90">
              {isLoading ? 'Вхід...' : 'Увійти'}
            </span> 
          </button>

          {/* Кнопки "Забули пароль?" и "Зареєструватися" в одном ряду */}
          <div className="flex items-center justify-center space-x-4 mt-12 animate-slideInFromBottom animation-delay-700">
            <button
              type="button"
              onClick={() => setAuthMode('forgot-password')}
              className="px-6 py-2 bg-gray-300/80 text-[#121212] hover:bg-gray-300/90 border border-white transition-colors duration-200"
              style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}
            >
              <span className="text-[#121212] font-TT_Autonomous_Trial_Variable text-lg font-extrabold opacity-90">
                Забули пароль?
              </span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className="px-6 py-2 bg-gray-300/80 text-[#121212] hover:bg-gray-300/90 border border-white transition-colors duration-200"
              style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}
            >
              <span className="text-[#121212] font-TT_Autonomous_Trial_Variable text-lg font-extrabold opacity-90">
                Зареєструватися
              </span>
            </button>
          </div>

          {/* Кнопка Google под основными кнопками */}
          <div className="flex justify-center mt-4 animate-slideInFromBottom animation-delay-800">
            <button
              type="button"
              onClick={redirectToGoogle}
              className="px-6 py-2 bg-gray-300/80 text-[#121212] hover:bg-gray-300/90 border border-white transition-colors duration-200"
              style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}
            >
              <span className="text-[#121212] font-TT_Autonomous_Trial_Variable text-lg font-extrabold opacity-90">Увійти через Google</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  const renderRegisterEmailForm = () => (
    <form onSubmit={handleRegisterEmailSubmit} className="relative w-[500px] max-w-full text-black">
      <img
        src={folderBg}
        alt="Folder Background"
        className="w-full select-none pointer-events-none"
      />
      
      <div className="absolute inset-0 px-10 pt-12 flex flex-col gap-2">
        <label className="flex flex-col text-left font-semibold">
          Ваш email для реєстрації
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          value={regFormData.email}
          onChange={(e) => setRegFormData(prev => ({ ...prev, email: e.target.value }))}
          required
          className="mr-8 bg-gray-300/80 border border-white outline-none px-4 py-3 placeholder:text-zinc-600 focus:bg-white transition-all duration-200 focus:border-gray-400"
        />

        <button 
          type="submit" 
          disabled={isLoading}
          className="self-end mt-4 mr-10 px-6 py-2 bg-[#121212] text-white hover:bg-[#0a0a0a] disabled:opacity-50 transition-colors duration-200"
        >
          <span className="text-[#EFEFF2] font-TT_Autonomous_Trial_Variable text-lg font-extrabold opacity-90">
            {isLoading ? 'Відправка...' : 'Отримати код'}
          </span> 
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className="text-[#121212] hover:text-[#000000] text-sm font-semibold transition-colors duration-200"
          >
            Вже маєте акаунт? Увійти
          </button>
        </div>
      </div>
    </form>
  );

  const renderRegisterVerifyForm = () => (
    <div className="space-y-6 max-w-2xl">
      <div className="text-center mb-4">
        <p className="text-[#B0B0B0] text-sm">Код надіслано на {regEmail}</p>
      </div>
      
      <form onSubmit={handleRegisterVerifySubmit} className="relative w-[500px] max-w-full text-black mx-auto">
        <img
          src={folderBg}
          alt="Folder Background"
          className="w-full select-none pointer-events-none"
        />
        
        <div className="absolute inset-0 px-10 pt-12 flex flex-col gap-2">
          <label className="flex flex-col text-left font-semibold">
            Код підтвердження
          </label>
          <input
            type="text"
            placeholder="123456"
            value={regFormData.code || ''}
            onChange={(e) => setRegFormData(prev => ({ ...prev, code: e.target.value }))}
            className="mr-8 bg-gray-300/80 border border-white outline-none px-4 py-3 placeholder:text-zinc-600 focus:bg-white transition-all duration-200 focus:border-gray-400"
            maxLength={6}
            required
          />

          <button 
            type="submit" 
            disabled={isLoading}
            className="self-end mt-4 mr-10 px-6 py-2 bg-[#121212] text-white hover:bg-[#0a0a0a] disabled:opacity-50 transition-colors duration-200"
          >
            <span className="text-[#EFEFF2] font-TT_Autonomous_Trial_Variable text-lg font-extrabold opacity-90">
              {isLoading ? 'Реєстрація...' : 'Підтвердити'}
            </span> 
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={resendVerificationCode}
              disabled={isLoading}
              className="text-[#121212] hover:text-[#000000] text-sm font-semibold disabled:opacity-50 transition-colors duration-200"
            >
              Надіслати код повторно
            </button>
          </div>
        </div>
      </form>

      {/* Дополнительные поля для личных данных */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <label className="block text-[#EFEFF2] font-Inter text-sm mb-2">Ім'я *</label>
          <input
            type="text"
            value={regFormData.name || ''}
            onChange={(e) => setRegFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 bg-[#2F2F2F] border border-[#656565] rounded-lg text-white focus:outline-none focus:border-[#B400F0] transition-colors duration-200"
            required
          />
        </div>
        <div>
          <label className="block text-[#EFEFF2] font-Inter text-sm mb-2">Прізвище *</label>
          <input
            type="text"
            value={regFormData.second_name || ''}
            onChange={(e) => setRegFormData(prev => ({ ...prev, second_name: e.target.value }))}
            className="w-full px-4 py-3 bg-[#2F2F2F] border border-[#656565] rounded-lg text-white focus:outline-none focus:border-[#B400F0] transition-colors duration-200"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[#EFEFF2] font-Inter text-sm mb-2">Вік (опціонально)</label>
          <input
            type="number"
            value={regFormData.age || ''}
            onChange={(e) => setRegFormData(prev => ({ ...prev, age: e.target.value ? parseInt(e.target.value) : undefined }))}
            className="w-full px-4 py-3 bg-[#2F2F2F] border border-[#656565] rounded-lg text-white focus:outline-none focus:border-[#B400F0] transition-colors duration-200"
            min="16"
            max="100"
          />
        </div>
        <div>
          <label className="block text-[#EFEFF2] font-Inter text-sm mb-2">Телефон (опціонально)</label>
          <input
            type="tel"
            value={regFormData.telefon_number || ''}
            onChange={(e) => setRegFormData(prev => ({ ...prev, telefon_number: e.target.value }))}
            className="w-full px-4 py-3 bg-[#2F2F2F] border border-[#656565] rounded-lg text-white focus:outline-none focus:border-[#B400F0] transition-colors duration-200"
            placeholder="+380..."
          />
        </div>
      </div>
    </div>
  );

  const renderForgotPasswordForm = () => (
    <form onSubmit={handleForgotPasswordSubmit} className="relative w-[500px] max-w-full text-black">
      <img
        src={folderBg}
        alt="Folder Background"
        className="w-full select-none pointer-events-none"
      />
      
      <div className="absolute inset-0 px-10 pt-12 flex flex-col gap-2">
        <label className="flex flex-col text-left font-semibold">
          Email для відновлення
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          value={forgotFormData.email}
          onChange={(e) => setForgotFormData(prev => ({ ...prev, email: e.target.value }))}
          required
          className="mr-8 bg-gray-300/80 border border-white outline-none px-4 py-3 placeholder:text-zinc-600 focus:bg-white transition-all duration-200 focus:border-gray-400"
        />

        <button 
          type="submit" 
          disabled={isLoading}
          className="self-end mt-4 mr-10 px-6 py-2 bg-[#121212] text-white hover:bg-[#0a0a0a] disabled:opacity-50 transition-colors duration-200"
        >
          <span className="text-[#EFEFF2] font-TT_Autonomous_Trial_Variable text-lg font-extrabold opacity-90">
            {isLoading ? 'Відправка...' : 'Отримати код'}
          </span> 
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className="text-[#121212] hover:text-[#000000] text-sm font-semibold transition-colors duration-200"
          >
            Повернутися до входу
          </button>
        </div>
      </div>
    </form>
  );

  const renderResetPasswordForm = () => (
    <div className="space-y-6 max-w-xl">
      <div className="text-center mb-4">
        <p className="text-[#B0B0B0] text-sm">Код надіслано на {forgotEmail}</p>
      </div>
      
      <form onSubmit={handleResetPasswordSubmit} className="relative w-[500px] max-w-full text-black mx-auto">
        <img
          src={folderBg}
          alt="Folder Background"
          className="w-full select-none pointer-events-none"
        />
        
        <div className="absolute inset-0 px-10 pt-12 flex flex-col gap-2">
          <label className="flex flex-col text-left font-semibold">
            Код відновлення
          </label>
          <input
            type="text"
            placeholder="123456"
            value={resetFormData.code}
            onChange={(e) => setResetFormData(prev => ({ ...prev, code: e.target.value }))}
            className="mr-8 bg-gray-300/80 border border-white outline-none px-4 py-3 placeholder:text-zinc-600 focus:bg-white transition-all duration-200 focus:border-gray-400"
            maxLength={6}
            required
          />

          <button 
            type="submit" 
            disabled={isLoading || resetFormData.newPassword !== resetFormData.confirmPassword}
            className="self-end mt-4 mr-10 px-6 py-2 bg-[#121212] text-white hover:bg-[#0a0a0a] disabled:opacity-50 transition-colors duration-200"
          >
            <span className="text-[#EFEFF2] font-TT_Autonomous_Trial_Variable text-lg font-extrabold opacity-90">
              {isLoading ? 'Зміна...' : 'Змінити'}
            </span> 
          </button>
        </div>
      </form>

      {/* Дополнительные поля для нового пароля */}
      <div className="space-y-4">
        <div>
          <label className="block text-[#EFEFF2] font-Inter text-sm mb-2">Новий пароль</label>
          <input
            type="password"
            value={resetFormData.newPassword}
            onChange={(e) => setResetFormData(prev => ({ ...prev, newPassword: e.target.value }))}
            className="w-full px-4 py-3 bg-[#2F2F2F] border border-[#656565] rounded-lg text-white focus:outline-none focus:border-[#B400F0] transition-colors duration-200"
            placeholder="Введіть новий пароль"
            required
          />
        </div>
        <div>
          <label className="block text-[#EFEFF2] font-Inter text-sm mb-2">Підтвердіть пароль</label>
          <input
            type="password"
            value={resetFormData.confirmPassword}
            onChange={(e) => setResetFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full px-4 py-3 bg-[#2F2F2F] border border-[#656565] rounded-lg text-white focus:outline-none focus:border-[#B400F0] transition-colors duration-200"
            placeholder="Підтвердіть новий пароль"
            required
          />
        </div>
        {resetFormData.newPassword !== resetFormData.confirmPassword && resetFormData.confirmPassword && (
          <p className="text-red-500 text-sm">Паролі не збігаються</p>
        )}
      </div>
    </div>
  );

  const getTitle = () => {
    switch (authMode) {
      case 'register':
        return regStep === RegistrationStep.EMAIL ? 'Реєстрація' : 
               regStep === RegistrationStep.CODE_VERIFICATION ? 'Підтвердження email' :
               'Реєстрація завершена!';
      case 'forgot-password':
        return 'Відновлення пароля';
      case 'reset-password':
        return 'Новий пароль';
      default:
        return 'Вхід до системи';
    }
  };

  const getSubtitle = () => {
    switch (authMode) {
      case 'register':
        return regStep === RegistrationStep.EMAIL ? 'Введіть ваш email для реєстрації' :
               regStep === RegistrationStep.CODE_VERIFICATION ? 'Заповніть дані для завершення реєстрації' :
               'Логін та пароль надіслані на вашу пошту';
      case 'forgot-password':
        return 'Введіть email для отримання коду відновлення';
      case 'reset-password':
        return 'Введіть новий пароль';
      default:
        return 'Підключись до свого навчального модуля';
    }
  };

  const renderCurrentForm = () => {
    switch (authMode) {
      case 'register':
        return regStep === RegistrationStep.EMAIL ? renderRegisterEmailForm() :
               regStep === RegistrationStep.CODE_VERIFICATION ? renderRegisterVerifyForm() :
               <div className="text-center text-green-500">
                 <p className="mb-4">Реєстрація успішно завершена!</p>
                 <p className="text-sm text-[#B0B0B0]">Логін та пароль надіслані на вашу пошту</p>
               </div>;
      case 'forgot-password':
        return renderForgotPasswordForm();
      case 'reset-password':
        return renderResetPasswordForm();
      default:
        return renderLoginForm();
    }
  };

  return (
    <>
      <Header variant="auth" onHome={handleHome} />

      <div className="absolute left-1/4 h-full border-l-2 border-zinc-700"></div>
      <div className="absolute right-1/4 h-full border-l-2 border-zinc-700"></div>
      <div className="absolute left ml-10 h-full border-l-2 border-zinc-700 "></div>
      <div className="absolute top-1/2 ml-10 w-full border-t-2 border-zinc-700"></div>

      <section className="w-full h-screen flex flex-col items-center justify-center bg-[#121212] text-white text-center px-4">
        <span className="text-[#EFEFF2] font-TT_Autonomous_Trial_Variable text-7xl font-extrabold mb-6 opacity-90">
          {getTitle()}
        </span>
        <span className="text-[#EFEFF2] font-TT_Autonomous_Trial_Variable text-lg font-extrabold mb-8 opacity-90">
          {getSubtitle()}
        </span>
        
        {currentError && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 max-w-md">
            {currentError}
          </div>
        )}

        <div className="px-4">
          {renderCurrentForm()}
        </div>

        <div className="absolute bottom-4 left-12 text-zinc-400 font-mono text-s tracking-widest">
          2025
        </div>
        <div className="absolute bottom-4 right-10 text-zinc-400 font-mono text-s tracking-widest text-right leading-tight">
          Neuro<br />Nest
        </div>
      </section>
    </>
  );
}

export default Login;
