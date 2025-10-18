import { useEditorStore } from '../stores/editor-store'

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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '6px 8px',
    backgroundColor: '#2d2d30',
    color: '#cccccc',
    border: '1px solid #3e3e42',
    borderRadius: '4px',
    fontSize: '12px',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    color: '#858585',
    marginBottom: '4px',
    marginTop: '12px',
  }

  const sectionStyle: React.CSSProperties = {
    borderBottom: '1px solid #3e3e42',
    paddingBottom: '12px',
    marginBottom: '12px',
  }

  return (
    <div className="right-panel">
      <div className="panel-header">속성</div>
      <div className="panel-content">
        {selectedElement ? (
          <div>
            {/* 기본 정보 */}
            <div style={sectionStyle}>
              <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>
                {selectedElement.tagName}
              </h3>
              <p style={{ color: '#858585', fontSize: '11px' }}>
                ID: {selectedElement.id}
              </p>
            </div>

            {/* 텍스트 내용 */}
            <div style={sectionStyle}>
              <label style={labelStyle}>텍스트 내용</label>
              <textarea
                value={selectedElement.textContent || ''}
                onChange={(e) => handleTextContentChange(e.target.value)}
                style={{
                  ...inputStyle,
                  minHeight: '80px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
                placeholder="텍스트를 입력하세요"
              />
            </div>

            {/* 레이아웃 */}
            <div style={sectionStyle}>
              <h4 style={{ fontSize: '12px', marginBottom: '8px', color: '#cccccc' }}>
                레이아웃
              </h4>
              <label style={labelStyle}>패딩 (padding)</label>
              <input
                type="text"
                value={selectedElement.style?.padding || ''}
                onChange={(e) => handleStyleChange('padding', e.target.value)}
                style={inputStyle}
                placeholder="예: 10px 20px"
              />
              <label style={labelStyle}>마진 (margin)</label>
              <input
                type="text"
                value={selectedElement.style?.margin || ''}
                onChange={(e) => handleStyleChange('margin', e.target.value)}
                style={inputStyle}
                placeholder="예: 10px 0"
              />
            </div>

            {/* 텍스트 스타일 */}
            <div style={sectionStyle}>
              <h4 style={{ fontSize: '12px', marginBottom: '8px', color: '#cccccc' }}>
                텍스트
              </h4>
              <label style={labelStyle}>글자 크기 (font-size)</label>
              <input
                type="text"
                value={selectedElement.style?.fontSize || ''}
                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                style={inputStyle}
                placeholder="예: 16px"
              />
              <label style={labelStyle}>글자 굵기 (font-weight)</label>
              <select
                value={selectedElement.style?.fontWeight || 'normal'}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                style={inputStyle}
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
              <label style={labelStyle}>글자 색상 (color)</label>
              <input
                type="text"
                value={selectedElement.style?.color || ''}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                style={inputStyle}
                placeholder="예: #333333"
              />
              <label style={labelStyle}>정렬 (text-align)</label>
              <select
                value={selectedElement.style?.textAlign || 'left'}
                onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                style={inputStyle}
              >
                <option value="left">왼쪽</option>
                <option value="center">가운데</option>
                <option value="right">오른쪽</option>
                <option value="justify">양쪽 정렬</option>
              </select>
              <label style={labelStyle}>줄 간격 (line-height)</label>
              <input
                type="text"
                value={selectedElement.style?.lineHeight || ''}
                onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
                style={inputStyle}
                placeholder="예: 1.6"
              />
            </div>

            {/* 배경 및 테두리 */}
            <div style={sectionStyle}>
              <h4 style={{ fontSize: '12px', marginBottom: '8px', color: '#cccccc' }}>
                배경 & 테두리
              </h4>
              <label style={labelStyle}>배경색 (background-color)</label>
              <input
                type="text"
                value={selectedElement.style?.backgroundColor || ''}
                onChange={(e) =>
                  handleStyleChange('backgroundColor', e.target.value)
                }
                style={inputStyle}
                placeholder="예: #ffffff"
              />
              <label style={labelStyle}>테두리 (border)</label>
              <input
                type="text"
                value={selectedElement.style?.border || ''}
                onChange={(e) => handleStyleChange('border', e.target.value)}
                style={inputStyle}
                placeholder="예: 1px solid #000"
              />
              <label style={labelStyle}>모서리 둥글기 (border-radius)</label>
              <input
                type="text"
                value={selectedElement.style?.borderRadius || ''}
                onChange={(e) =>
                  handleStyleChange('borderRadius', e.target.value)
                }
                style={inputStyle}
                placeholder="예: 4px"
              />
            </div>

            {/* 크기 */}
            <div>
              <h4 style={{ fontSize: '12px', marginBottom: '8px', color: '#cccccc' }}>
                크기
              </h4>
              <label style={labelStyle}>너비 (width)</label>
              <input
                type="text"
                value={selectedElement.style?.width || ''}
                onChange={(e) => handleStyleChange('width', e.target.value)}
                style={inputStyle}
                placeholder="예: 100% 또는 300px"
              />
              <label style={labelStyle}>높이 (height)</label>
              <input
                type="text"
                value={selectedElement.style?.height || ''}
                onChange={(e) => handleStyleChange('height', e.target.value)}
                style={inputStyle}
                placeholder="예: auto 또는 200px"
              />
              <label style={labelStyle}>최대 너비 (max-width)</label>
              <input
                type="text"
                value={selectedElement.style?.maxWidth || ''}
                onChange={(e) => handleStyleChange('maxWidth', e.target.value)}
                style={inputStyle}
                placeholder="예: 800px"
              />
              <label style={labelStyle}>최소 높이 (min-height)</label>
              <input
                type="text"
                value={selectedElement.style?.minHeight || ''}
                onChange={(e) => handleStyleChange('minHeight', e.target.value)}
                style={inputStyle}
                placeholder="예: 100px"
              />
            </div>
          </div>
        ) : (
          <p style={{ color: '#858585', fontSize: '13px' }}>
            요소를 선택하면 속성이 여기에 표시됩니다.
          </p>
        )}
      </div>
    </div>
  )
}

export default RightPanel
