import { useUIStore } from '@/stores/uiStore';
import { AgentEditorDialog } from './AgentDialogs';

export function GlobalAgentEditor() {
  const open = useUIStore((state) => state.agentEditorOpen);
  const target = useUIStore((state) => state.agentEditorTarget);
  const close = useUIStore((state) => state.closeAgentEditor);

  return (
    <AgentEditorDialog
      key={`global-editor-${open ? (target?.id ?? 'new') : 'closed'}`}
      open={open}
      onOpenChange={(next) => (next ? null : close())}
      agent={target}
    />
  );
}
