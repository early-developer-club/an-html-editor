import { ChevronDown, ChevronRight, Minus } from 'lucide-react'
import type { AHTMLElement } from '../../types/editor'

interface ElementTreeItemProps {
  element: AHTMLElement
  depth: number
  allElements: AHTMLElement[]
  selectedElementId: string | null
  draggedElementId: string | null
  dragOverElementId: string | null
  dropPosition: 'before' | 'after' | 'inside' | null
  collapsedElements: Set<string>
  onDragStart: (e: React.DragEvent, elementId: string) => void
  onDragOver: (e: React.DragEvent, elementId: string) => void
  onDragEnd: () => void
  onDrop: (e: React.DragEvent, elementId: string) => void
  onSelect: (elementId: string) => void
  onDelete: (elementId: string) => void
  onToggleCollapse: (elementId: string, e: React.MouseEvent) => void
}

function ElementTreeItem({
  element,
  depth,
  allElements,
  selectedElementId,
  draggedElementId,
  dragOverElementId,
  dropPosition,
  collapsedElements,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  onSelect,
  onDelete,
  onToggleCollapse,
}: ElementTreeItemProps) {
  const hasChildren =
    allElements.filter((el) => el.parentId === element.id).length > 0
  const isDragging = draggedElementId === element.id
  const isDragOver = dragOverElementId === element.id
  const isCollapsed = collapsedElements.has(element.id)

  // 드롭 위치에 따른 테두리 스타일
  let borderClass = 'border-solid border-panel-border'
  if (isDragOver && dropPosition === 'before') {
    borderClass =
      'border-t-4 border-t-blue-500 border-x border-b border-panel-border'
  } else if (isDragOver && dropPosition === 'after') {
    borderClass =
      'border-b-4 border-b-blue-500 border-x border-t border-panel-border'
  } else if (isDragOver && dropPosition === 'inside') {
    borderClass = 'border-2 border-dashed border-blue-500'
  } else if (!isDragOver) {
    borderClass = 'border border-solid border-panel-border'
  }

  return (
    <div>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, element.id)}
        onDragOver={(e) => onDragOver(e, element.id)}
        onDragEnd={onDragEnd}
        onDrop={(e) => onDrop(e, element.id)}
        onClick={() => onSelect(element.id)}
        style={{
          paddingLeft: `${8 + depth * 16}px`,
          opacity: isDragging ? 0.5 : 1,
        }}
        className={`flex items-center justify-between p-2 mb-0.5 text-xs rounded cursor-grab text-text-primary ${borderClass} ${
          isDragging
            ? 'bg-gray-400 opacity-50'
            : selectedElementId === element.id
              ? 'bg-item-selected'
              : 'bg-item-bg'
        }`}
      >
        <div className="flex items-center gap-1">
          {hasChildren ? (
            <button
              onClick={(e) => onToggleCollapse(element.id, e)}
              className="p-1 hover:bg-item-hover rounded flex items-center justify-center min-w-[20px] min-h-[20px]"
            >
              {isCollapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
          ) : (
            <div className="p-1 flex items-center justify-center min-w-[20px] min-h-[20px] opacity-50 rotate-90">
              <Minus size={16} />
            </div>
          )}
          <span className="flex items-center gap-1.5">
            {element.label ? (
              <>
                <span className="font-semibold">{element.label}</span>
                <span className="text-[10px] text-text-muted opacity-70">
                  ({element.tagName})
                </span>
              </>
            ) : (
              <span>{element.tagName}</span>
            )}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(element.id)
          }}
          className="px-2 py-0.5 text-xs text-white border-none rounded cursor-pointer bg-red-600 hover:bg-red-700"
        >
          삭제
        </button>
      </div>
      {/* 자식 요소 렌더링 - 접혀있지 않을 때만 */}
      {!isCollapsed &&
        allElements
          .filter((el) => el.parentId === element.id)
          .map((child) => (
            <ElementTreeItem
              key={child.id}
              element={child}
              depth={depth + 1}
              allElements={allElements}
              selectedElementId={selectedElementId}
              draggedElementId={draggedElementId}
              dragOverElementId={dragOverElementId}
              dropPosition={dropPosition}
              collapsedElements={collapsedElements}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
              onDrop={onDrop}
              onSelect={onSelect}
              onDelete={onDelete}
              onToggleCollapse={onToggleCollapse}
            />
          ))}
    </div>
  )
}

export default ElementTreeItem
