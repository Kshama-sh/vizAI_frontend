import { create } from "zustand";

const useQueryStore = create((set) => ({
  selectedQuery: null,
  setSelectedQuery: (query) => set({ selectedQuery: query }),
}));

export default useQueryStore;
