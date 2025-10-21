import { Pencil } from 'lucide-react'

interface EditButtonProps {
  onEdit: () => void
}

function EditButton({ onEdit }: EditButtonProps) {
  return (
    <button
      onClick={onEdit}
      className="p-1 rounded bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-lg cursor-pointer"
      title="텍스트 편집 (더블클릭)"
    >
      <Pencil size={13} />
    </button>
  )
}

export default EditButton
