import React from 'react';
import colorMap from './ColorMap';
import { Link } from '@inertiajs/react';
import { CheckCircle, CircleX, Info, TriangleAlert } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '../../Context/ThemeContext';
import useThemeStyles from '../../Hooks/useThemeStyles';

const NotificationCard = ({notification, onClick}) => {
  const { theme } = useTheme();
  const { textColor } = useThemeStyles(theme);
  const createdAt = new Date(notification?.created_at);
  const CreatedtimeAgo = formatDistanceToNow(createdAt, { addSuffix: true });


  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
      <Link className={`flex p-2 ${theme == 'bg-skin-blue' ? 'hover:bg-gray-100' : 'hover:bg-white/10'} items-center rounded-md`} href={`/notifications/view/${notification?.id}`} onClick={(e) => onClick(e, notification.id, notification.url)}>
        <div className='px-2 mb-4'>
          {notification?.type === 'info' && <Info className='w-4 h-4 text-blue-500'/>}
          {notification?.type === 'success' && <CheckCircle className='w-4 h-4 text-green-500'/>}
          {notification?.type === 'error' && <CircleX className='w-4 h-4 text-red-500'/>}
          {notification?.type === 'warning' && <TriangleAlert className='w-4 h-4 text-yellow-500'/>}
        </div>
        <div className='flex-1 ml-1'>
          <p className={`text-xs ${notification?.is_read == 0 ? textColor : 'text-gray-500'}`}>{notification?.title}</p>
          <p className='text-[10px] truncate text-gray-600'>{truncateText(notification?.content, 50)}</p>
          <p className='text-[8px] md:text-[10px] text-gray-400'>{CreatedtimeAgo}</p>
        </div>
        {notification?.is_read == 0 && <div className='w-1.5 h-1.5 bg-green-500 rounded-full mr-1'/>}
        
      </Link>
  );
};

export default NotificationCard;
