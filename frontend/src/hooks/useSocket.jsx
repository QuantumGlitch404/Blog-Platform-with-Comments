import { io } from 'socket.io-client';
import { useEffect, useRef } from 'react';

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Only connect if not already connected
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_URL, {
        withCredentials: true,
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return socketRef.current;
};
