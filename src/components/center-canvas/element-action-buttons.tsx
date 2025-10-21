import type { AHTMLElement } from '../../types/editor'
import DeleteButton from './delete-button'
import EditButton from './edit-button'
import ImageEditButton from './image-edit-button'
import { findElement, isImageElement, isTextOnlyElement } from './utils'

interface ElementActionButtonsProps {
  elementId: string
  elements: AHTMLElement[]
  position: { top: number; right: number }
  onDelete: () => void
  onEdit: () => void
  onUpdateImage: (newSrc: string) => void
}

function ElementActionButtons({
  elementId,
  elements,
  position,
  onDelete,
  onEdit,
  onUpdateImage,
}: ElementActionButtonsProps) {
  const element = findElement(elementId, elements)
  const isText = isTextOnlyElement(elementId, elements)
  const isImage = isImageElement(elementId, elements)
  return (
    <div
      className="fixed z-50 flex gap-1"
      style={{
        top: `${position.top}px`,
        right: `${position.right}px`,
      }}
    >
      {/* 텍스트 요소: 편집 버튼 */}
      {isText && <EditButton onEdit={onEdit} />}

      {/* 이미지 요소: 이미지 URL 변경 버튼 */}
      {isImage && element && (
        <ImageEditButton
          currentSrc={element.src || ''}
          onUpdate={onUpdateImage}
        />
      )}

      {/* 모든 요소: 삭제 버튼 */}
      <DeleteButton onDelete={onDelete} />
    </div>
  )
}

export default ElementActionButtons
