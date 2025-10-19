import { useState } from 'react'
import { useEditorStore } from '../stores/editor-store'
import type { HTMLElement, HTMLElementType } from '../types/editor'
import { SAMPLE_TEMPLATE } from '../utils/sample-templates'
import { Download, Layers, FileCode } from 'lucide-react'

function LeftPanel() {
  const elements = useEditorStore((state) => state.elements)
  const selectedElementId = useEditorStore((state) => state.selectedElementId)
  const addElement = useEditorStore((state) => state.addElement)
  const selectElement = useEditorStore((state) => state.selectElement)
  const deleteElement = useEditorStore((state) => state.deleteElement)
  const loadTemplate = useEditorStore((state) => state.loadTemplate)
  const moveElement = useEditorStore((state) => state.moveElement)
  const reorderElements = useEditorStore((state) => state.reorderElements)
  const [activeTab, setActiveTab] = useState<'template' | 'layers'>('layers')
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null)
  const [dragOverElementId, setDragOverElementId] = useState<string | null>(null)
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside' | null>(null)

  const handleLoadTemplate = () => {
    if (
      elements.length > 0 &&
      !confirm('현재 작업 중인 내용이 삭제됩니다. 계속하시겠습니까?')
    ) {
      return
    }
    loadTemplate(SAMPLE_TEMPLATE)
  }

  const generateHTML = () => {
    // 요소를 HTML 문자열로 변환하는 재귀 함수
    const elementToHTML = (element: HTMLElement, indent: number = 0): string => {
      const indentation = '  '.repeat(indent)
      const children = elements.filter((el) => el.parentId === element.id)

      // 스타일 객체를 CSS 문자열로 변환
      const styleString = element.style
        ? Object.entries(element.style)
            .map(([key, value]) => {
              // camelCase를 kebab-case로 변환
              const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
              return `${cssKey}: ${value}`
            })
            .join('; ')
        : ''

      // img 태그 처리
      if (element.tagName === 'img') {
        return `${indentation}<img src="${element.src || ''}" alt="${element.alt || ''}"${styleString ? ` style="${styleString}"` : ''} />`
      }

      // a 태그 처리
      if (element.tagName === 'a') {
        const href = element.href || '#'
        const content = element.textContent || children.map((child) => elementToHTML(child, indent + 1)).join('\n')
        return `${indentation}<a href="${href}"${styleString ? ` style="${styleString}"` : ''}>${children.length > 0 ? '\n' + content + '\n' + indentation : element.textContent || ''}</a>`
      }

      // 일반 태그 처리
      const openTag = `${indentation}<${element.tagName}${styleString ? ` style="${styleString}"` : ''}>`
      const closeTag = `${indentation}</${element.tagName}>`

      if (element.textContent && children.length === 0) {
        return `${openTag}${element.textContent}${closeTag}`
      }

      if (children.length > 0) {
        const childrenHTML = children
          .map((child) => elementToHTML(child, indent + 1))
          .join('\n')
        return `${openTag}\n${childrenHTML}\n${closeTag}`
      }

      return `${openTag}${closeTag}`
    }

    // 최상위 요소들 (parentId가 null인 요소)
    const rootElements = elements.filter((el) => el.parentId === null)
    const bodyContent = rootElements
      .map((el) => elementToHTML(el, 2))
      .join('\n')

    // 완전한 HTML 문서 생성
    return `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>상세 페이지</title>
  </head>
  <body>
${bodyContent}
  </body>
</html>`
  }

  const handleDownloadHTML = () => {
    if (elements.length === 0) {
      alert('다운로드할 컨텐츠가 없습니다.')
      return
    }

    const html = generateHTML()
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'product-detail.html'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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

    if (draggedElementId === elementId) {
      setDragOverElementId(null)
      setDropPosition(null)
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const mouseY = e.clientY - rect.top
    const height = rect.height

    // 상단 25%: before, 중간 50%: inside, 하단 25%: after
    if (mouseY < height * 0.25) {
      setDropPosition('before')
    } else if (mouseY > height * 0.75) {
      setDropPosition('after')
    } else {
      setDropPosition('inside')
    }

    setDragOverElementId(elementId)
  }

  const handleDragEnd = () => {
    setDraggedElementId(null)
    setDragOverElementId(null)
    setDropPosition(null)
  }

  const handleDrop = (e: React.DragEvent, targetElementId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (!draggedElementId || draggedElementId === targetElementId) {
      setDraggedElementId(null)
      setDragOverElementId(null)
      setDropPosition(null)
      return
    }

    const draggedElement = elements.find((el) => el.id === draggedElementId)
    const targetElement = elements.find((el) => el.id === targetElementId)

    if (!draggedElement || !targetElement) {
      setDraggedElementId(null)
      setDragOverElementId(null)
      setDropPosition(null)
      return
    }

    if (dropPosition === 'inside') {
      // 자식으로 삽입
      moveElement(draggedElementId, targetElementId)
    } else {
      // 형제로 삽입 (before 또는 after)
      const newElements = [...elements]
      const draggedIndex = newElements.findIndex((el) => el.id === draggedElementId)

      // 드래그된 요소 제거
      const [removed] = newElements.splice(draggedIndex, 1)

      // 부모를 target과 같게 설정
      removed.parentId = targetElement.parentId

      // 새로운 위치에 삽입
      const newTargetIndex = newElements.findIndex((el) => el.id === targetElementId)
      const insertIndex = dropPosition === 'before' ? newTargetIndex : newTargetIndex + 1
      newElements.splice(insertIndex, 0, removed)

      reorderElements(newElements)
    }

    setDraggedElementId(null)
    setDragOverElementId(null)
    setDropPosition(null)
  }

  // 루트 영역 드롭 (최상위로 이동)
  const handleDropToRoot = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedElementId) {
      moveElement(draggedElementId, null)
    }
    setDraggedElementId(null)
    setDragOverElementId(null)
    setDropPosition(null)
  }

  // 계층 구조 렌더링 함수
  const renderElement = (element: HTMLElement, depth: number = 0) => {
    const hasChildren =
      elements.filter((el) => el.parentId === element.id).length > 0
    const isDragging = draggedElementId === element.id
    const isDragOver = dragOverElementId === element.id

    // 드롭 위치에 따른 테두리 스타일
    let borderClass = 'border-solid border-panel-border'
    if (isDragOver && dropPosition === 'before') {
      borderClass = 'border-t-4 border-t-blue-500 border-x border-b border-panel-border'
    } else if (isDragOver && dropPosition === 'after') {
      borderClass = 'border-b-4 border-b-blue-500 border-x border-t border-panel-border'
    } else if (isDragOver && dropPosition === 'inside') {
      borderClass = 'border-2 border-dashed border-blue-500'
    } else if (!isDragOver) {
      borderClass = 'border border-solid border-panel-border'
    }

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
            paddingLeft: `${8 + depth * 16}px`,
            opacity: isDragging ? 0.5 : 1,
          }}
          className={`flex items-center justify-between p-2 mb-0.5 text-xs rounded cursor-grab text-text-primary ${borderClass} ${
            isDragging
              ? 'bg-gray-400 opacity-50'
              : selectedElementId === element.id
                ? 'bg-item-selected'
                : 'bg-item-bg'
          }`}
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
            className="px-2 py-0.5 text-xs text-white border-none rounded cursor-pointer bg-red-600 hover:bg-red-700"
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
    <div className="flex flex-col overflow-hidden border-r bg-panel-bg border-panel-border">
      {/* 탭 헤더 */}
      <div className="flex border-b bg-panel-header border-panel-border">
        <button
          onClick={() => setActiveTab('template')}
          className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-semibold border-r border-panel-border ${
            activeTab === 'template'
              ? 'bg-panel-bg text-text-primary'
              : 'bg-panel-header text-text-muted hover:bg-item-hover'
          }`}
        >
          <FileCode size={16} />
          템플릿
        </button>
        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-semibold ${
            activeTab === 'layers'
              ? 'bg-panel-bg text-text-primary'
              : 'bg-panel-header text-text-muted hover:bg-item-hover'
          }`}
        >
          <Layers size={16} />
          레이어
        </button>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {/* 템플릿 탭 */}
        {activeTab === 'template' && (
          <div>
            {/* 샘플 템플릿 버튼 */}
            <button
              onClick={handleLoadTemplate}
              className="w-full p-2 mb-2 font-bold text-white border-none rounded cursor-pointer bg-green-600 hover:bg-green-700 text-sm"
            >
              📄 샘플 템플릿 불러오기
            </button>

            {/* HTML 다운로드 버튼 */}
            <button
              onClick={handleDownloadHTML}
              className="w-full p-2 mb-2 font-bold text-white border-none rounded cursor-pointer bg-purple-600 hover:bg-purple-700 text-sm flex items-center justify-center gap-2"
            >
              <Download size={16} />
              HTML 다운로드
            </button>
          </div>
        )}

        {/* 레이어 탭 */}
        {activeTab === 'layers' && (
          <>
            {/* 요소 추가 버튼 */}
        <div className="relative mb-4">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-full p-2 text-sm text-white border-none rounded cursor-pointer bg-blue-600 hover:bg-blue-700"
          >
            + 요소 추가
          </button>

          {showAddMenu && (
            <div className="absolute top-full left-0 right-0 mt-1 max-h-[300px] overflow-y-auto z-10 rounded border bg-panel-bg border-panel-border">
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
                  className="w-full px-3 py-2 text-xs text-left border-none cursor-pointer bg-transparent text-text-primary hover:bg-item-hover"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 요소 목록 */}
        {elements.length === 0 ? (
          <p className="text-sm text-text-muted">
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
            className={`p-1 min-h-[100px] rounded ${dragOverElementId === 'root' ? 'border-2 border-dashed border-blue-500 bg-blue-500/10' : 'border-2 border-dashed border-transparent'}`}
          >
            {elements
              .filter((el) => el.parentId === null)
              .map((element) => renderElement(element))}
            {dragOverElementId === 'root' && (
              <div className="p-2 text-xs text-center text-blue-500">
                여기에 놓으면 최상위 요소가 됩니다
              </div>
            )}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  )
}

export default LeftPanel
