import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { useClickOutside } from '../../hooks/useClickOutside';
import { formatRelativeTime } from '../../utils/formatDate';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef();

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    setIsOpen(false);
  };

  const getNotificationLink = (notification) => {
    if (notification.post) return `/blog/${notification.post.slug}`;
    if (notification.sender) return `/profile/${notification.sender._id}`;
    return '#';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-secondary hover:text-text-primary transition-colors rounded-full hover:bg-bg-elevated"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-danger opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-danger"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-bg-secondary border border-border-subtle rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-bg-elevated">
            <h3 className="font-display font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-accent-highlight hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-text-tertiary">
                <p>No notifications yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border-subtle">
                {notifications.map((notification) => (
                  <Link
                    key={notification._id}
                    to={getNotificationLink(notification)}
                    onClick={() => handleNotificationClick(notification)}
                    className={`block p-4 hover:bg-bg-hover transition-colors ${
                      !notification.read ? 'bg-bg-elevated/50' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      {notification.sender && (
                        <img
                          src={notification.sender.profileImage || 'https://via.placeholder.com/40'}
                          alt={notification.sender.name}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      )}
                      <div>
                        <p className="text-sm">
                          <span className="font-semibold text-text-primary">
                            {notification.sender?.name}
                          </span>{' '}
                          {notification.type === 'like' && 'liked your post'}
                          {notification.type === 'comment' && 'commented on your post'}
                          {notification.type === 'reply' && 'replied to your comment'}
                          {notification.type === 'follow' && 'started following you'}
                        </p>
                        <p className="text-xs text-text-tertiary mt-1">
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="ml-auto flex-shrink-0 w-2 h-2 rounded-full bg-accent-highlight mt-2" />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
