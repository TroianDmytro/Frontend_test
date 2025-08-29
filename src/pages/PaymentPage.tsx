import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface PaymentModule {
  id: number;
  title: string;
  price: number;
}

interface PaymentData {
  modules: PaymentModule[];
  totalPrice: number;
  courseType: string;
}

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Получаем данные из state роутера
    if (location.state) {
      setPaymentData(location.state as PaymentData);
    } else {
      // Если данных нет, перенаправляем на главную
      navigate('/home');
    }
  }, [location.state, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Имитация обработки платежа
    setTimeout(() => {
      setIsProcessing(false);
      // Перенаправляем на страницу успешной оплаты
      navigate('/payment-success', { 
        state: { 
          ...paymentData,
          customerName: `${formData.firstName} ${formData.lastName}`
        }
      });
    }, 3000);
  };

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
      {/* Back button */}
      <div style={{ position: 'absolute', top: '3vh', right: '5vw', zIndex: 50 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '1.5vh 2vw',
            border: '1px solid #D9D9D9',
            background: 'transparent',
            color: '#EFEFF2',
            fontFamily: 'TT_Autonomous_Trial_Variable, sans-serif',
            fontSize: 'clamp(0.9rem, 1.2vw, 1.125rem)',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.background = '#D9D9D9';
            target.style.color = '#121212';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.background = 'transparent';
            target.style.color = '#EFEFF2';
          }}
        >
          Назад
        </button>
      </div>

      {/* Main content */}
      <div style={{ 
        width: '90vw', 
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '10vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '5vw',
        alignItems: 'start'
      }}>
        {/* Order Summary */}
        <div style={{
          background: '#2F2F2F',
          padding: '4vh 3vw',
          borderRadius: '12px',
          border: '1px solid #656565'
        }}>
          <h2 style={{
            color: '#FFF',
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(1.5rem, 2vw, 2rem)',
            fontWeight: 700,
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
            {paymentData.modules.map((module, index) => (
              <div key={module.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '1vh 0',
                borderBottom: index < paymentData.modules.length - 1 ? '1px solid #656565' : 'none'
              }}>
                <span style={{
                  color: '#FFF',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
                  flex: 1
                }}>
                  {module.title}
                </span>
                <span style={{
                  color: '#FFF',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
                  fontWeight: 800
                }}>
                  {module.price.toLocaleString()} грн
                </span>
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
              fontSize: 'clamp(1.2rem, 1.5vw, 1.5rem)',
              fontWeight: 700
            }}>
              Загальна сума:
            </span>
            <span style={{
              color: '#B400F0',
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(1.2rem, 1.5vw, 1.5rem)',
              fontWeight: 800
            }}>
              {paymentData.totalPrice.toLocaleString()} грн
            </span>
          </div>
        </div>

        {/* Payment Form */}
        <div style={{
          background: '#2F2F2F',
          padding: '4vh 3vw',
          borderRadius: '12px',
          border: '1px solid #656565'
        }}>
          <h2 style={{
            color: '#FFF',
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(1.5rem, 2vw, 2rem)',
            fontWeight: 700,
            marginBottom: '3vh'
          }}>
            Дані для оплати
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div style={{ marginBottom: '3vh' }}>
              <h3 style={{
                color: '#B0B0B0',
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
                marginBottom: '2vh'
              }}>
                Особисті дані
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1vw', marginBottom: '2vh' }}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Ім'я"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  style={{
                    padding: '1.5vh 1vw',
                    background: '#121212',
                    border: '1px solid #656565',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(0.9rem, 1vw, 1rem)'
                  }}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Прізвище"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  style={{
                    padding: '1.5vh 1vw',
                    background: '#121212',
                    border: '1px solid #656565',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(0.9rem, 1vw, 1rem)'
                  }}
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '1.5vh 1vw',
                  background: '#121212',
                  border: '1px solid #656565',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'clamp(0.9rem, 1vw, 1rem)',
                  marginBottom: '2vh'
                }}
              />

              <input
                type="tel"
                name="phone"
                placeholder="Телефон"
                value={formData.phone}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '1.5vh 1vw',
                  background: '#121212',
                  border: '1px solid #656565',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'clamp(0.9rem, 1vw, 1rem)'
                }}
              />
            </div>

            {/* Card Information */}
            <div style={{ marginBottom: '3vh' }}>
              <h3 style={{
                color: '#B0B0B0',
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
                marginBottom: '2vh'
              }}>
                Дані картки
              </h3>

              <input
                type="text"
                name="cardHolderName"
                placeholder="Ім'я власника картки"
                value={formData.cardHolderName}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '1.5vh 1vw',
                  background: '#121212',
                  border: '1px solid #656565',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'clamp(0.9rem, 1vw, 1rem)',
                  marginBottom: '2vh'
                }}
              />

              <input
                type="text"
                name="cardNumber"
                placeholder="Номер картки"
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '1.5vh 1vw',
                  background: '#121212',
                  border: '1px solid #656565',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'clamp(0.9rem, 1vw, 1rem)',
                  marginBottom: '2vh'
                }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1vw' }}>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                  style={{
                    padding: '1.5vh 1vw',
                    background: '#121212',
                    border: '1px solid #656565',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(0.9rem, 1vw, 1rem)'
                  }}
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  required
                  style={{
                    padding: '1.5vh 1vw',
                    background: '#121212',
                    border: '1px solid #656565',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(0.9rem, 1vw, 1rem)'
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '2vh 0',
                background: isProcessing ? '#666' : '#B400F0',
                border: 'none',
                borderRadius: '8px',
                color: '#FFF',
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(1rem, 1.3vw, 1.25rem)',
                fontWeight: 600,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {isProcessing ? 'Обробка платежу...' : `Сплатити ${paymentData.totalPrice.toLocaleString()} грн`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
