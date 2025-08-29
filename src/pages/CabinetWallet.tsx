import React, { useState, useEffect } from 'react';
import Sidebar from '../components/CabinetSidebar';
import PaymentForm from '../components/PaymentForm';
import SubscriptionStatus from '../components/SubscriptionStatus';
import PaymentHistory from '../components/PaymentHistory';

interface PaymentRecord {
  id: string;
  description: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

interface SubscriptionData {
  planName: string;
  status: 'active' | 'inactive' | 'expired';
  nextPayment?: string;
  amount?: number;
  daysLeft?: number;
}

const CabinetWallet: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionData | undefined>();

  // Prevent body scroll when wallet is mounted
  useEffect(() => {
    document.body.classList.add('chat-active');
    return () => {
      document.body.classList.remove('chat-active');
    };
  }, []);

  // Simulate data loading
  useEffect(() => {
    const loadWalletData = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock payment history data
      const mockPayments: PaymentRecord[] = [
        {
          id: '1',
          description: 'Оплата за навчання Ніколенко Миколай Бат...',
          date: '22.03.2025',
          amount: 3224,
          status: 'completed'
        },
        {
          id: '2',
          description: 'Оплата за навчання Ніколенко Миколай Бат...',
          date: '21.02.2025',
          amount: 3224,
          status: 'completed'
        },
        {
          id: '3',
          description: 'Оплата за навчання Ніколенко Миколай Бат...',
          date: '22.01.2025',
          amount: 3224,
          status: 'completed'
        },
        {
          id: '4',
          description: 'Оплата за навчання Ніколенко Миколай Бат...',
          date: '22.12.2024',
          amount: 3224,
          status: 'completed'
        },
        {
          id: '5',
          description: 'Оплата за навчання Ніколенко Миколай Бат...',
          date: '22.11.2024',
          amount: 3224,
          status: 'completed'
        },
        {
          id: '6',
          description: 'Оплата за навчання Ніколенко Миколай Бат...',
          date: '22.10.2024',
          amount: 3224,
          status: 'completed'
        }
      ];

      // Mock subscription data
      const mockSubscription: SubscriptionData = {
        planName: 'Повний курс дизайну',
        status: 'active',
        nextPayment: '22.03.2025',
        amount: 3224,
        daysLeft: 45
      };

      setPayments(mockPayments);
      setSubscription(mockSubscription);
      setLoading(false);
    };

    loadWalletData();
  }, []);

  const handlePayment = async (amount: number, method: string) => {
    console.log(`Processing payment: ${amount} ₴ via ${method}`);
    
    // Here you would integrate with actual payment processing
    // For now, we'll just simulate adding a new payment record
    
    if (amount > 0) {
      const newPayment: PaymentRecord = {
        id: Date.now().toString(),
        description: 'Новий платіж за навчання',
        date: new Date().toLocaleDateString('uk-UA'),
        amount: amount,
        status: 'pending'
      };

      setPayments(prev => [newPayment, ...prev]);
      
      // Simulate payment processing
      setTimeout(() => {
        setPayments(prev => 
          prev.map(payment => 
            payment.id === newPayment.id 
              ? { ...payment, status: 'completed' as const }
              : payment
          )
        );
      }, 2000);
    }
  };

  return (
    <div className="cabinet-container bg-cabinet-black relative h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Container */}
      <div className="cabinet-main-content bg-transparent relative z-10 h-screen overflow-y-auto chat-scroll-container">
        <div className="min-h-full py-8 px-4 lg:px-8">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h3 className="text-cabinet-white font-tt-autonomous text-4xl lg:text-5xl xl:text-6xl font-bold tracking-wide">
              Оплата та підписка
            </h3>
            <div className="w-32 h-1 bg-gradient-to-r from-cabinet-blue via-cabinet-purple to-cabinet-blue mx-auto mt-4"></div>
          </div>

          {/* Payment Form Section - Top Center */}
          <div className="mb-16">
            <PaymentForm onPayment={handlePayment} />
          </div>

          {/* Subscription Status Section - Center */}
          <div className="mb-16">
            <SubscriptionStatus subscription={subscription} />
          </div>

          {/* Payment History Section - Bottom */}
          <div className="mb-8">
            <PaymentHistory 
              payments={payments} 
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabinetWallet;
