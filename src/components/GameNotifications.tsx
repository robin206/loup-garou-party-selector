
import React from 'react';
import { GameNotification } from '@/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Heart, Leaf, AlertTriangle, InfoIcon, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameNotificationsProps {
  notifications: GameNotification[];
  onDismiss: (id: string) => void;
}

const GameNotifications: React.FC<GameNotificationsProps> = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) return null;

  const getIconForType = (type: GameNotification['type'], icon?: React.ReactNode) => {
    if (icon) return icon;
    
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <InfoIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertClass = (type: GameNotification['type']) => {
    switch (type) {
      case 'warning':
        return 'border-amber-500/30 bg-amber-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      default:
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  return (
    <div className="w-full space-y-2 mt-3">
      {notifications.map((notification) => (
        <Alert 
          key={notification.id} 
          className={cn(
            "flex items-start justify-between animate-fade-in", 
            getAlertClass(notification.type)
          )}
        >
          <div className="flex">
            <span className="mr-2">
              {getIconForType(notification.type, notification.icon)}
            </span>
            <div>
              <AlertTitle className="text-sm">
                {notification.type === 'warning' && 'Attention'}
                {notification.type === 'error' && 'Erreur'}
                {notification.type === 'success' && 'Succès'}
                {notification.type === 'info' && 'Information'}
              </AlertTitle>
              <AlertDescription className="text-sm">
                {notification.message}
              </AlertDescription>
            </div>
          </div>
          <button 
            onClick={() => onDismiss(notification.id)} 
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </Alert>
      ))}
    </div>
  );
};

export default GameNotifications;
