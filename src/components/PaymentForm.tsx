import React, { useState } from 'react';

interface PaymentFormProps {
  onPayment?: (amount: number, method: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onPayment }) => {
  const [amount, setAmount] = useState<string>('0');
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const paymentMethods = [
    { id: 'online', label: 'Онлайн' },
    { id: 'requisites', label: 'По реквізитам' },
    { id: 'invoice', label: 'Завантажити рахунок' }
  ];

  const handlePayment = (method: string) => {
    const numAmount = parseFloat(amount) || 0;
    setSelectedMethod(method);
    if (onPayment) {
      onPayment(numAmount, method);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Main Payment Container */}
      <div className="relative border border-cabinet-white p-8 md:p-12">
        {/* Decorative corner elements */}
        <div className="absolute top-4 right-4 w-8 h-8 border border-cabinet-gray transform rotate-45"></div>
        
        {/* Amount Section */}
        <div className="mb-8">
          <label className="block text-white text-2xl font-bold mb-4 font-inter tracking-wide">
            Сума
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="
                w-full px-6 py-4 
                bg-transparent 
                border border-white 
                text-cabinet-blue text-2xl font-bold 
                font-inter tracking-wide
                outline-none
                transition-all duration-200
                focus:border-cabinet-blue focus:shadow-lg
              "
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        {/* Payment Method Selection Label */}
        <div className="mb-8">
          <p className="text-cabinet-gray text-2xl font-medium font-inter tracking-wide">
            Оберіть спосіб оплати
          </p>
        </div>

        {/* Payment Method Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {paymentMethods.map((method) => {
            const isActive = selectedMethod === method.id;
            return (
              <button
                key={method.id}
                onClick={() => handlePayment(method.id)}
                className={`
                  relative h-20 px-6
                  bg-cabinet-blue-dark
                  text-white text-2xl lg:text-3xl font-bold
                  font-inter tracking-wide
                  transition-all duration-200
                  hover:bg-cabinet-blue hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-cabinet-blue
                  group
                  ${isActive ? 'ring-2 ring-cabinet-accent-blue shadow-lg bg-cabinet-blue' : ''}
                `}
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 100%, 0 100%)'
                }}
              >
                <span className="relative z-10">{method.label}</span>
                {/* Hover/Active effect overlay */}
                <div className={`
                  absolute inset-0 
                  bg-gradient-to-r from-cabinet-blue to-cabinet-accent-blue
                  transition-opacity duration-200
                  ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}></div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
