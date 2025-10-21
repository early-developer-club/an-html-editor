import { Image, Paperclip } from 'lucide-react'
import { useState } from 'react'

interface ImageEditButtonProps {
  currentSrc: string
  onUpdate: (newSrc: string) => void
}

function ImageEditButton({ currentSrc, onUpdate }: ImageEditButtonProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newSrc, setNewSrc] = useState(currentSrc)

  const handleSave = () => {
    if (newSrc.trim() !== '') {
      onUpdate(newSrc.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setNewSrc(currentSrc)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="fixed z-50 -translate-x-2/3 flex items-center gap-1 p-2 bg-white border border-gray-300 rounded shadow-lg">
        <button className="p-1 cursor-pointer rounded hover:bg-gray-200">
          <Paperclip size={13} />
        </button>
        <input
          type="text"
          value={newSrc}
          onChange={(e) => setNewSrc(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSave()
            } else if (e.key === 'Escape') {
              handleCancel()
            }
          }}
          className="px-2 py-1 text-xs border border-gray-300 rounded w-72 focus:outline-none focus:border-blue-500"
          placeholder="이미지 URL을 입력하세요"
          autoFocus
        />
        <button
          onClick={handleSave}
          className="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          확인
        </button>
        <button
          onClick={handleCancel}
          className="px-2 py-1 text-xs text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
        >
          취소
        </button>
      </div>
    )
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditing(true)
  }

  return (
    <button
      onMouseDown={(e) => e.preventDefault()} // 포커스 이동 방지
      onClick={handleClick}
      className="p-1 rounded bg-white border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 shadow-lg cursor-pointer"
      title="이미지 URL 변경"
    >
      <Image size={13} />
    </button>
  )
}

export default ImageEditButton
