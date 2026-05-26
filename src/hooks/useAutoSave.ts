import { useEffect, useRef, useState } from 'react';

export enum AutoSaveStatus {
  Idle = 'idle',
  Saving = 'saving',
  Saved = 'saved',
  Error = 'error',
}

interface UseAutoSaveResult {
  status: AutoSaveStatus;
  error: string | null;
  retry: () => void;
}

export function useAutoSave<T>(
  value: T,
  saveFn: (nextValue: T) => Promise<void>,
  delay = 1500,
  enabled = true
): UseAutoSaveResult {
  const [status, setStatus] = useState<AutoSaveStatus>(AutoSaveStatus.Idle);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  // Keep the latest value outside the timeout closure so the newest edit wins.
  const latestValueRef = useRef(value);
  // Store the current save callback so retry can reuse the exact same payload path.
  const pendingSaveRef = useRef<(() => Promise<void>) | null>(null);
  // Skip the initial render: loading the first value should not count as a save.
  const hasMountedRef = useRef(false);

  useEffect(() => {
    latestValueRef.current = value;

    if (!enabled) {
      return;
    }

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

      setStatus(AutoSaveStatus.Saving);
    setError(null);

    const scheduleSave = async () => {
      try {
        await saveFn(latestValueRef.current);
        setStatus(AutoSaveStatus.Saved);
      } catch (saveError) {
        setStatus(AutoSaveStatus.Error);
        setError(saveError instanceof Error ? saveError.message : 'No se pudo guardar');
      }
    };

    pendingSaveRef.current = scheduleSave;
    timeoutRef.current = window.setTimeout(() => {
      void scheduleSave();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [delay, enabled, saveFn, value]);

  const retry = () => {
    if (!pendingSaveRef.current) return;
    setStatus(AutoSaveStatus.Saving);
    setError(null);
    void pendingSaveRef.current();
  };

  return { status, error, retry };
}
