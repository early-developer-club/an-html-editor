import { useRef, useState } from 'react'
import { useEditorStore } from '../../stores/editor-store'
import CanvasIframe from './canvas-iframe'
import ElementActionButtons from './element-action-buttons'
import EmptyState from './empty-state'
import HistoryButtons from './history-buttons'
import { useDeleteButtonPosition } from './hooks/use-delete-button-position'
import { useKeyboardShortcuts } from './hooks/use-keyboard-shortcuts'
import { useTextEditTrigger } from './hooks/use-text-edit-trigger'

function CenterCanvas() {
  const elements = useEditorStore((state) => state.elements)
  const documentMetadata = useEditorStore((state) => state.documentMetadata)
  const selectedElementId = useEditorStore((state) => state.selectedElementId)
  const selectElement = useEditorStore((state) => state.selectElement)
  const updateElement = useEditorStore((state) => state.updateElement)
  const deleteElement = useEditorStore((state) => state.deleteElement)
  const undo = useEditorStore((state) => state.undo)
  const redo = useEditorStore((state) => state.redo)
  const history = useEditorStore((state) => state.history)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [editingElementId, setEditingElementId] = useState<string | null>(null)
  const [editTrigger, setEditTrigger] = useState<string | null>(null)

  // 삭제 버튼 위치
  const deleteButtonPos = useDeleteButtonPosition({
    iframeRef,
    selectedElementId,
  })

  // 키보드 단축키
  useKeyboardShortcuts({ onUndo: undo, onRedo: redo })

  // 텍스트 편집 트리거
  useTextEditTrigger({
    iframeRef,
    elementId: editTrigger,
    onSetEditingElementId: setEditingElementId,
  })

  // 편집 버튼 클릭 핸들러
  const handleEdit = () => {
    if (selectedElementId) {
      setEditTrigger(selectedElementId)
      // 트리거 후 리셋 (재트리거 가능하도록)
      setTimeout(() => setEditTrigger(null), 300)
    }
  }

  // 이미지 URL 업데이트 핸들러
  const handleUpdateImage = (newSrc: string) => {
    if (selectedElementId) {
      updateElement(selectedElementId, { src: newSrc })
    }
  }

  return (
    <div className="relative flex flex-col overflow-hidden bg-canvas-bg">
      {/* Undo/Redo 버튼 */}
      <HistoryButtons
        canUndo={history.past.length > 0}
        canRedo={history.future.length > 0}
        onUndo={undo}
        onRedo={redo}
      />

      {/* 선택된 요소 액션 버튼들 */}
      {selectedElementId && deleteButtonPos && (
        <ElementActionButtons
          elementId={selectedElementId}
          elements={elements}
          position={deleteButtonPos}
          isEditing={editingElementId === selectedElementId}
          onDelete={() => deleteElement(selectedElementId)}
          onEdit={handleEdit}
          onUpdateImage={handleUpdateImage}
        />
      )}

      <div className="flex items-start justify-center flex-1 px-5 py-10 overflow-x-hidden overflow-y-auto">
        {elements.length === 0 ? (
          <EmptyState />
        ) : (
          <CanvasIframe
            iframeRef={iframeRef}
            elements={elements}
            documentMetadata={documentMetadata}
            selectedElementId={selectedElementId}
            editingElementId={editingElementId}
            onSelectElement={selectElement}
            onUpdateElement={updateElement}
            onSetEditingElementId={setEditingElementId}
          />
        )}
      </div>
    </div>
  )
}

export default CenterCanvas
