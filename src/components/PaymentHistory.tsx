import React, { useState } from 'react';

interface PaymentRecord {
  id: string;
  description: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

interface PaymentHistoryProps {
  payments?: PaymentRecord[];
  loading?: boolean;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ 
  payments = [
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
  ],
  loading = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Status color helper removed (unused)

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="relative mb-8">
        {/* History Label - Vertical */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-cabinet-blue-dark flex items-center justify-center">
          <div className="transform -rotate-90 whitespace-nowrap">
            <span className="text-white text-base font-bold tracking-wider">
              Історія платежів
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="ml-16 border border-cabinet-white">
          {/* Table Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 border-b border-cabinet-border-gray bg-cabinet-black/50">
            <div className="md:col-span-6">
              <h3 className="text-cabinet-gray text-xl lg:text-2xl font-medium tracking-wide">
                Назначення
              </h3>
            </div>
            <div className="md:col-span-3 text-center">
              <h3 className="text-cabinet-gray text-xl lg:text-2xl font-medium tracking-wide">
                Дата
              </h3>
            </div>
            <div className="md:col-span-3 text-center">
              <h3 className="text-cabinet-gray text-xl lg:text-2xl font-medium tracking-wide">
                Сума
              </h3>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-cabinet-border-gray/30">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cabinet-blue"></div>
                <p className="text-cabinet-gray mt-4">Завантаження...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-cabinet-gray text-lg">Історія платежів порожня</p>
              </div>
            ) : (
              payments.slice(0, isExpanded ? payments.length : 6).map((payment) => (
                <div key={payment.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 hover:bg-cabinet-dark-gray/20 transition-colors">
                  {/* Description */}
                  <div className="md:col-span-6 flex items-center">
                    <span className="text-white text-lg lg:text-xl font-medium tracking-wide">
                      {payment.description}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="md:col-span-3 flex items-center justify-center">
                    <span className="text-white text-lg lg:text-xl font-medium text-center tracking-wide">
                      {payment.date}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="md:col-span-3 flex items-center justify-center">
                    <span className="text-white text-lg lg:text-xl font-medium text-center tracking-wide">
                      {payment.amount} ₴
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Show More/Less Button */}
          {payments.length > 6 && (
            <div className="p-6 border-t border-cabinet-border-gray/30 text-center">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="
                  inline-flex items-center gap-2
                  px-6 py-3
                  text-cabinet-blue hover:text-cabinet-accent-blue
                  font-medium
                  transition-colors duration-200
                "
              >
                {isExpanded ? (
                  <>
                    <span>Згорнути</span>
                    <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Показати всі ({payments.length})</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
