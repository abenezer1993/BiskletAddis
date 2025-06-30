import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation dictionaries
const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.bikes': 'Bike Management',
    'nav.users': 'User Management',
    'nav.userTypes': 'User Types',
    'nav.permissions': 'User Permissions',
    'nav.reports': 'Financial Reports',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back! Here\'s what\'s happening with Bisklet today.',
    'dashboard.totalBikes': 'Total Bikes',
    'dashboard.activeUsers': 'Active Users',
    'dashboard.dailyRevenue': 'Daily Revenue',
    'dashboard.activeRides': 'Active Rides',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.systemAlerts': 'System Alerts',
    'dashboard.popularLocations': 'Popular Locations',
    'dashboard.ethiopianHolidays': 'Ethiopian Holidays & Events',
    
    // Bike Management
    'bikes.title': 'Bike Management',
    'bikes.subtitle': 'Manage and monitor all bikes in the fleet',
    'bikes.addNew': 'Add New Bike',
    'bikes.available': 'Available',
    'bikes.inUse': 'In Use',
    'bikes.maintenance': 'Maintenance',
    'bikes.lowBattery': 'Low Battery',
    'bikes.search': 'Search bikes by code, model, or location...',
    'bikes.status': 'Status',
    'bikes.battery': 'Battery',
    'bikes.location': 'Location',
    'bikes.totalRides': 'Total Rides',
    'bikes.actions': 'Actions',
    
    // User Management
    'users.title': 'User Management',
    'users.subtitle': 'Manage user accounts, verification, and support',
    'users.totalUsers': 'Total Users',
    'users.verified': 'Verified',
    'users.pending': 'Pending',
    'users.suspended': 'Suspended',
    'users.search': 'Search users by name, email, or phone...',
    'users.contact': 'Contact',
    'users.walletBalance': 'Wallet Balance',
    'users.lastActive': 'Last Active',
    
    // User Permissions
    'permissions.title': 'User Permission Management',
    'permissions.subtitle': 'Create users and manage permissions for all user types',
    'permissions.addUser': 'Add User',
    'permissions.grantPermission': 'Grant Permission',
    'permissions.administrators': 'Administrators',
    'permissions.staffMembers': 'Staff Members',
    'permissions.partners': 'Partners',
    'permissions.activePermissions': 'Active Permissions',
    
    // Forms
    'form.fullName': 'Full Name',
    'form.fullNameAmharic': 'Full Name (Amharic)',
    'form.email': 'Email Address',
    'form.phone': 'Phone Number',
    'form.userRole': 'User Role',
    'form.userType': 'User Type',
    'form.organization': 'Organization',
    'form.studentId': 'Student ID',
    'form.employeeId': 'Employee ID',
    'form.governmentId': 'Government ID',
    'form.subscriptionType': 'Subscription Type',
    'form.save': 'Save',
    'form.cancel': 'Cancel',
    'form.create': 'Create',
    'form.update': 'Update',
    'form.delete': 'Delete',
    'form.required': 'Required',
    
    // Common
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.actions': 'Actions',
    'common.status': 'Status',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.close': 'Close',
    'common.view': 'View',
    'common.edit': 'Edit',
    'common.export': 'Export',
    'common.import': 'Import',
    
    // Status messages
    'status.success': 'Success',
    'status.error': 'Error',
    'status.warning': 'Warning',
    'status.info': 'Information',
    
    // Ethiopian specific
    'ethiopia.addisAbaba': 'Addis Ababa',
    'ethiopia.servingAddis': 'Serving Addis Ababa',
    'ethiopia.bikeService': 'Addis Ababa Bike Service',
    'ethiopia.currency': 'ETB',
    
    // Payment methods
    'payment.telebirr': 'Telebirr',
    'payment.cbeBirr': 'CBE Birr',
    'payment.dashenBank': 'Dashen Bank',
    'payment.awashBank': 'Awash Bank',
    'payment.cash': 'Cash Payment',
    'payment.wallet': 'Wallet',
    
    // Locations
    'location.meskelSquare': 'Meskel Square',
    'location.boleAirport': 'Bole Airport',
    'location.piazza': 'Piazza',
    'location.mexicoSquare': 'Mexico Square',
    'location.mercato': 'Mercato',
    'location.unityPark': 'Unity Park',
    
    // Time
    'time.now': 'now',
    'time.minutesAgo': 'minutes ago',
    'time.hoursAgo': 'hours ago',
    'time.daysAgo': 'days ago',
    'time.weeksAgo': 'weeks ago',
    'time.monthsAgo': 'months ago',
    'time.lastChecked': 'Last checked',
    
    // Holidays
    'holiday.timkat': 'Timkat',
    'holiday.meskel': 'Meskel',
    'holiday.newYear': 'Ethiopian New Year',
    'holiday.adwa': 'Adwa Victory Day',
    'holiday.religious': 'Religious',
    'holiday.cultural': 'Cultural',
    'holiday.national': 'National'
  },
  
  am: {
    // Navigation
    'nav.dashboard': 'ዳሽቦርድ',
    'nav.bikes': 'ብስክሌት አስተዳደር',
    'nav.users': 'ተጠቃሚዎች አስተዳደር',
    'nav.userTypes': 'የተጠቃሚ ዓይነቶች',
    'nav.permissions': 'የተጠቃሚ ፈቃዶች',
    'nav.reports': 'የገንዘብ ሪፖርቶች',
    
    // Dashboard
    'dashboard.title': 'ዳሽቦርድ',
    'dashboard.welcome': 'እንኳን ደህና መጡ! ዛሬ በቢስክሌት ላይ የሚከሰተው ነገር ይህ ነው።',
    'dashboard.totalBikes': 'ጠቅላላ ብስክሌቶች',
    'dashboard.activeUsers': 'ንቁ ተጠቃሚዎች',
    'dashboard.dailyRevenue': 'ዕለታዊ ገቢ',
    'dashboard.activeRides': 'ንቁ ጉዞዎች',
    'dashboard.recentActivity': 'የቅርብ ጊዜ እንቅስቃሴ',
    'dashboard.systemAlerts': 'የስርዓት ማንቂያዎች',
    'dashboard.popularLocations': 'ተወዳጅ ቦታዎች',
    'dashboard.ethiopianHolidays': 'የኢትዮጵያ በዓላትና ዝግጅቶች',
    
    // Bike Management
    'bikes.title': 'ብስክሌት አስተዳደር',
    'bikes.subtitle': 'ሁሉንም ብስክሌቶች ማስተዳደርና መከታተል',
    'bikes.addNew': 'አዲስ ብስክሌት ጨምር',
    'bikes.available': 'ዝግጁ',
    'bikes.inUse': 'በአጠቃቀም ላይ',
    'bikes.maintenance': 'ጥገና',
    'bikes.lowBattery': 'ዝቅተኛ ባትሪ',
    'bikes.search': 'በኮድ፣ ሞዴል ወይም ቦታ ይፈልጉ...',
    'bikes.status': 'ሁኔታ',
    'bikes.battery': 'ባትሪ',
    'bikes.location': 'ቦታ',
    'bikes.totalRides': 'ጠቅላላ ጉዞዎች',
    'bikes.actions': 'እርምጃዎች',
    
    // User Management
    'users.title': 'ተጠቃሚዎች አስተዳደር',
    'users.subtitle': 'የተጠቃሚ መለያዎችን፣ ማረጋገጫንና ድጋፍን ማስተዳደር',
    'users.totalUsers': 'ጠቅላላ ተጠቃሚዎች',
    'users.verified': 'የተረጋገጡ',
    'users.pending': 'በመጠባበቅ ላይ',
    'users.suspended': 'የታገዱ',
    'users.search': 'በስም፣ ኢሜይል ወይም ስልክ ይፈልጉ...',
    'users.contact': 'ግንኙነት',
    'users.walletBalance': 'የኪስ ቦርሳ ሂሳብ',
    'users.lastActive': 'የመጨረሻ እንቅስቃሴ',
    
    // User Permissions
    'permissions.title': 'የተጠቃሚ ፈቃድ አስተዳደር',
    'permissions.subtitle': 'ተጠቃሚዎችን መፍጠርና ለሁሉም የተጠቃሚ ዓይነቶች ፈቃዶችን ማስተዳደር',
    'permissions.addUser': 'ተጠቃሚ ጨምር',
    'permissions.grantPermission': 'ፈቃድ ስጥ',
    'permissions.administrators': 'አስተዳዳሪዎች',
    'permissions.staffMembers': 'ሰራተኞች',
    'permissions.partners': 'አጋሮች',
    'permissions.activePermissions': 'ንቁ ፈቃዶች',
    
    // Forms
    'form.fullName': 'ሙሉ ስም',
    'form.fullNameAmharic': 'ሙሉ ስም (አማርኛ)',
    'form.email': 'ኢሜይል አድራሻ',
    'form.phone': 'ስልክ ቁጥር',
    'form.userRole': 'የተጠቃሚ ሚና',
    'form.userType': 'የተጠቃሚ ዓይነት',
    'form.organization': 'ድርጅት',
    'form.studentId': 'የተማሪ መለያ',
    'form.employeeId': 'የሰራተኛ መለያ',
    'form.governmentId': 'የመንግስት መለያ',
    'form.subscriptionType': 'የደንበኝነት ዓይነት',
    'form.save': 'አስቀምጥ',
    'form.cancel': 'ሰርዝ',
    'form.create': 'ፍጠር',
    'form.update': 'አዘምን',
    'form.delete': 'ሰርዝ',
    'form.required': 'ያስፈልጋል',
    
    // Common
    'common.loading': 'በመጫን ላይ...',
    'common.search': 'ፈልግ',
    'common.filter': 'ማጣሪያ',
    'common.actions': 'እርምጃዎች',
    'common.status': 'ሁኔታ',
    'common.active': 'ንቁ',
    'common.inactive': 'ንቁ ያልሆነ',
    'common.yes': 'አዎ',
    'common.no': 'አይ',
    'common.close': 'ዝጋ',
    'common.view': 'ተመልከት',
    'common.edit': 'አርትዕ',
    'common.export': 'ወደ ውጭ ላክ',
    'common.import': 'ከውጭ አምጣ',
    
    // Status messages
    'status.success': 'ተሳክቷል',
    'status.error': 'ስህተት',
    'status.warning': 'ማስጠንቀቂያ',
    'status.info': 'መረጃ',
    
    // Ethiopian specific
    'ethiopia.addisAbaba': 'አዲስ አበባ',
    'ethiopia.servingAddis': 'የአዲስ አበባ አገልግሎት',
    'ethiopia.bikeService': 'የአዲስ አበባ ብስክሌት አገልግሎት',
    'ethiopia.currency': 'ብር',
    
    // Payment methods
    'payment.telebirr': 'ቴሌብር',
    'payment.cbeBirr': 'ሲቢኢ ብር',
    'payment.dashenBank': 'ዳሽን ባንክ',
    'payment.awashBank': 'አዋሽ ባንክ',
    'payment.cash': 'ጥሬ ገንዘብ',
    'payment.wallet': 'ኪስ ቦርሳ',
    
    // Locations
    'location.meskelSquare': 'መስቀል አደባባይ',
    'location.boleAirport': 'ቦሌ አየር ማረፊያ',
    'location.piazza': 'ፒያሳ',
    'location.mexicoSquare': 'ሜክሲኮ አደባባይ',
    'location.mercato': 'መርካቶ',
    'location.unityPark': 'አንድነት ፓርክ',
    
    // Time
    'time.now': 'አሁን',
    'time.minutesAgo': 'ደቂቃዎች በፊት',
    'time.hoursAgo': 'ሰዓቶች በፊት',
    'time.daysAgo': 'ቀናት በፊት',
    'time.weeksAgo': 'ሳምንታት በፊት',
    'time.monthsAgo': 'ወራት በፊት',
    'time.lastChecked': 'የመጨረሻ ምርመራ',
    
    // Holidays
    'holiday.timkat': 'ጥምቀት',
    'holiday.meskel': 'መስቀል',
    'holiday.newYear': 'እንቁጣጣሽ',
    'holiday.adwa': 'የአድዋ ድል በዓል',
    'holiday.religious': 'ሃይማኖታዊ',
    'holiday.cultural': 'ባህላዊ',
    'holiday.national': 'ብሔራዊ'
  },
  
  or: {
    // Navigation (Oromo)
    'nav.dashboard': 'Gabatee Hojii',
    'nav.bikes': 'Bulchiinsa Biskileetii',
    'nav.users': 'Bulchiinsa Fayyadamtootaa',
    'nav.userTypes': 'Gosoota Fayyadamtootaa',
    'nav.permissions': 'Hayyama Fayyadamtootaa',
    'nav.reports': 'Gabaasa Maallaqaa',
    
    // Dashboard
    'dashboard.title': 'Gabatee Hojii',
    'dashboard.welcome': 'Baga nagaan dhuftan! Harʼa Biskileet irratti maal akka taʼaa jiru kunoo.',
    'dashboard.totalBikes': 'Biskileetota Waligalaa',
    'dashboard.activeUsers': 'Fayyadamtoota Sochii',
    'dashboard.dailyRevenue': 'Galii Guyyaa',
    'dashboard.activeRides': 'Imala Sochii',
    'dashboard.recentActivity': 'Sochii Dhiyoo',
    'dashboard.systemAlerts': 'Akeekkachiisa Sirna',
    'dashboard.popularLocations': 'Bakkoota Jaallatamoo',
    'dashboard.ethiopianHolidays': 'Ayyaanota fi Taateewwan Itoophiyaa',
    
    // Bike Management
    'bikes.title': 'Bulchiinsa Biskileetii',
    'bikes.subtitle': 'Biskileetota hunda bulchuu fi hordofuu',
    'bikes.addNew': 'Biskileetii Haaraa Dabaluu',
    'bikes.available': 'Qophaaʼe',
    'bikes.inUse': 'Fayyadama Keessa',
    'bikes.maintenance': 'Suphaa',
    'bikes.lowBattery': 'Baatirii Gadi Aanaa',
    'bikes.search': 'Koodii, moodeelii ykn bakka...',
    'bikes.status': 'Haala',
    'bikes.battery': 'Baatirii',
    'bikes.location': 'Bakka',
    'bikes.totalRides': 'Imala Waligalaa',
    'bikes.actions': 'Gochaalee',
    
    // User Management
    'users.title': 'Bulchiinsa Fayyadamtootaa',
    'users.subtitle': 'Akkaawuntii fayyadamtootaa, mirkaneessaa fi deeggarsa bulchuu',
    'users.totalUsers': 'Fayyadamtoota Waligalaa',
    'users.verified': 'Mirkanaaʼan',
    'users.pending': 'Eegaa',
    'users.suspended': 'Dhaabamanis',
    'users.search': 'Maqaa, imeelii ykn bilbilaan barbaadi...',
    'users.contact': 'Qunnamtii',
    'users.walletBalance': 'Baalaansii Korojoo',
    'users.lastActive': 'Sochii Dhumaa',
    
    // User Permissions
    'permissions.title': 'Bulchiinsa Hayyama Fayyadamtootaa',
    'permissions.subtitle': 'Fayyadamtoota uumuu fi gosootaa hundaaf hayyama bulchuu',
    'permissions.addUser': 'Fayyadamaa Dabaluu',
    'permissions.grantPermission': 'Hayyama Kennuu',
    'permissions.administrators': 'Bulchitootaa',
    'permissions.staffMembers': 'Miseensota Hojjettootaa',
    'permissions.partners': 'Michootaa',
    'permissions.activePermissions': 'Hayyamawwan Sochii',
    
    // Forms
    'form.fullName': 'Maqaa Guutuu',
    'form.fullNameAmharic': 'Maqaa Guutuu (Amaaraa)',
    'form.email': 'Teessoo Imeelii',
    'form.phone': 'Lakkoofsa Bilbilaa',
    'form.userRole': 'Gahee Fayyadamaa',
    'form.userType': 'Gosa Fayyadamaa',
    'form.organization': 'Dhaabbata',
    'form.studentId': 'Eenyummaa Barataa',
    'form.employeeId': 'Eenyummaa Hojjettuu',
    'form.governmentId': 'Eenyummaa Mootummaa',
    'form.subscriptionType': 'Gosa Maamilummaa',
    'form.save': 'Olkaaʼi',
    'form.cancel': 'Dhiisi',
    'form.create': 'Uumi',
    'form.update': 'Haaromsi',
    'form.delete': 'Balleessi',
    'form.required': 'Barbaachisaa',
    
    // Common
    'common.loading': 'Fe\'aa jira...',
    'common.search': 'Barbaadi',
    'common.filter': 'Calaluu',
    'common.actions': 'Gochaalee',
    'common.status': 'Haala',
    'common.active': 'Sochii',
    'common.inactive': 'Sochii Hin Taane',
    'common.yes': 'Eeyyee',
    'common.no': 'Lakki',
    'common.close': 'Cufii',
    'common.view': 'Ilaali',
    'common.edit': 'Gulaalii',
    'common.export': 'Alatti Erguu',
    'common.import': 'Keessatti Fiduu',
    
    // Status messages
    'status.success': 'Milkaaʼe',
    'status.error': 'Dogongora',
    'status.warning': 'Akeekkachiisa',
    'status.info': 'Odeeffannoo',
    
    // Ethiopian specific
    'ethiopia.addisAbaba': 'Finfinnee',
    'ethiopia.servingAddis': 'Tajaajila Finfinnee',
    'ethiopia.bikeService': 'Tajaajila Biskileetii Finfinnee',
    'ethiopia.currency': 'Birr',
    
    // Payment methods
    'payment.telebirr': 'Teelebirr',
    'payment.cbeBirr': 'CBE Birr',
    'payment.dashenBank': 'Baankii Daasheen',
    'payment.awashBank': 'Baankii Awaash',
    'payment.cash': 'Maallaqa Harkaa',
    'payment.wallet': 'Korojoo',
    
    // Locations
    'location.meskelSquare': 'Oromtii Masqalaa',
    'location.boleAirport': 'Buufata Xayyaaraatii Boolee',
    'location.piazza': 'Piyaazaa',
    'location.mexicoSquare': 'Oromtii Meksikoo',
    'location.mercato': 'Markaatoo',
    'location.unityPark': 'Paarkii Tokkummaa',
    
    // Time
    'time.now': 'amma',
    'time.minutesAgo': 'daqiiqoota dura',
    'time.hoursAgo': 'saʼaatii dura',
    'time.daysAgo': 'guyyoota dura',
    'time.weeksAgo': 'torbanootaa dura',
    'time.monthsAgo': 'jiʼoota dura',
    'time.lastChecked': 'Qormaata dhumaa',
    
    // Holidays
    'holiday.timkat': 'Timqat',
    'holiday.meskel': 'Masqal',
    'holiday.newYear': 'Bara Haaraa Itoophiyaa',
    'holiday.adwa': 'Ayyaana Moʼaa Adwaa',
    'holiday.religious': 'Amantii',
    'holiday.cultural': 'Aadaa',
    'holiday.national': 'Biyyaalessaa'
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get saved language from localStorage or default to English
    return localStorage.getItem('bisklet-language') || 'en';
  });

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('bisklet-language', language);
    
    // Set document direction for RTL languages (if needed in future)
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Translation function with improved fallback
  const t = (key: string, fallback?: string): string => {
    // Handle simple keys without dots
    if (!key.includes('.')) {
      return fallback || key;
    }

    const keys = key.split('.');
    let value: any = translations[language as keyof typeof translations];
    
    // Navigate through the nested object
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }
    
    // If translation not found, try English as fallback
    if (!value && language !== 'en') {
      let englishValue: any = translations.en;
      for (const k of keys) {
        if (englishValue && typeof englishValue === 'object') {
          englishValue = englishValue[k];
        } else {
          englishValue = undefined;
          break;
        }
      }
      value = englishValue;
    }
    
    // Return the translation, fallback, or a clean version of the key
    return value || fallback || key.split('.').pop() || key;
  };

  const isRTL = language === 'ar'; // For future Arabic support

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};