import { useState } from 'react'
import { useEditorStore } from '../stores/editor-store'
import type { HTMLElement, HTMLElementType } from '../types/editor'
import { SAMPLE_TEMPLATE } from '../utils/sample-templates'

function LeftPanel() {
  const elements = useEditorStore((state) => state.elements)
  const selectedElementId = useEditorStore((state) => state.selectedElementId)
  const addElement = useEditorStore((state) => state.addElement)
  const selectElement = useEditorStore((state) => state.selectElement)
  const deleteElement = useEditorStore((state) => state.deleteElement)
  const loadTemplate = useEditorStore((state) => state.loadTemplate)
  const moveElement = useEditorStore((state) => state.moveElement)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null)
  const [dragOverElementId, setDragOverElementId] = useState<string | null>(null)

  const handleLoadTemplate = () => {
    if (
      elements.length > 0 &&
      !confirm('현재 작업 중인 내용이 삭제됩니다. 계속하시겠습니까?')
    ) {
      return
    }
    loadTemplate(SAMPLE_TEMPLATE)
  }

  const createElement = (
    type: HTMLElementType,
    tagName: string,
    defaultContent: string,
    defaultStyle: React.CSSProperties = {},
    additionalProps: Partial<HTMLElement> = {}
  ): HTMLElement => {
    return {
      id: `element-${Date.now()}`,
      type,
      tagName,
      textContent: defaultContent,
      style: defaultStyle,
      children: [],
      parentId: null,
      ...additionalProps,
    }
  }

  const handleAddElement = (type: HTMLElementType) => {
    const elementConfigs: Record<
      HTMLElementType,
      { tagName: string; content: string; style: React.CSSProperties }
    > = {
      section: {
        tagName: 'section',
        content: '',
        style: { padding: '40px 20px', backgroundColor: '#ffffff' },
      },
      header: {
        tagName: 'header',
        content: '',
        style: { padding: '30px 20px', backgroundColor: '#f9f9f9' },
      },
      footer: {
        tagName: 'footer',
        content: '',
        style: { padding: '30px 20px', backgroundColor: '#333333', color: '#ffffff' },
      },
      div: { tagName: 'div', content: '', style: { padding: '10px' } },
      h1: {
        tagName: 'h1',
        content: '제목 1',
        style: { fontSize: '32px', fontWeight: 'bold', margin: '0' },
      },
      h2: {
        tagName: 'h2',
        content: '제목 2',
        style: { fontSize: '28px', fontWeight: 'bold', margin: '0' },
      },
      h3: {
        tagName: 'h3',
        content: '제목 3',
        style: { fontSize: '24px', fontWeight: 'bold', margin: '0' },
      },
      p: {
        tagName: 'p',
        content: '텍스트를 입력하세요',
        style: { fontSize: '16px', lineHeight: '1.6' },
      },
      // 나머지 타입들은 기본값 사용
      article: { tagName: 'article', content: '', style: {} },
      main: { tagName: 'main', content: '', style: {} },
      nav: { tagName: 'nav', content: '', style: {} },
      aside: { tagName: 'aside', content: '', style: {} },
      h4: { tagName: 'h4', content: '제목 4', style: { fontSize: '20px' } },
      h5: { tagName: 'h5', content: '제목 5', style: { fontSize: '18px' } },
      h6: { tagName: 'h6', content: '제목 6', style: { fontSize: '16px' } },
      span: { tagName: 'span', content: '스팬', style: {} },
      img: { tagName: 'img', content: '', style: { width: '100%' } },
      a: { tagName: 'a', content: '링크', style: { color: '#0066cc' } },
      button: {
        tagName: 'button',
        content: '버튼',
        style: { padding: '10px 20px', cursor: 'pointer' },
      },
      ul: { tagName: 'ul', content: '', style: {} },
      ol: { tagName: 'ol', content: '', style: {} },
      li: { tagName: 'li', content: '목록 항목', style: {} },
    }

    const config = elementConfigs[type]

    // img 태그는 특별 처리 (src, alt 속성 추가)
    if (type === 'img') {
      const newElement = createElement(
        type,
        config.tagName,
        config.content,
        config.style,
        {
          src: 'https://picsum.photos/seed/placeholder/400/300',
          alt: '이미지 설명을 입력하세요',
        }
      )
      addElement(newElement)
    } else {
      const newElement = createElement(
        type,
        config.tagName,
        config.content,
        config.style
      )
      addElement(newElement)
    }

    setShowAddMenu(false)
  }

  // 드래그 앤 드롭 핸들러
  const handleDragStart = (e: React.DragEvent, elementId: string) => {
    setDraggedElementId(elementId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, elementId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (draggedElementId !== elementId) {
      setDragOverElementId(elementId)
    }
  }

  const handleDragEnd = () => {
    setDraggedElementId(null)
    setDragOverElementId(null)
  }

  const handleDrop = (e: React.DragEvent, targetElementId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (draggedElementId && draggedElementId !== targetElementId) {
      // targetElementId를 부모로 설정
      moveElement(draggedElementId, targetElementId)
    }

    setDraggedElementId(null)
    setDragOverElementId(null)
  }

  // 루트 영역 드롭 (최상위로 이동)
  const handleDropToRoot = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedElementId) {
      moveElement(draggedElementId, null)
    }
    setDraggedElementId(null)
    setDragOverElementId(null)
  }

  // 계층 구조 렌더링 함수
  const renderElement = (element: HTMLElement, depth: number = 0) => {
    const hasChildren =
      elements.filter((el) => el.parentId === element.id).length > 0
    const isDragging = draggedElementId === element.id
    const isDragOver = dragOverElementId === element.id

    return (
      <div key={element.id}>
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, element.id)}
          onDragOver={(e) => handleDragOver(e, element.id)}
          onDragEnd={handleDragEnd}
          onDrop={(e) => handleDrop(e, element.id)}
          onClick={() => selectElement(element.id)}
          style={{
            padding: '6px 8px',
            paddingLeft: `${8 + depth * 16}px`,
            marginBottom: '2px',
            backgroundColor: isDragging
              ? '#444444'
              : isDragOver
                ? '#0066cc33'
                : selectedElementId === element.id
                  ? '#094771'
                  : '#2d2d30',
            borderRadius: '4px',
            cursor: isDragging ? 'grabbing' : 'grab',
            fontSize: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: isDragging ? 0.5 : 1,
            border: isDragOver ? '2px dashed #0066cc' : '2px solid transparent',
          }}
        >
          <span>
            {hasChildren && '▾ '}
            {element.tagName}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              deleteElement(element.id)
            }}
            style={{
              padding: '2px 6px',
              backgroundColor: '#c42b1c',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '10px',
            }}
          >
            삭제
          </button>
        </div>
        {/* 자식 요소 렌더링 */}
        {elements
          .filter((el) => el.parentId === element.id)
          .map((child) => renderElement(child, depth + 1))}
      </div>
    )
  }

  return (
    <div className="left-panel">
      <div className="panel-header">레이어</div>
      <div className="panel-content">
        {/* 샘플 템플릿 버튼 */}
        <button
          onClick={handleLoadTemplate}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '8px',
            backgroundColor: '#107c10',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold',
          }}
        >
          📄 샘플 템플릿 불러오기
        </button>

        {/* 요소 추가 버튼 */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            + 요소 추가
          </button>

          {showAddMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: '#2d2d30',
                border: '1px solid #3e3e42',
                borderRadius: '4px',
                marginTop: '4px',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 10,
              }}
            >
              {[
                { type: 'section' as const, label: '섹션 (section)' },
                { type: 'header' as const, label: '헤더 (header)' },
                { type: 'footer' as const, label: '푸터 (footer)' },
                { type: 'div' as const, label: '박스 (div)' },
                { type: 'h1' as const, label: '제목 1 (h1)' },
                { type: 'h2' as const, label: '제목 2 (h2)' },
                { type: 'h3' as const, label: '제목 3 (h3)' },
                { type: 'p' as const, label: '텍스트 (p)' },
                { type: 'img' as const, label: '이미지 (img)' },
                { type: 'button' as const, label: '버튼 (button)' },
              ].map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => handleAddElement(type)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: 'transparent',
                    color: '#cccccc',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#3e3e42')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 요소 목록 */}
        {elements.length === 0 ? (
          <p style={{ color: '#858585', fontSize: '13px' }}>
            요소가 없습니다. 샘플 템플릿을 불러오거나 요소를 추가하세요.
          </p>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragOverElementId('root')
            }}
            onDragLeave={() => setDragOverElementId(null)}
            onDrop={handleDropToRoot}
            style={{
              minHeight: '100px',
              padding: '4px',
              borderRadius: '4px',
              backgroundColor:
                dragOverElementId === 'root' ? '#0066cc11' : 'transparent',
              border:
                dragOverElementId === 'root'
                  ? '2px dashed #0066cc'
                  : '2px dashed transparent',
            }}
          >
            {elements
              .filter((el) => el.parentId === null)
              .map((element) => renderElement(element))}
            {dragOverElementId === 'root' && (
              <div
                style={{
                  padding: '8px',
                  color: '#0066cc',
                  fontSize: '11px',
                  textAlign: 'center',
                }}
              >
                여기에 놓으면 최상위 요소가 됩니다
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LeftPanel
