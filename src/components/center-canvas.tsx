import { useEffect, useRef } from 'react'
import { useEditorStore } from '../stores/editor-store'
import { generateHTML } from './left-panel/utils/html-generator'

function CenterCanvas() {
  const elements = useEditorStore((state) => state.elements)
  const documentMetadata = useEditorStore((state) => state.documentMetadata)
  const selectedElementId = useEditorStore((state) => state.selectedElementId)
  const selectElement = useEditorStore((state) => state.selectElement)
  const iframeRef = useRef<HTMLIFrameElement>(null)

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

    // body에 이벤트 리스너 추가
    iframeDoc.body.addEventListener('click', handleClick)

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

          // 클릭 가능하도록 커서 설정
          domElement.style.cursor = 'pointer'
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
      resizeObserver.disconnect()
    }
  }, [elements, documentMetadata, selectedElementId, selectElement])

  // 선택된 요소로 스크롤
  useEffect(() => {
    if (!selectedElementId || !iframeRef.current) return

    const iframe = iframeRef.current
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

    if (!iframeDoc) return

    const element = iframeDoc.querySelector(
      `[data-element-id="${selectedElementId}"]`
    )
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [selectedElementId])

  return (
    <div className="relative flex flex-col overflow-hidden bg-canvas-bg">
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
