import React from 'react';
import { CreditCard, Smartphone, Building, Banknote } from 'lucide-react';

const PaymentMethods = () => {
  const paymentMethods = [
    {
      name: 'Telebirr',
      logo: '📱',
      description: 'Ethiopia\'s leading mobile payment',
      usage: '45%',
      status: 'active',
      color: 'bg-green-100 text-green-800'
    },
    {
      name: 'CBE Birr',
      logo: '🏦',
      description: 'Commercial Bank of Ethiopia',
      usage: '28%',
      status: 'active',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Dashen Bank',
      logo: '💳',
      description: 'Mobile & Online Banking',
      usage: '15%',
      status: 'active',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      name: 'Awash Bank',
      logo: '🏛️',
      description: 'Digital Banking Services',
      usage: '8%',
      status: 'active',
      color: 'bg-orange-100 text-orange-800'
    },
    {
      name: 'Cash Payment',
      logo: '💵',
      description: 'Traditional cash payment',
      usage: '4%',
      status: 'limited',
      color: 'bg-gray-100 text-gray-800'
    }
  ];

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Ethiopian Payment Methods</h3>
      <div className="space-y-3">
        {paymentMethods.map((method, index) => (
          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{method.logo}</span>
              <div>
                <p className="text-sm font-medium text-text-primary">{method.name}</p>
                <p className="text-xs text-text-secondary">{method.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-text-primary">{method.usage}</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${method.color}`}>
                {method.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;