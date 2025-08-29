import { useLoading } from '../components/LoadingContext';
import { useCallback } from 'react';

export const usePageLoading = () => {
  const { showPageLoader, hidePageLoader, setLoading } = useLoading();

  // Функция для показа загрузки с автоматическим скрытием
  const showLoadingFor = useCallback((duration: number = 1000) => {
    showPageLoader();
    setTimeout(() => {
      hidePageLoader();
    }, duration);
  }, [showPageLoader, hidePageLoader]);

  // Функция для асинхронных операций с загрузкой
  const withLoading = useCallback(async <T>(
    asyncOperation: () => Promise<T>
  ): Promise<T> => {
    try {
      showPageLoader();
      const result = await asyncOperation();
      return result;
    } finally {
      hidePageLoader();
    }
  }, [showPageLoader, hidePageLoader]);

  // Функция для симуляции загрузки при навигации
  const simulateNavigation = useCallback((callback: () => void, delay: number = 300) => {
    showPageLoader();
    setTimeout(() => {
      callback();
      hidePageLoader();
    }, delay);
  }, [showPageLoader, hidePageLoader]);

  return {
    showPageLoader,
    hidePageLoader,
    setLoading,
    showLoadingFor,
    withLoading,
    simulateNavigation,
  };
};
