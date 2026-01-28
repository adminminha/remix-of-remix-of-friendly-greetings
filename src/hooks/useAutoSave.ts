import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AutoSaveOptions {
  interval?: number; // Auto-save interval in milliseconds (default: 30000 = 30 seconds)
  debounceDelay?: number; // Debounce delay for manual triggers (default: 2000 = 2 seconds)
}

interface AutoSaveState {
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
}

export function useAutoSave(
  projectId: string | undefined,
  options: AutoSaveOptions = {}
) {
  const { interval = 30000, debounceDelay = 2000 } = options;
  
  const [state, setState] = useState<AutoSaveState>({
    isSaving: false,
    lastSaved: null,
    error: null,
  });
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasChangesRef = useRef(false);

  // Save function - updates project's updated_at timestamp
  const save = useCallback(async () => {
    if (!projectId || state.isSaving) return false;

    setState(prev => ({ ...prev, isSaving: true, error: null }));

    try {
      const { error } = await supabase
        .from('projects')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', projectId);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        isSaving: false,
        lastSaved: new Date(),
        error: null,
      }));
      
      hasChangesRef.current = false;
      return true;
    } catch (error: any) {
      console.error('Auto-save error:', error);
      setState(prev => ({
        ...prev,
        isSaving: false,
        error: error.message || 'Failed to save',
      }));
      return false;
    }
  }, [projectId, state.isSaving]);

  // Mark that changes have been made (triggers debounced save)
  const markChanged = useCallback(() => {
    hasChangesRef.current = true;

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      if (hasChangesRef.current) {
        save();
      }
    }, debounceDelay);
  }, [save, debounceDelay]);

  // Manual save (bypasses debounce)
  const saveNow = useCallback(async () => {
    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    return save();
  }, [save]);

  // Set up auto-save interval
  useEffect(() => {
    if (!projectId) return;

    // Auto-save at regular intervals if there are changes
    intervalRef.current = setInterval(() => {
      if (hasChangesRef.current && !state.isSaving) {
        save();
      }
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [projectId, interval, save, state.isSaving]);

  // Format last saved time
  const getLastSavedText = useCallback(() => {
    if (!state.lastSaved) return null;
    
    const now = new Date();
    const diff = now.getTime() - state.lastSaved.getTime();
    
    if (diff < 60000) {
      return 'Just now';
    } else if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} min ago`;
    } else {
      return state.lastSaved.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  }, [state.lastSaved]);

  return {
    isSaving: state.isSaving,
    lastSaved: state.lastSaved,
    lastSavedText: getLastSavedText(),
    error: state.error,
    save: saveNow,
    markChanged,
  };
}
