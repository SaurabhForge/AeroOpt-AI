import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useAppStore from '../store/useAppStore';

let socket = null;

export function useSocket() {
  const addLiveEvent = useAppStore(s => s.addLiveEvent);

  useEffect(() => {
    if (!socket) {
      const socketUrl = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
        : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
          ? 'https://aeroopt-ai-backend.onrender.com'
          : 'http://localhost:5000';
      socket = io(socketUrl, { withCredentials: true });
    }

    const events = ['resource:updated', 'schedule:proposed', 'schedule:approved', 'schedule:rejected', 'scenario:complete'];
    events.forEach(event => {
      socket.on(event, (data) => addLiveEvent({ event, data, timestamp: new Date().toISOString() }));
    });

    return () => events.forEach(e => socket.off(e));
  }, [addLiveEvent]);

  return socket;
}
