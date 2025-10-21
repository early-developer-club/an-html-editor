import { Image, Paperclip } from 'lucide-react'
import { useRef, useState } from 'react'

interface ImageEditButtonProps {
  currentSrc: string
  onUpdate: (newSrc: string) => void
}

function ImageEditButton({ currentSrc, onUpdate }: ImageEditButtonProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newSrc, setNewSrc] = useState(currentSrc)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  // 파일 선택 트리거
  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  // 파일 업로드 처리
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 이미지 파일인지 확인
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.')
      return
    }

    setIsUploading(true)

    try {
      // FormData 생성
      const formData = new FormData()
      formData.append('file', file)

      // API 요청
      const response = await fetch('///', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('이미지 업로드에 실패했습니다.')
      }

      // 서버에서 반환된 URL 추출
      const data = await response.json()
      const imageUrl = data.url || data.imageUrl || data.src

      if (!imageUrl) {
        throw new Error('서버에서 이미지 URL을 반환하지 않았습니다.')
      }

      // URL 입력창에 설정
      setNewSrc(imageUrl)
    } catch (error) {
      console.error('Image upload error:', error)
      alert(
        error instanceof Error
          ? error.message
          : '이미지 업로드 중 오류가 발생했습니다.'
      )
    } finally {
      setIsUploading(false)
      // input 초기화 (같은 파일 재선택 가능하도록)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  if (isEditing) {
    return (
      <div className="fixed z-50 -translate-x-2/3 flex items-center gap-1 p-2 bg-white border border-gray-300 rounded shadow-lg">
        {/* 파일 업로드 버튼 */}
        <button
          onClick={handleFileSelect}
          disabled={isUploading}
          className={`p-1 rounded ${
            isUploading
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer hover:bg-gray-200'
          }`}
          title="파일에서 이미지 선택"
        >
          <Paperclip size={13} />
        </button>

        {/* 숨겨진 파일 input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* URL 입력창 */}
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
          disabled={isUploading}
          className="px-2 py-1 text-xs border border-gray-300 rounded w-72 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          placeholder={isUploading ? '업로드 중...' : '이미지 URL을 입력하세요'}
          autoFocus
        />

        {/* 확인 버튼 */}
        <button
          onClick={handleSave}
          disabled={isUploading}
          className="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          확인
        </button>

        {/* 취소 버튼 */}
        <button
          onClick={handleCancel}
          disabled={isUploading}
          className="px-2 py-1 text-xs text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
