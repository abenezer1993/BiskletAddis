import React, { useState, useEffect } from 'react';
import { Database, Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const DatabaseStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (error) throw error;
      
      setIsConnected(true);
      setError(null);
      setLastChecked(new Date());
    } catch (err) {
      setIsConnected(false);
      setError(err instanceof Error ? err.message : 'Connection failed');
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (isConnected === null) return 'text-gray-500';
    return isConnected ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = () => {
    if (isConnected === null) return <Database className="w-4 h-4" />;
    if (isConnected) return <CheckCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (isConnected === null) return 'Checking...';
    return isConnected ? 'Connected' : 'Disconnected';
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span>Supabase: {getStatusText()}</span>
      </div>
      {lastChecked && (
        <span className="text-text-secondary text-xs">
          Last checked: {lastChecked.toLocaleTimeString()}
        </span>
      )}
      {error && (
        <div className="text-red-600 text-xs max-w-xs truncate" title={error}>
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default DatabaseStatus;