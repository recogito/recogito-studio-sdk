import { useEffect } from 'react';
import { type Annotator, useAnnotator } from '@annotorious/react';

export const isMac =
  typeof navigator !== 'undefined' && navigator.userAgent.includes('Mac OS X');

const isEditable = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

export const useUndoRedoKeys = () => {
  const anno = useAnnotator<Annotator>();

  useEffect(() => {
    if (!anno) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditable(event.target)) return;

      // Platform's primary modifier
      const primary = isMac ? event.metaKey : event.ctrlKey;
      const other = isMac ? event.ctrlKey : event.metaKey;
      if (!primary || other || event.altKey) return;

      const key = event.key.toLowerCase();
      const isUndo = key === 'z' && !event.shiftKey;
      const isRedo =
        (key === 'z' && event.shiftKey) ||
        (!isMac && key === 'y' && !event.shiftKey);

      if (!isUndo && !isRedo) return;

      event.preventDefault();

      if (isUndo) 
        anno.undo();
      else 
        anno.redo();
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    }
  }, [anno]);

}