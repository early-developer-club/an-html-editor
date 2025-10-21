import { Redo, Trash2, Undo } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useEditorStore } from '../stores/editor-store'
import { generateHTML } from './left-panel/utils/html-generator'

function CenterCanvas() {
  const elements = useEditorStore((state) => state.elements)
  const documentMetadata = useEditorStore((state) => state.documentMetadata)
  const selectedElementId = useEditorStore((state) => state.selectedElementId)
  const selectElement = useEditorStore((state) => state.selectElement)
  const updateElement = useEditorStore((state) => state.updateElement)
  const deleteElement = useEditorStore((state) => state.deleteElement)
  const undo = useEditorStore((state) => state.undo)
  const redo = useEditorStore((state) => state.redo)
  const history = useEditorStore((state) => state.history)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [deleteButtonPos, setDeleteButtonPos] = useState<{
    top: number
    right: number
  } | null>(null)
  const [editingElementId, setEditingElementId] = useState<string | null>(null)

  // iframe에 HTML 주입 및 클릭 이벤트 설정
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

    // 텍스트 전용 요소인지 확인
    const isTextOnlyElement = (elementId: string): boolean => {
      const element = elements.find((el) => el.id === elementId)
      if (!element) return false

      // children이 없고, innerHTML이 있는 요소 (p, h1-h6, span 등)
      const hasNoChildren = !elements.some((el) => el.parentId === elementId)
      const hasInnerHTML = Boolean(
        element.innerHTML && element.innerHTML.trim() !== ''
      )

      return hasNoChildren && hasInnerHTML
    }

    // 클릭 이벤트 리스너 추가
    const handleClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const target = e.target as HTMLElement
      const elementId = target.getAttribute('data-element-id')

      if (elementId) {
        selectElement(elementId)
      } else {
        selectElement(null)
      }
    }

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

      if (elementId && isTextOnlyElement(elementId)) {
        setEditingElementId(elementId)
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
        updateElement(elementId, { innerHTML: newContent })
        setEditingElementId(null)

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
          if (isTextOnlyElement(element.id)) {
            domElement.style.cursor = 'text'
          } else {
            domElement.style.cursor = 'pointer'
          }
        }
      })
    }

    // 초기 속성 설정 및 렌더링 후 재설정
    setTimeout(addElementAttributes, 0)

    // iframe 높이를 콘텐츠에 맞게 자동 조정
    const resizeIframe = () => {
      if (!iframe.contentWindow) return

      const body = iframeDoc.body
      const html = iframeDoc.documentElement

      // 전체 문서의 높이 계산
      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      )

      iframe.style.height = `${height}px`
    }

    // 이미지 로드 대기 및 높이 조정
    const images = Array.from(iframeDoc.querySelectorAll('img'))
    if (images.length > 0) {
      let loadedCount = 0
      images.forEach((img) => {
        if (img.complete) {
          loadedCount++
        } else {
          img.addEventListener('load', () => {
            loadedCount++
            if (loadedCount === images.length) {
              resizeIframe()
            }
          })
        }
      })
      if (loadedCount === images.length) {
        setTimeout(resizeIframe, 0)
      }
    } else {
      setTimeout(resizeIframe, 0)
    }

    // ResizeObserver로 콘텐츠 변경 감지
    const resizeObserver = new ResizeObserver(() => {
      resizeIframe()
    })
    resizeObserver.observe(iframeDoc.body)

    return () => {
      iframeDoc.body.removeEventListener('click', handleClick)
      iframeDoc.body.removeEventListener('dblclick', handleDoubleClick)
      iframeDoc.body.removeEventListener('blur', handleBlur, true)
      resizeObserver.disconnect()
    }
  }, [
    elements,
    documentMetadata,
    selectedElementId,
    selectElement,
    editingElementId,
    updateElement,
  ])

  // 선택된 요소로 스크롤 및 삭제 버튼 위치 업데이트
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
  }, [selectedElementId])

  // 키보드 단축키 (Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        undo()
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  return (
    <div className="relative flex flex-col overflow-hidden bg-canvas-bg">
      {/* Undo/Redo 버튼 */}
      <div className="absolute top-4 left-4 z-10 flex gap-1.5">
        <button
          onClick={undo}
          disabled={history.past.length === 0}
          className="p-1.5 rounded border bg-panel-bg border-panel-border text-text-primary hover:bg-item-hover disabled:opacity-30 disabled:cursor-not-allowed"
          title="되돌리기 (Ctrl+Z)"
        >
          <Undo size={14} />
        </button>
        <button
          onClick={redo}
          disabled={history.future.length === 0}
          className="p-1.5 rounded border bg-panel-bg border-panel-border text-text-primary hover:bg-item-hover disabled:opacity-30 disabled:cursor-not-allowed"
          title="다시 실행 (Ctrl+Y)"
        >
          <Redo size={14} />
        </button>
      </div>

      {/* 선택된 요소 삭제 버튼 */}
      {selectedElementId && deleteButtonPos && (
        <div
          className="fixed z-50"
          style={{
            top: `${deleteButtonPos.top}px`,
            right: `${deleteButtonPos.right}px`,
          }}
        >
          <button
            onClick={() => deleteElement(selectedElementId)}
            className="p-1 rounded bg-white border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-lg cursor-pointer"
            title="선택된 요소 삭제"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}

      <div className="flex items-start justify-center flex-1 px-5 py-10 overflow-x-hidden overflow-y-auto">
        {elements.length === 0 ? (
          <div className="p-16 px-5 m-auto text-center text-gray-500">
            <h2 className="mb-2 text-lg font-normal">
              쇼핑몰 상세 페이지 에디터
            </h2>
            <p className="text-sm text-text-muted">
              좌측 패널에서 요소를 추가하여 페이지를 만들어보세요.
            </p>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            title="Preview Canvas"
            style={{
              width: '100%',
              maxWidth: '960px',
              border: 'none',
              backgroundColor: 'white',
              boxShadow: '0 0 20px rgba(0,0,0,0.3)',
              display: 'block',
            }}
          />
        )}
      </div>
    </div>
  )
}

export default CenterCanvas
