import { Trash2 } from 'lucide-react'

interface DeleteButtonProps {
  onDelete: () => void
}

function DeleteButton({ onDelete }: DeleteButtonProps) {
  return (
    <button
      onClick={onDelete}
      className="p-1 rounded bg-white border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-lg cursor-pointer"
      title="선택된 요소 삭제"
    >
      <Trash2 size={13} />
    </button>
  )
}

export default DeleteButton
