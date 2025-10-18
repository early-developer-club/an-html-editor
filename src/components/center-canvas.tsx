import { useEditorStore } from '../stores/editor-store'
import type { HTMLElement } from '../types/editor'

function CenterCanvas() {
  const elements = useEditorStore((state) => state.elements)
  const selectedElementId = useEditorStore((state) => state.selectedElementId)
  const selectElement = useEditorStore((state) => state.selectElement)

  const renderElement = (element: HTMLElement) => {
    const Tag = element.tagName as keyof JSX.IntrinsicElements
    const isSelected = element.id === selectedElementId

    // 자식 요소 찾기
    const children = elements.filter((el) => el.parentId === element.id)

    return (
      <Tag
        key={element.id}
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
    <div className="center-canvas">
      <div className="canvas-content">
        {elements.length === 0 ? (
          <div className="canvas-placeholder">
            <h2>쇼핑몰 상세 페이지 에디터</h2>
            <p>좌측 패널에서 요소를 추가하여 페이지를 만들어보세요.</p>
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              maxWidth: '800px',
              backgroundColor: 'white',
              minHeight: '600px',
              padding: '20px',
            }}
          >
            {elements
              .filter((el) => el.parentId === null)
              .map(renderElement)}
          </div>
        )}
      </div>
    </div>
  )
}

export default CenterCanvas
