import { create } from 'zustand';
import { College } from '@/types';

interface FilterState {
  search: string;
  location: string;
  minFees: number;
  maxFees: number;
  rating: number;
  ownershipType: string;
  courseType: string;
  sortBy: 'rating' | 'fees' | 'placement';
  sortOrder: 'asc' | 'desc';
}

const initialFilters: FilterState = {
  search: '',
  location: '',
  minFees: 0,
  maxFees: 1500000,
  rating: 0,
  ownershipType: '',
  courseType: '',
  sortBy: 'rating',
  sortOrder: 'desc',
};

interface AppStore {
  // Compare State
  compareColleges: College[];
  addToCompare: (college: College) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;

  // Filter State
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;

  // Saved State
  savedCollegeIds: string[];
  setSavedCollegeIds: (ids: string[]) => void;
  toggleSavedCollegeIdLocal: (id: string) => void;

  // Aurora Glassmorphic Theme State
  isAuroraMode: boolean;
  setIsAuroraMode: (val: boolean) => void;
}

export const useStore = create<AppStore>((set) => ({
  // Compare state
  compareColleges: [],
  addToCompare: (college) =>
    set((state) => {
      // Check if already exists
      if (state.compareColleges.find((c) => c.id === college.id)) {
        return state;
      }
      // Limit to 3 colleges maximum
      if (state.compareColleges.length >= 3) {
        return {
          compareColleges: [...state.compareColleges.slice(1), college],
        };
      }
      return { compareColleges: [...state.compareColleges, college] };
    }),
  removeFromCompare: (id) =>
    set((state) => ({
      compareColleges: state.compareColleges.filter((c) => c.id !== id),
    })),
  clearCompare: () => set({ compareColleges: [] }),

  // Filter state
  filters: initialFilters,
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),
  resetFilters: () => set({ filters: initialFilters }),

  // Saved state cache
  savedCollegeIds: [],
  setSavedCollegeIds: (ids) => set({ savedCollegeIds: ids }),
  toggleSavedCollegeIdLocal: (id) =>
    set((state) => {
      const exists = state.savedCollegeIds.includes(id);
      return {
        savedCollegeIds: exists
          ? state.savedCollegeIds.filter((cid) => cid !== id)
          : [...state.savedCollegeIds, id],
      };
    }),

  // Aurora Glassmorphic Theme state
  isAuroraMode: true, // Default to true to WOW the user on load!
  setIsAuroraMode: (val) => set({ isAuroraMode: val }),
}));
export default useStore;
