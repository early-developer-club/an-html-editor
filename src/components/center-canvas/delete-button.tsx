import { Trash2 } from 'lucide-react'

interface DeleteButtonProps {
  onDelete: () => void
}

function DeleteButton({ onDelete }: DeleteButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete()
  }

  return (
    <button
      onMouseDown={(e) => e.preventDefault()} // 포커스 이동 방지
      onClick={handleClick}
      className="p-1 rounded bg-white border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-lg cursor-pointer"
      title="선택된 요소 삭제"
    >
      <Trash2 size={13} />
    </button>
  )
}

export default DeleteButton
