import { useEffect } from 'react'

interface UseKeyboardShortcutsProps {
  onUndo: () => void
  onRedo: () => void
}

/**
 * 키보드 단축키 처리 (Ctrl+Z, Ctrl+Y)
 */
export function useKeyboardShortcuts({
  onUndo,
  onRedo,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        onUndo()
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        onRedo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onUndo, onRedo])
}
