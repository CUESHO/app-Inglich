import { create } from 'zustand';

interface GameState {
  userId: string | null;
  userLevel: number;
  userXP: number;
  userCoins: number;
  currentWorld: number;
  currentMission: number;
  setUser: (userId: string, level: number, xp: number, coins: number) => void;
  updateXP: (xp: number) => void;
  updateCoins: (coins: number) => void;
  setCurrentWorld: (world: number) => void;
  setCurrentMission: (mission: number) => void;
  logout: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  userId: null,
  userLevel: 1,
  userXP: 0,
  userCoins: 0,
  currentWorld: 1,
  currentMission: 1,
  
  setUser: (userId, level, xp, coins) =>
    set({
      userId,
      userLevel: level,
      userXP: xp,
      userCoins: coins,
    }),
  
  updateXP: (xp) =>
    set((state) => ({
      userXP: state.userXP + xp,
    })),
  
  updateCoins: (coins) =>
    set((state) => ({
      userCoins: state.userCoins + coins,
    })),
  
  setCurrentWorld: (world) =>
    set({ currentWorld: world }),
  
  setCurrentMission: (mission) =>
    set({ currentMission: mission }),
  
  logout: () =>
    set({
      userId: null,
      userLevel: 1,
      userXP: 0,
      userCoins: 0,
      currentWorld: 1,
      currentMission: 1,
    }),
}));
