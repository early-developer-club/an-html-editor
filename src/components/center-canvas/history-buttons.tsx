import { Redo, Undo } from 'lucide-react'

interface HistoryButtonsProps {
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
}

function HistoryButtons({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: HistoryButtonsProps) {
  return (
    <div className="absolute top-4 left-4 z-10 flex gap-1.5">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="p-1.5 rounded border bg-panel-bg border-panel-border text-text-primary hover:bg-item-hover disabled:opacity-30 disabled:cursor-not-allowed"
        title="되돌리기 (Ctrl+Z)"
      >
        <Undo size={14} />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="p-1.5 rounded border bg-panel-bg border-panel-border text-text-primary hover:bg-item-hover disabled:opacity-30 disabled:cursor-not-allowed"
        title="다시 실행 (Ctrl+Y)"
      >
        <Redo size={14} />
      </button>
    </div>
  )
}

export default HistoryButtons
