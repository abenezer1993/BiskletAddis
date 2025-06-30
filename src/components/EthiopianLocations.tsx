import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

const EthiopianLocations = () => {
  const popularLocations = [
    {
      name: 'Meskel Square',
      amharic: 'መስቀል አደባባይ',
      district: 'Kirkos',
      bikes: 45,
      demand: 'high'
    },
    {
      name: 'Bole Airport',
      amharic: 'ቦሌ አየር ማረፊያ',
      district: 'Bole',
      bikes: 23,
      demand: 'medium'
    },
    {
      name: 'Piazza',
      amharic: 'ፒያሳ',
      district: 'Arada',
      bikes: 67,
      demand: 'high'
    },
    {
      name: 'Mexico Square',
      amharic: 'ሜክሲኮ አደባባይ',
      district: 'Kirkos',
      bikes: 34,
      demand: 'medium'
    },
    {
      name: 'Mercato',
      amharic: 'መርካቶ',
      district: 'Addis Ketema',
      bikes: 56,
      demand: 'high'
    },
    {
      name: 'Unity Park',
      amharic: 'አንድነት ፓርክ',
      district: 'Addis Ketema',
      bikes: 28,
      demand: 'low'
    }
  ];

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
        <Navigation className="w-5 h-5" />
        <span>Popular Locations</span>
      </h3>
      <div className="space-y-3">
        {popularLocations.map((location, index) => (
          <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-text-primary">{location.name}</p>
                <p className="text-xs text-text-secondary">{location.amharic} • {location.district}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-text-primary">{location.bikes} bikes</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDemandColor(location.demand)}`}>
                {location.demand}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EthiopianLocations;