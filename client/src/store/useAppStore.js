import { create } from 'zustand';

const useAppStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('aeroopt_user') || 'null'),
  token: localStorage.getItem('aeroopt_token') || null,

  setAuth: (user, token) => {
    localStorage.setItem('aeroopt_token', token);
    localStorage.setItem('aeroopt_user', JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('aeroopt_token');
    localStorage.removeItem('aeroopt_user');
    set({ user: null, token: null });
  },

  // Live data updated via Socket.IO
  liveEvents: [],
  addLiveEvent: (event) => set(s => ({ liveEvents: [event, ...s.liveEvents].slice(0, 50) })),
}));

export default useAppStore;
