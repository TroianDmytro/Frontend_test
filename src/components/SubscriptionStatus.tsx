import React from 'react';

interface SubscriptionData {
  planName: string;
  status: 'active' | 'inactive' | 'expired';
  nextPayment?: string;
  amount?: number;
  daysLeft?: number;
}

interface SubscriptionStatusProps {
  subscription?: SubscriptionData;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ 
  subscription = {
    planName: 'Базовий план навчання',
    status: 'active',
    nextPayment: '22.03.2025',
    amount: 3224,
    daysLeft: 45
  }
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'expired':
        return 'text-red-400';
      default:
        return 'text-cabinet-gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активна';
      case 'expired':
        return 'Закінчилась';
      default:
        return 'Неактивна';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      <div className="
        bg-gradient-to-br from-cabinet-dark-gray/50 to-cabinet-black/50
        border border-cabinet-border-gray/30
        backdrop-blur-sm
        p-8 md:p-12
        rounded-lg
        relative
        overflow-hidden
      ">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 border border-cabinet-gray/10 transform rotate-45 translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 border border-cabinet-gray/10 transform rotate-45 -translate-x-12 translate-y-12"></div>
        
        <div className="relative z-10">
          {/* Subscription Title */}
          <div className="text-center mb-8">
            <h2 className="text-cabinet-white text-3xl lg:text-4xl font-bold font-tt-autonomous mb-2">
              Стан підписки
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cabinet-blue to-cabinet-purple mx-auto"></div>
          </div>

          {/* Subscription Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Plan Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-cabinet-gray text-lg font-medium mb-2">
                  Поточний план
                </h3>
                <p className="text-cabinet-white text-2xl font-semibold">
                  {subscription.planName}
                </p>
              </div>
              
              <div>
                <h3 className="text-cabinet-gray text-lg font-medium mb-2">
                  Статус
                </h3>
                <p className={`text-2xl font-semibold ${getStatusColor(subscription.status)}`}>
                  {getStatusText(subscription.status)}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-4">
              {subscription.nextPayment && (
                <div>
                  <h3 className="text-cabinet-gray text-lg font-medium mb-2">
                    Наступний платіж
                  </h3>
                  <p className="text-cabinet-white text-2xl font-semibold">
                    {subscription.nextPayment}
                  </p>
                </div>
              )}
              
              {subscription.amount && (
                <div>
                  <h3 className="text-cabinet-gray text-lg font-medium mb-2">
                    Сума
                  </h3>
                  <p className="text-cabinet-blue text-2xl font-bold">
                    {subscription.amount} ₴
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {subscription.daysLeft && subscription.daysLeft > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-cabinet-gray text-sm">
                  Залишилось днів
                </span>
                <span className="text-cabinet-white text-lg font-semibold">
                  {subscription.daysLeft}
                </span>
              </div>
              <div className="w-full bg-cabinet-dark-gray h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cabinet-blue to-cabinet-purple transition-all duration-500"
                  style={{ width: `${Math.min((subscription.daysLeft / 90) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="
              px-8 py-3
              bg-gradient-to-r from-cabinet-blue to-cabinet-accent-blue
              text-white font-semibold
              rounded-lg
              hover:shadow-lg
              transition-all duration-200
              transform hover:scale-105
            ">
              Продовжити підписку
            </button>
            
            <button className="
              px-8 py-3
              border border-cabinet-border-gray
              text-cabinet-white font-semibold
              rounded-lg
              hover:bg-cabinet-dark-gray/50
              transition-all duration-200
            ">
              Змінити план
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatus;
