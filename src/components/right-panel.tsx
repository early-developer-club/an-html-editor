import { useEditorStore } from '../stores/editor-store'
import SpacingInput from './spacing-input'
import { Sun, Moon } from 'lucide-react'

function RightPanel() {
  const selectedElementId = useEditorStore((state) => state.selectedElementId)
  const elements = useEditorStore((state) => state.elements)
  const updateElement = useEditorStore((state) => state.updateElement)
  const canvasTheme = useEditorStore((state) => state.canvasTheme)
  const setCanvasTheme = useEditorStore((state) => state.setCanvasTheme)

  const selectedElement = elements.find((el) => el.id === selectedElementId)

  const handleTextContentChange = (value: string) => {
    if (selectedElement) {
      // innerHTML이 있었던 경우, \n을 <br />로 변환
      if (selectedElement.innerHTML !== undefined) {
        const htmlValue = value.replace(/\n/g, '<br />')
        updateElement(selectedElement.id, {
          textContent: value.replace(/\n/g, ' '), // 줄바꿈을 공백으로
          innerHTML: htmlValue, // \n → <br />
        })
      } else {
        updateElement(selectedElement.id, { textContent: value })
      }
    }
  }

  const handleStyleChange = (property: string, value: string | number) => {
    if (selectedElement) {
      updateElement(selectedElement.id, {
        style: { ...selectedElement.style, [property]: value },
      })
    }
  }

  const handleAttributeChange = (attribute: string, value: string) => {
    if (selectedElement) {
      updateElement(selectedElement.id, { [attribute]: value })
    }
  }

  return (
    <div className="flex flex-col overflow-hidden border-l bg-panel-bg border-panel-border">
      <div className="flex items-center justify-between p-3 px-4 font-semibold border-b text-sm bg-panel-header text-text-primary border-panel-border">
        <span>속성</span>
        <button
          onClick={() =>
            setCanvasTheme(canvasTheme === 'dark' ? 'light' : 'dark')
          }
          className="p-1.5 border rounded hover:bg-opacity-80 bg-item-hover border-panel-border text-text-primary"
          title={`${canvasTheme === 'dark' ? '밝은' : '어두운'} 테마로 전환`}
        >
          {canvasTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
      <div className="flex-1 p-4 overflow-auto text-text-primary">
        {selectedElement ? (
          <div>
            {/* 기본 정보 */}
            <div className="pb-3 mb-3 border-b border-panel-border">
              <h3 className="mb-2 text-sm">
                {selectedElement.tagName}
              </h3>
              <p className="text-xs text-text-muted">
                ID: {selectedElement.id}
              </p>
            </div>

            {/* 텍스트 내용 */}
            {selectedElement.tagName !== 'img' && (
              <div className="pb-3 mb-3 border-b border-panel-border">
                <label className="block mt-3 mb-1 text-xs text-text-muted">
                  텍스트 내용
                  {selectedElement.innerHTML && (
                    <span className="ml-1 text-[10px] text-green-600">
                      (엔터로 줄바꿈)
                    </span>
                  )}
                </label>
                <textarea
                  value={
                    selectedElement.innerHTML
                      ? selectedElement.innerHTML.replace(/<br\s*\/?>/gi, '\n')
                      : selectedElement.textContent || ''
                  }
                  onChange={(e) => handleTextContentChange(e.target.value)}
                  className="w-full p-2 text-xs rounded resize-y min-h-20 border bg-input-bg text-text-primary border-input-border"
                  placeholder="텍스트를 입력하세요 (엔터로 줄바꿈)"
                />
                {selectedElement.innerHTML && (
                  <p className="mt-1 text-[10px] text-text-muted">
                    💡 엔터키로 줄바꿈을 추가할 수 있습니다
                  </p>
                )}
              </div>
            )}

            {/* 이미지 속성 (img 태그 전용) */}
            {selectedElement.tagName === 'img' && (
              <div className="pb-3 mb-3 border-b border-panel-border">
                <h4 className="mb-2 text-xs text-text-primary">
                  이미지 속성
                </h4>
                <label className="block mt-3 mb-1 text-xs text-text-muted">
                  이미지 URL (src)
                </label>
                <input
                  type="text"
                  value={selectedElement.src || ''}
                  onChange={(e) => handleAttributeChange('src', e.target.value)}
                  className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
                  placeholder="https://example.com/image.jpg"
                />
                <label className="block mt-3 mb-1 text-xs text-text-muted">
                  대체 텍스트 (alt)
                </label>
                <input
                  type="text"
                  value={selectedElement.alt || ''}
                  onChange={(e) => handleAttributeChange('alt', e.target.value)}
                  className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
                  placeholder="이미지 설명"
                />
              </div>
            )}

            {/* 링크 속성 (a 태그 전용) */}
            {selectedElement.tagName === 'a' && (
              <div className="pb-3 mb-3 border-b border-panel-border">
                <h4 className="mb-2 text-xs text-text-primary">
                  링크 속성
                </h4>
                <label className="block mt-3 mb-1 text-xs text-text-muted">
                  링크 URL (href)
                </label>
                <input
                  type="text"
                  value={selectedElement.href || ''}
                  onChange={(e) => handleAttributeChange('href', e.target.value)}
                  className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
                  placeholder="https://example.com"
                />
              </div>
            )}

            {/* 레이아웃 */}
            <div className="pb-3 mb-3 border-b border-panel-border">
              <h4 className="mb-2 text-xs text-text-primary">레이아웃</h4>
              <SpacingInput
                label="패딩 (padding)"
                value={String(selectedElement.style?.padding || '')}
                onChange={(value) => handleStyleChange('padding', value)}
              />
              <SpacingInput
                label="마진 (margin)"
                value={String(selectedElement.style?.margin || '')}
                onChange={(value) => handleStyleChange('margin', value)}
              />
            </div>

            {/* 텍스트 스타일 */}
            <div className="pb-3 mb-3 border-b border-panel-border">
              <h4 className="mb-2 text-xs text-text-primary">
                텍스트
              </h4>
              <label className="block mt-3 mb-1 text-xs text-text-muted">
                글자 크기 (font-size)
              </label>
              <input
                type="text"
                value={selectedElement.style?.fontSize || ''}
                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
                placeholder="예: 16px"
              />
              <label className="block mt-3 mb-1 text-xs text-text-muted">
                글자 굵기 (font-weight)
              </label>
              <select
                value={selectedElement.style?.fontWeight || 'normal'}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="500">500</option>
                <option value="600">600</option>
                <option value="700">700</option>
                <option value="800">800</option>
                <option value="900">900</option>
              </select>
              <label className="block mt-3 mb-1 text-xs text-text-muted">
                글자 색상 (color)
              </label>
              <input
                type="text"
                value={selectedElement.style?.color || ''}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
                placeholder="예: #333333"
              />
              <label className="block mt-3 mb-1 text-xs text-text-muted">
                정렬 (text-align)
              </label>
              <select
                value={selectedElement.style?.textAlign || 'left'}
                onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
              >
                <option value="left">왼쪽</option>
                <option value="center">가운데</option>
                <option value="right">오른쪽</option>
                <option value="justify">양쪽 정렬</option>
              </select>
              <label className="block mt-3 mb-1 text-xs text-text-muted">
                줄 간격 (line-height)
              </label>
              <input
                type="text"
                value={selectedElement.style?.lineHeight || ''}
                onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
                className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
                placeholder="예: 1.6"
              />
            </div>

            {/* 배경 및 테두리 */}
            <div className="pb-3 mb-3 border-b border-panel-border">
              <h4 className="mb-2 text-xs text-text-primary">
                배경 & 테두리
              </h4>
              <label className="block mt-3 mb-1 text-xs text-text-muted">
                배경색 (background-color)
              </label>
              <input
                type="text"
                value={selectedElement.style?.backgroundColor || ''}
                onChange={(e) =>
                  handleStyleChange('backgroundColor', e.target.value)
                }
                className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
                placeholder="예: #ffffff"
              />
              <label className="block mt-3 mb-1 text-xs text-text-muted">
                테두리 (border)
              </label>
              <input
                type="text"
                value={selectedElement.style?.border || ''}
                onChange={(e) => handleStyleChange('border', e.target.value)}
                className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
                placeholder="예: 1px solid #000"
              />
              <label className="block mt-3 mb-1 text-xs text-text-muted">
                모서리 둥글기 (border-radius)
              </label>
              <input
                type="text"
                value={selectedElement.style?.borderRadius || ''}
                onChange={(e) =>
                  handleStyleChange('borderRadius', e.target.value)
                }
                className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
                placeholder="예: 4px"
              />
            </div>

            {/* 크기 */}
            <div>
              <h4 className="mb-2 text-xs text-text-primary">
                크기
              </h4>
              <label className="block mt-3 mb-1 text-xs text-text-muted">
                너비 (width)
              </label>
              <input
                type="text"
                value={selectedElement.style?.width || ''}
                onChange={(e) => handleStyleChange('width', e.target.value)}
                className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
                placeholder="예: 100% 또는 300px"
              />
              <label className="block mt-3 mb-1 text-xs text-text-muted">
                높이 (height)
              </label>
              <input
                type="text"
                value={selectedElement.style?.height || ''}
                onChange={(e) => handleStyleChange('height', e.target.value)}
                className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
                placeholder="예: auto 또는 200px"
              />
              <label className="block mt-3 mb-1 text-xs text-text-muted">
                최대 너비 (max-width)
              </label>
              <input
                type="text"
                value={selectedElement.style?.maxWidth || ''}
                onChange={(e) => handleStyleChange('maxWidth', e.target.value)}
                className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
                placeholder="예: 800px"
              />
              <label className="block mt-3 mb-1 text-xs text-text-muted">
                최소 높이 (min-height)
              </label>
              <input
                type="text"
                value={selectedElement.style?.minHeight || ''}
                onChange={(e) => handleStyleChange('minHeight', e.target.value)}
                className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
                placeholder="예: 100px"
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-muted">
            요소를 선택하면 속성이 여기에 표시됩니다.
          </p>
        )}
      </div>
    </div>
  )
}

export default RightPanel
