import { useEffect } from 'react'

interface UseTextEditTriggerProps {
  iframeRef: React.RefObject<HTMLIFrameElement>
  elementId: string | null
  onSetEditingElementId: (id: string | null) => void
}

/**
 * 외부에서 텍스트 편집 모드를 트리거할 수 있는 훅
 */
export function useTextEditTrigger({
  iframeRef,
  elementId,
  onSetEditingElementId,
}: UseTextEditTriggerProps) {
  useEffect(() => {
    if (!elementId || !iframeRef.current) return

    const iframe = iframeRef.current
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

    if (!iframeDoc) return

    const element = iframeDoc.querySelector(
      `[data-element-id="${elementId}"]`
    ) as HTMLElement

    if (element) {
      onSetEditingElementId(elementId)
      element.contentEditable = 'true'
      element.focus()

      // 텍스트 전체 선택
      const selection = iframeDoc.getSelection()
      const range = iframeDoc.createRange()
      range.selectNodeContents(element)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }, [elementId, iframeRef, onSetEditingElementId])
}
