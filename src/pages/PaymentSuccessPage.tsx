import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface PaymentSuccessData {
  modules: Array<{
    id: number;
    title: string;
    price: number;
  }>;
  totalPrice: number;
  courseType: string;
  customerName: string;
}

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentData, setPaymentData] = useState<PaymentSuccessData | null>(null);

  useEffect(() => {
    if (location.state) {
      setPaymentData(location.state as PaymentSuccessData);
    } else {
      navigate('/home');
    }
  }, [location.state, navigate]);

  if (!paymentData) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        background: '#121212', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#FFF'
      }}>
        Завантаження...
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', minHeight: '100vh', background: '#121212', position: 'relative', overflow: 'hidden' }}>
      {/* Success content */}
      <div style={{ 
        width: '85vw', 
        maxWidth: '800px',
        margin: '0 auto',
        paddingTop: '10vh',
        textAlign: 'center'
      }}>
        {/* Success Icon */}
        <div style={{ marginBottom: '4vh' }}>
          <svg 
            width="120" 
            height="120" 
            viewBox="0 0 120 120" 
            fill="none" 
            style={{ margin: '0 auto' }}
          >
            <circle cx="60" cy="60" r="60" fill="#4CAF50"/>
            <path 
              d="M30 60L50 80L90 40" 
              stroke="white" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 style={{
          color: '#FFF',
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 700,
          marginBottom: '2vh'
        }}>
          Оплата успішна!
        </h1>

        <p style={{
          color: '#B0B0B0',
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(1.1rem, 1.5vw, 1.3rem)',
          marginBottom: '4vh'
        }}>
          Дякуємо, {paymentData.customerName}! Ваше замовлення прийнято до обробки.
        </p>

        {/* Order Details */}
        <div style={{
          background: '#2F2F2F',
          padding: '4vh 3vw',
          borderRadius: '12px',
          border: '1px solid #656565',
          marginBottom: '4vh',
          textAlign: 'left'
        }}>
          <h2 style={{
            color: '#FFF',
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(1.3rem, 1.8vw, 1.6rem)',
            fontWeight: 600,
            marginBottom: '3vh'
          }}>
            Деталі замовлення
          </h2>

          <div style={{
            color: '#B0B0B0',
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
            marginBottom: '2vh'
          }}>
            Курс: {paymentData.courseType}
          </div>

          <div style={{ marginBottom: '3vh' }}>
            <h3 style={{
              color: '#FFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(1rem, 1.3vw, 1.2rem)',
              fontWeight: 600,
              marginBottom: '1vh'
            }}>
              Обрані модулі:
            </h3>
            {paymentData.modules.map((module) => (
              <div key={module.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5vh 0',
                color: '#D0D0D0',
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(0.9rem, 1.1vw, 1rem)'
              }}>
                <span>{module.title}</span>
                <span>{module.price.toLocaleString()} грн</span>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '2vh 0',
            borderTop: '2px solid #656565',
            marginTop: '2vh'
          }}>
            <span style={{
              color: '#FFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(1.2rem, 1.5vw, 1.4rem)',
              fontWeight: 700
            }}>
              Сплачено:
            </span>
            <span style={{
              color: '#4CAF50',
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(1.2rem, 1.5vw, 1.4rem)',
              fontWeight: 700
            }}>
              {paymentData.totalPrice.toLocaleString()} грн
            </span>
          </div>
        </div>

        {/* Information */}
        <div style={{
          background: '#1A1A1A',
          padding: '3vh 2vw',
          borderRadius: '8px',
          marginBottom: '4vh'
        }}>
          <p style={{
            color: '#B0B0B0',
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
            lineHeight: '1.6',
            margin: 0
          }}>
            📧 На вашу електронну пошту надіслано підтвердження оплати та деталі доступу до курсу.
            <br />
            🎓 Навчання розпочнеться найближчим часом. Наш менеджер зв'яжеться з вами для уточнення деталей.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '2vw', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/cabinet/home')}
            style={{
              padding: '2vh 3vw',
              background: '#B400F0',
              border: 'none',
              borderRadius: '8px',
              color: '#FFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = '#9500CC';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = '#B400F0';
            }}
          >
            Перейти в особистий кабінет
          </button>

          <button
            onClick={() => navigate('/home')}
            style={{
              padding: '2vh 3vw',
              background: 'transparent',
              border: '1px solid #656565',
              borderRadius: '8px',
              color: '#FFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = '#656565';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = 'transparent';
            }}
          >
            На головну
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
