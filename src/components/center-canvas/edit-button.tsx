import { Pencil } from 'lucide-react'

interface EditButtonProps {
  isEditing: boolean
  onEdit: () => void
}

function EditButton({ isEditing, onEdit }: EditButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onEdit()
  }

  return (
    <button
      onMouseDown={(e) => e.preventDefault()} // 포커스 이동 방지
      onClick={handleClick}
      className={`p-1 rounded bg-white border shadow-lg cursor-pointer ${
        isEditing
          ? 'border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700'
          : 'border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700'
      }`}
      title={isEditing ? '편집 중...' : '텍스트 편집 (더블클릭)'}
    >
      <Pencil size={13} />
    </button>
  )
}

export default EditButton
