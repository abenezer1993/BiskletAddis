import React from 'react';
import { Calendar } from 'lucide-react';

interface EthiopianCalendarProps {
  gregorianDate: string;
}

const EthiopianCalendar: React.FC<EthiopianCalendarProps> = ({ gregorianDate }) => {
  // Simple Ethiopian calendar conversion (approximate)
  const convertToEthiopian = (gregorianDate: string) => {
    const date = new Date(gregorianDate);
    const ethiopianYear = date.getFullYear() - 7; // Ethiopian calendar is ~7-8 years behind
    const ethiopianMonths = [
      'መስከረም', 'ጥቅምት', 'ህዳር', 'ታህሳስ', 'ጥር', 'የካቲት',
      'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
    ];
    
    const month = ethiopianMonths[date.getMonth()];
    const day = date.getDate();
    
    return `${day} ${month} ${ethiopianYear}`;
  };

  return (
    <div className="flex items-center space-x-2 text-sm text-text-secondary">
      <Calendar className="w-4 h-4" />
      <span>{convertToEthiopian(gregorianDate)}</span>
    </div>
  );
};

export default EthiopianCalendar;