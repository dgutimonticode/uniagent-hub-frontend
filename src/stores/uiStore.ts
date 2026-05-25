// UniAgent Hub - UI Store
// Zustand store for ephemeral UI state (sidebar, command palette, global dialogs).

import { create } from 'zustand';
import { Agente } from '@/types';

interface UIState {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  agentEditorOpen: boolean;
  agentEditorTarget: Agente | null;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  openAgentEditor: (agent?: Agente | null) => void;
  closeAgentEditor: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  agentEditorOpen: false,
  agentEditorTarget: null,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  openAgentEditor: (agent = null) => set({ agentEditorOpen: true, agentEditorTarget: agent }),
  closeAgentEditor: () => set({ agentEditorOpen: false, agentEditorTarget: null }),
}));
