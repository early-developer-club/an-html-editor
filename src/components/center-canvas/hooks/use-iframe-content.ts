import { useEffect } from 'react'
import type {
  AHTMLDocumentMetadata,
  AHTMLElement,
} from '../../../types/editor'
import { generateHTML } from '../../left-panel/utils/html-generator'
import { isTextOnlyElement } from '../utils'

interface UseIframeContentProps {
  iframeRef: React.RefObject<HTMLIFrameElement>
  elements: AHTMLElement[]
  documentMetadata: AHTMLDocumentMetadata | null
  selectedElementId: string | null
  editingElementId: string | null
  onSelectElement: (id: string | null) => void
  onUpdateElement: (id: string, updates: Partial<AHTMLElement>) => void
  onSetEditingElementId: (id: string | null) => void
}

/**
 * iframe에 HTML 주입 및 클릭/편집 이벤트 설정
 */
export function useIframeContent({
  iframeRef,
  elements,
  documentMetadata,
  selectedElementId,
  editingElementId,
  onSelectElement,
  onUpdateElement,
  onSetEditingElementId,
}: UseIframeContentProps) {
  useEffect(() => {
    if (!iframeRef.current || elements.length === 0) return

    const iframe = iframeRef.current
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

    if (!iframeDoc) return

    // 완전한 HTML 생성
    const htmlContent = generateHTML(elements, documentMetadata)

    // iframe에 HTML 주입
    iframeDoc.open()
    iframeDoc.write(htmlContent)
    iframeDoc.close()

    // 클릭 이벤트 리스너
    const handleClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const target = e.target as HTMLElement
      const elementId = target.getAttribute('data-element-id')

      if (elementId) {
        onSelectElement(elementId)
      } else {
        onSelectElement(null)
      }
    }

    // Enter 키 처리 (줄바꿈을 <br>로 삽입)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()

        const target = e.target as HTMLElement
        const doc = target.ownerDocument
        const selection = doc.getSelection()

        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const br = doc.createElement('br')
          range.insertNode(br)
          range.setStartAfter(br)
          range.setEndAfter(br)
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }
    }

    // 더블클릭 이벤트로 텍스트 편집 모드 진입
    const handleDoubleClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const target = e.target as HTMLElement
      const elementId = target.getAttribute('data-element-id')

      if (elementId && isTextOnlyElement(elementId, elements)) {
        onSetEditingElementId(elementId)
        target.contentEditable = 'true'
        target.focus()

        // 텍스트 전체 선택
        const selection = iframeDoc.getSelection()
        const range = iframeDoc.createRange()
        range.selectNodeContents(target)
        selection?.removeAllRanges()
        selection?.addRange(range)

        target.removeEventListener('keydown', handleKeyDown)
        target.addEventListener('keydown', handleKeyDown)
      }
    }

    // blur 이벤트로 편집 완료
    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      const elementId = target.getAttribute('data-element-id')

      if (elementId && editingElementId === elementId) {
        target.contentEditable = 'false'
        const newContent = target.innerHTML
        onUpdateElement(elementId, { innerHTML: newContent })
        onSetEditingElementId(null)

        target.removeEventListener('keydown', handleKeyDown)
      }
    }

    // body에 이벤트 리스너 추가
    iframeDoc.body.addEventListener('click', handleClick)
    iframeDoc.body.addEventListener('dblclick', handleDoubleClick)
    iframeDoc.body.addEventListener('blur', handleBlur, true)

    // 모든 요소에 data-element-id와 스타일 추가
    const addElementAttributes = () => {
      elements.forEach((element) => {
        const domElement = iframeDoc.querySelector(
          `[data-element-id="${element.id}"]`
        ) as HTMLElement

        if (domElement) {
          // 선택 표시
          if (element.id === selectedElementId) {
            domElement.style.outline = '2px solid #0066cc'
            domElement.style.outlineOffset = '2px'
          } else {
            domElement.style.outline = 'none'
          }

          // 커서 설정 - 텍스트 요소는 text, 나머지는 pointer
          if (isTextOnlyElement(element.id, elements)) {
            domElement.style.cursor = 'text'
          } else {
            domElement.style.cursor = 'pointer'
          }
        }
      })
    }

    // 초기 속성 설정 및 렌더링 후 재설정
    setTimeout(addElementAttributes, 0)

    return () => {
      iframeDoc.body.removeEventListener('click', handleClick)
      iframeDoc.body.removeEventListener('dblclick', handleDoubleClick)
      iframeDoc.body.removeEventListener('blur', handleBlur, true)
    }
  }, [
    iframeRef,
    elements,
    documentMetadata,
    selectedElementId,
    editingElementId,
    onSelectElement,
    onUpdateElement,
    onSetEditingElementId,
  ])
}
