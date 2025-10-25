'use client'

import type { AHTMLElement } from '@/types/html-editor.types'
import { FileCode } from 'lucide-react'
import { useState } from 'react'
import ElementTreeItem from './element-tree-item'
import {
  createElementByType,
  type CreatableElementType,
} from './utils/element-creator'

interface LayersTabProps {
  elements: AHTMLElement[]
  selectedElementId: string | null
  isMetadataSelected: boolean
  hasMetadata: boolean
  onAddElement: (element: AHTMLElement, parentId?: string) => void
  onSelectElement: (id: string | null) => void
  onSelectMetadata: () => void
  onDeleteElement: (id: string) => void
  onMoveElement: (elementId: string, newParentId: string | null) => void
  onReorderElements: (elements: AHTMLElement[]) => void
}

function LayersTab({
  elements,
  selectedElementId,
  isMetadataSelected,
  hasMetadata,
  onAddElement,
  onSelectElement,
  onSelectMetadata,
  onDeleteElement,
  onMoveElement,
  onReorderElements,
}: LayersTabProps) {
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null)
  const [dragOverElementId, setDragOverElementId] = useState<string | null>(
    null
  )
  const [dropPosition, setDropPosition] = useState<
    'before' | 'after' | 'inside' | null
  >(null)
  const [collapsedElements, setCollapsedElements] = useState<Set<string>>(
    new Set()
  )

  const handleAddElement = (type: CreatableElementType) => {
    const parentId = selectedElementId || undefined
    const newElement = createElementByType(type, parentId)
    onAddElement(newElement, parentId)
    setShowAddMenu(false)
  }

  // 드래그 앤 드롭 핸들러
  const handleDragStart = (e: React.DragEvent, elementId: string) => {
    setDraggedElementId(elementId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, elementId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (draggedElementId === elementId) {
      setDragOverElementId(null)
      setDropPosition(null)
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const mouseY = e.clientY - rect.top
    const height = rect.height

    // 상단 25%: before, 중간 50%: inside, 하단 25%: after
    if (mouseY < height * 0.25) {
      setDropPosition('before')
    } else if (mouseY > height * 0.75) {
      setDropPosition('after')
    } else {
      setDropPosition('inside')
    }

    setDragOverElementId(elementId)
  }

  const handleDragEnd = () => {
    setDraggedElementId(null)
    setDragOverElementId(null)
    setDropPosition(null)
  }

  const handleDrop = (e: React.DragEvent, targetElementId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (!draggedElementId || draggedElementId === targetElementId) {
      setDraggedElementId(null)
      setDragOverElementId(null)
      setDropPosition(null)
      return
    }

    const draggedElement = elements.find((el) => el.id === draggedElementId)
    const targetElement = elements.find((el) => el.id === targetElementId)

    if (!draggedElement || !targetElement) {
      setDraggedElementId(null)
      setDragOverElementId(null)
      setDropPosition(null)
      return
    }

    if (dropPosition === 'inside') {
      // 자식으로 삽입
      onMoveElement(draggedElementId, targetElementId)
    } else {
      // 형제로 삽입 (before 또는 after)
      const newElements = [...elements]
      const draggedIndex = newElements.findIndex(
        (el) => el.id === draggedElementId
      )

      // 드래그된 요소 제거
      const [removed] = newElements.splice(draggedIndex, 1)

      // 부모를 target과 같게 설정
      removed.parentId = targetElement.parentId

      // 새로운 위치에 삽입
      const newTargetIndex = newElements.findIndex(
        (el) => el.id === targetElementId
      )
      const insertIndex =
        dropPosition === 'before' ? newTargetIndex : newTargetIndex + 1
      newElements.splice(insertIndex, 0, removed)

      onReorderElements(newElements)
    }

    setDraggedElementId(null)
    setDragOverElementId(null)
    setDropPosition(null)
  }

  // 루트 영역 드롭 (최상위로 이동)
  const handleDropToRoot = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedElementId) {
      onMoveElement(draggedElementId, null)
    }
    setDraggedElementId(null)
    setDragOverElementId(null)
    setDropPosition(null)
  }

  // 요소 접기/펼치기 토글
  const toggleCollapse = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setCollapsedElements((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(elementId)) {
        newSet.delete(elementId)
      } else {
        newSet.add(elementId)
      }
      return newSet
    })
  }

  return (
    <>
      {/* 요소 추가 버튼 */}
      <div className="relative mb-1">
        {/* 메타데이터 레이어 */}
        {hasMetadata && (
          <div
            onClick={onSelectMetadata}
            className={`h-9 flex items-center justify-between p-2 mb-2 text-xs rounded cursor-pointer border ${
              isMetadataSelected
                ? 'bg-item-selected border-blue-500'
                : 'bg-item-bg border-panel-border hover:bg-item-hover'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileCode size={16} className="text-purple-600" />
              <span className="font-semibold">문서 메타데이터</span>
              <span className="text-[10px] text-text-muted opacity-70">
                (HTML head)
              </span>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full h-9 p-2 text-sm text-white border-none rounded cursor-pointer bg-blue-600 hover:bg-blue-700"
        >
          {selectedElementId ? `+ 선택된 요소의 자식으로 추가` : '+ 요소 추가'}
        </button>
        {selectedElementId && (
          <p className="w-full mt-1 text-xs text-text-muted text-center">
            {elements.find((el) => el.id === selectedElementId)?.tagName} 요소의
            자식으로 추가됩니다
          </p>
        )}

        {showAddMenu && (
          <div className="absolute top-full left-0 right-0 mt-1 max-h-[300px] overflow-y-auto z-10 rounded border bg-panel-bg border-panel-border">
            {[
              { type: 'section' as const, label: '섹션 (section)' },
              { type: 'header' as const, label: '헤더 (header)' },
              { type: 'footer' as const, label: '푸터 (footer)' },
              { type: 'div' as const, label: '박스 (div)' },
              { type: 'h1' as const, label: '제목 1 (h1)' },
              { type: 'h2' as const, label: '제목 2 (h2)' },
              { type: 'h3' as const, label: '제목 3 (h3)' },
              { type: 'p' as const, label: '텍스트 (p)' },
              { type: 'img' as const, label: '이미지 (img)' },
              { type: 'button' as const, label: '버튼 (button)' },
            ].map(({ type, label }) => (
              <button
                key={type}
                onClick={() => handleAddElement(type)}
                className="w-full px-3 py-2 text-xs text-left border-none cursor-pointer bg-transparent text-text-primary hover:bg-item-hover"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 요소 목록 */}
      {elements.length === 0 ? (
        <p className="text-sm text-text-muted">
          요소가 없습니다. 샘플 템플릿을 불러오거나 요소를 추가하세요.
        </p>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOverElementId('root')
          }}
          onDragLeave={() => setDragOverElementId(null)}
          onDrop={handleDropToRoot}
          className={`py-1 min-h-[100px] rounded ${dragOverElementId === 'root' ? 'border-2 border-dashed border-blue-500 bg-blue-500/10' : 'border-2 border-dashed border-transparent'}`}
        >
          {elements
            .filter((el) => el.parentId === null)
            .map((element) => (
              <ElementTreeItem
                key={element.id}
                element={element}
                depth={0}
                allElements={elements}
                selectedElementId={selectedElementId}
                draggedElementId={draggedElementId}
                dragOverElementId={dragOverElementId}
                dropPosition={dropPosition}
                collapsedElements={collapsedElements}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                onSelect={onSelectElement}
                onDelete={onDeleteElement}
                onToggleCollapse={toggleCollapse}
              />
            ))}
          {dragOverElementId === 'root' && (
            <div className="p-2 text-xs text-center text-blue-500">
              여기에 놓으면 최상위 요소가 됩니다
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default LayersTab
