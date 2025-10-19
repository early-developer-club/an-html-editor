import { useEffect } from 'react'
import { useEditorStore } from '../stores/editor-store'
import type { HTMLElement } from '../types/editor'

function CenterCanvas() {
  const elements = useEditorStore((state) => state.elements)
  const selectedElementId = useEditorStore((state) => state.selectedElementId)
  const selectElement = useEditorStore((state) => state.selectElement)

  // 선택된 요소로 스크롤
  useEffect(() => {
    if (selectedElementId) {
      const element = document.querySelector(
        `[data-element-id="${selectedElementId}"]`
      )
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [selectedElementId])

  const renderElement = (element: HTMLElement) => {
    const isSelected = element.id === selectedElementId

    // 자식 요소 찾기
    const children = elements.filter((el) => el.parentId === element.id)

    // img 태그 특수 처리
    if (element.tagName === 'img') {
      return (
        <img
          key={element.id}
          data-element-id={element.id}
          src={element.src || ''}
          alt={element.alt || ''}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation()
            selectElement(element.id)
          }}
          style={{
            ...element.style,
            outline: isSelected ? '2px solid #0066cc' : 'none',
            cursor: 'pointer',
            position: 'relative',
          }}
        />
      )
    }

    // a 태그 특수 처리
    if (element.tagName === 'a') {
      return (
        <a
          key={element.id}
          data-element-id={element.id}
          href={element.href || '#'}
          onClick={(e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            selectElement(element.id)
          }}
          style={{
            ...element.style,
            outline: isSelected ? '2px solid #0066cc' : 'none',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          {element.textContent
            ? element.textContent
            : children.length > 0
              ? children.map(renderElement)
              : null}
        </a>
      )
    }

    // 일반 태그
    const Tag = element.tagName as keyof JSX.IntrinsicElements
    return (
      <Tag
        key={element.id}
        data-element-id={element.id}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation()
          selectElement(element.id)
        }}
        style={{
          ...element.style,
          outline: isSelected ? '2px solid #0066cc' : 'none',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        {/* 텍스트 컨텐츠가 있으면 표시, 없으면 자식 요소 렌더링 */}
        {element.textContent
          ? element.textContent
          : children.length > 0
            ? children.map(renderElement)
            : null}
      </Tag>
    )
  }

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
          <div
            onClick={() => selectElement(null)}
            style={{
              width: '100%',
              maxWidth: '800px',
              backgroundColor: 'white',
              minHeight: '100vh',
              boxShadow: '0 0 20px rgba(0,0,0,0.3)',
            }}
          >
            {elements.filter((el) => el.parentId === null).map(renderElement)}
          </div>
        )}
      </div>
    </div>
  )
}

export default CenterCanvas
