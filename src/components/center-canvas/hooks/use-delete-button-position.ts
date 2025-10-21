import { useEffect, useState } from 'react'

interface DeleteButtonPosition {
  top: number
  right: number
}

interface UseDeleteButtonPositionProps {
  iframeRef: React.RefObject<HTMLIFrameElement>
  selectedElementId: string | null
}

/**
 * 선택된 요소의 삭제 버튼 위치 계산
 */
export function useDeleteButtonPosition({
  iframeRef,
  selectedElementId,
}: UseDeleteButtonPositionProps) {
  const [deleteButtonPos, setDeleteButtonPos] =
    useState<DeleteButtonPosition | null>(null)

  useEffect(() => {
    if (!selectedElementId || !iframeRef.current) {
      setDeleteButtonPos(null)
      return
    }

    const iframe = iframeRef.current
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

    if (!iframeDoc) return

    const element = iframeDoc.querySelector(
      `[data-element-id="${selectedElementId}"]`
    ) as HTMLElement

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })

      // 삭제 버튼 위치 계산
      const updateDeleteButtonPosition = () => {
        const iframeRect = iframe.getBoundingClientRect()
        const elementRect = element.getBoundingClientRect()

        setDeleteButtonPos({
          top: iframeRect.top + elementRect.top - 30,
          right: window.innerWidth - (iframeRect.left + elementRect.right) - 4,
        })
      }

      updateDeleteButtonPosition()

      // 스크롤 이벤트 리스너
      const scrollContainer = iframe.parentElement
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', updateDeleteButtonPosition)
        return () => {
          scrollContainer.removeEventListener(
            'scroll',
            updateDeleteButtonPosition
          )
        }
      }
    }
  }, [selectedElementId, iframeRef])

  return deleteButtonPos
}
