import { useEditorStore } from '../stores/editor-store'
import SpacingInput from './spacing-input'

function RightPanel() {
  const selectedElementId = useEditorStore((state) => state.selectedElementId)
  const elements = useEditorStore((state) => state.elements)
  const updateElement = useEditorStore((state) => state.updateElement)

  const selectedElement = elements.find((el) => el.id === selectedElementId)

  const handleTextContentChange = (value: string) => {
    if (selectedElement) {
      updateElement(selectedElement.id, { textContent: value })
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
    <div className="flex flex-col overflow-hidden border-l bg-editor-panel border-editor-border">
      <div className="p-3 px-4 font-semibold border-b text-sm bg-editor-panelHover text-editor-text border-editor-border">
        속성
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {selectedElement ? (
          <div>
            {/* 기본 정보 */}
            <div className="pb-3 mb-3 border-b border-editor-border">
              <h3 className="mb-2 text-sm">
                {selectedElement.tagName}
              </h3>
              <p className="text-xs text-editor-textMuted">
                ID: {selectedElement.id}
              </p>
            </div>

            {/* 텍스트 내용 */}
            {selectedElement.tagName !== 'img' && (
              <div className="pb-3 mb-3 border-b border-editor-border">
                <label className="block mt-3 mb-1 text-xs text-editor-textMuted">
                  텍스트 내용
                </label>
                <textarea
                  value={selectedElement.textContent || ''}
                  onChange={(e) => handleTextContentChange(e.target.value)}
                  className="w-full p-2 text-xs rounded resize-y min-h-20 bg-editor-panelHover text-editor-text border-editor-border font-inherit"
                  placeholder="텍스트를 입력하세요"
                />
              </div>
            )}

            {/* 이미지 속성 (img 태그 전용) */}
            {selectedElement.tagName === 'img' && (
              <div className="pb-3 mb-3 border-b border-editor-border">
                <h4 className="mb-2 text-xs text-editor-text">
                  이미지 속성
                </h4>
                <label className="block mt-3 mb-1 text-xs text-editor-textMuted">
                  이미지 URL (src)
                </label>
                <input
                  type="text"
                  value={selectedElement.src || ''}
                  onChange={(e) => handleAttributeChange('src', e.target.value)}
                  className="w-full p-2 text-xs rounded bg-editor-panelHover text-editor-text border-editor-border"
                  placeholder="https://example.com/image.jpg"
                />
                <label className="block mt-3 mb-1 text-xs text-editor-textMuted">
                  대체 텍스트 (alt)
                </label>
                <input
                  type="text"
                  value={selectedElement.alt || ''}
                  onChange={(e) => handleAttributeChange('alt', e.target.value)}
                  className="w-full p-2 text-xs rounded bg-editor-panelHover text-editor-text border-editor-border"
                  placeholder="이미지 설명"
                />
              </div>
            )}

            {/* 링크 속성 (a 태그 전용) */}
            {selectedElement.tagName === 'a' && (
              <div className="pb-3 mb-3 border-b border-editor-border">
                <h4 className="mb-2 text-xs text-editor-text">
                  링크 속성
                </h4>
                <label className="block mt-3 mb-1 text-xs text-editor-textMuted">
                  링크 URL (href)
                </label>
                <input
                  type="text"
                  value={selectedElement.href || ''}
                  onChange={(e) => handleAttributeChange('href', e.target.value)}
                  className="w-full p-2 text-xs rounded bg-editor-panelHover text-editor-text border-editor-border"
                  placeholder="https://example.com"
                />
              </div>
            )}

            {/* 레이아웃 */}
            <div className="pb-3 mb-3 border-b border-editor-border">
              <h4 className="mb-2 text-xs text-editor-text">레이아웃</h4>
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
            <div className="pb-3 mb-3 border-b border-editor-border">
              <h4 className="mb-2 text-xs text-editor-text">
                텍스트
              </h4>
              <label className="block mt-3 mb-1 text-xs text-editor-textMuted">
                글자 크기 (font-size)
              </label>
              <input
                type="text"
                value={selectedElement.style?.fontSize || ''}
                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                className="w-full p-2 text-xs rounded bg-editor-panelHover text-editor-text border-editor-border"
                placeholder="예: 16px"
              />
              <label className="block mt-3 mb-1 text-xs text-editor-textMuted">
                글자 굵기 (font-weight)
              </label>
              <select
                value={selectedElement.style?.fontWeight || 'normal'}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                className="w-full p-2 text-xs rounded bg-editor-panelHover text-editor-text border-editor-border"
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
              <label className="block mt-3 mb-1 text-xs text-editor-textMuted">
                글자 색상 (color)
              </label>
              <input
                type="text"
                value={selectedElement.style?.color || ''}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-full p-2 text-xs rounded bg-editor-panelHover text-editor-text border-editor-border"
                placeholder="예: #333333"
              />
              <label className="block mt-3 mb-1 text-xs text-editor-textMuted">
                정렬 (text-align)
              </label>
              <select
                value={selectedElement.style?.textAlign || 'left'}
                onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                className="w-full p-2 text-xs rounded bg-editor-panelHover text-editor-text border-editor-border"
              >
                <option value="left">왼쪽</option>
                <option value="center">가운데</option>
                <option value="right">오른쪽</option>
                <option value="justify">양쪽 정렬</option>
              </select>
              <label className="block mt-3 mb-1 text-xs text-editor-textMuted">
                줄 간격 (line-height)
              </label>
              <input
                type="text"
                value={selectedElement.style?.lineHeight || ''}
                onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
                className="w-full p-2 text-xs rounded bg-editor-panelHover text-editor-text border-editor-border"
                placeholder="예: 1.6"
              />
            </div>

            {/* 배경 및 테두리 */}
            <div className="pb-3 mb-3 border-b border-editor-border">
              <h4 className="mb-2 text-xs text-editor-text">
                배경 & 테두리
              </h4>
              <label className="block mt-3 mb-1 text-xs text-editor-textMuted">
                배경색 (background-color)
              </label>
              <input
                type="text"
                value={selectedElement.style?.backgroundColor || ''}
                onChange={(e) =>
                  handleStyleChange('backgroundColor', e.target.value)
                }
                className="w-full p-2 text-xs rounded bg-editor-panelHover text-editor-text border-editor-border"
                placeholder="예: #ffffff"
              />
              <label className="block mt-3 mb-1 text-xs text-editor-textMuted">
                테두리 (border)
              </label>
              <input
                type="text"
                value={selectedElement.style?.border || ''}
                onChange={(e) => handleStyleChange('border', e.target.value)}
                className="w-full p-2 text-xs rounded bg-editor-panelHover text-editor-text border-editor-border"
                placeholder="예: 1px solid #000"
              />
              <label className="block mt-3 mb-1 text-xs text-editor-textMuted">
                모서리 둥글기 (border-radius)
              </label>
              <input
                type="text"
                value={selectedElement.style?.borderRadius || ''}
                onChange={(e) =>
                  handleStyleChange('borderRadius', e.target.value)
                }
                className="w-full p-2 text-xs rounded bg-editor-panelHover text-editor-text border-editor-border"
                placeholder="예: 4px"
              />
            </div>

            {/* 크기 */}
            <div>
              <h4 className="mb-2 text-xs text-editor-text">
                크기
              </h4>
              <label className="block mt-3 mb-1 text-xs text-editor-textMuted">
                너비 (width)
              </label>
              <input
                type="text"
                value={selectedElement.style?.width || ''}
                onChange={(e) => handleStyleChange('width', e.target.value)}
                className="w-full p-2 text-xs rounded bg-editor-panelHover text-editor-text border-editor-border"
                placeholder="예: 100% 또는 300px"
              />
              <label className="block mt-3 mb-1 text-xs text-editor-textMuted">
                높이 (height)
              </label>
              <input
                type="text"
                value={selectedElement.style?.height || ''}
                onChange={(e) => handleStyleChange('height', e.target.value)}
                className="w-full p-2 text-xs rounded bg-editor-panelHover text-editor-text border-editor-border"
                placeholder="예: auto 또는 200px"
              />
              <label className="block mt-3 mb-1 text-xs text-editor-textMuted">
                최대 너비 (max-width)
              </label>
              <input
                type="text"
                value={selectedElement.style?.maxWidth || ''}
                onChange={(e) => handleStyleChange('maxWidth', e.target.value)}
                className="w-full p-2 text-xs rounded bg-editor-panelHover text-editor-text border-editor-border"
                placeholder="예: 800px"
              />
              <label className="block mt-3 mb-1 text-xs text-editor-textMuted">
                최소 높이 (min-height)
              </label>
              <input
                type="text"
                value={selectedElement.style?.minHeight || ''}
                onChange={(e) => handleStyleChange('minHeight', e.target.value)}
                className="w-full p-2 text-xs rounded bg-editor-panelHover text-editor-text border-editor-border"
                placeholder="예: 100px"
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-editor-textMuted">
            요소를 선택하면 속성이 여기에 표시됩니다.
          </p>
        )}
      </div>
    </div>
  )
}

export default RightPanel
