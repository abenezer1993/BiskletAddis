import React from 'react';
import { Calendar, Star } from 'lucide-react';

const EthiopianHolidays = () => {
  const holidays = [
    {
      name: 'Timkat',
      amharic: 'ጥምቀት',
      date: 'January 19, 2024',
      type: 'religious',
      impact: 'High bike usage expected'
    },
    {
      name: 'Meskel',
      amharic: 'መስቀል',
      date: 'September 27, 2024',
      type: 'religious',
      impact: 'Celebration at Meskel Square'
    },
    {
      name: 'Ethiopian New Year',
      amharic: 'እንቁጣጣሽ',
      date: 'September 11, 2024',
      type: 'cultural',
      impact: 'Increased city movement'
    },
    {
      name: 'Adwa Victory Day',
      amharic: 'የአድዋ ድል በዓል',
      date: 'March 2, 2024',
      type: 'national',
      impact: 'Parade routes affected'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'religious': return 'bg-blue-100 text-blue-800';
      case 'cultural': return 'bg-green-100 text-green-800';
      case 'national': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
        <Star className="w-5 h-5" />
        <span>Ethiopian Holidays & Events</span>
      </h3>
      <div className="space-y-3">
        {holidays.map((holiday, index) => (
          <div key={index} className="p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-text-primary">{holiday.name}</p>
                <p className="text-xs text-text-secondary">{holiday.amharic}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(holiday.type)}`}>
                {holiday.type}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{holiday.date}</span>
              </div>
              <span>{holiday.impact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EthiopianHolidays;