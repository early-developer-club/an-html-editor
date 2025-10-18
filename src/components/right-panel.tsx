import { useEditorStore } from '../stores/editor-store'

function RightPanel() {
  const selectedElementId = useEditorStore((state) => state.selectedElementId)
  const elements = useEditorStore((state) => state.elements)

  const selectedElement = elements.find((el) => el.id === selectedElementId)

  return (
    <div className="right-panel">
      <div className="panel-header">속성</div>
      <div className="panel-content">
        {selectedElement ? (
          <div>
            <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>
              {selectedElement.tagName}
            </h3>
            <p style={{ color: '#858585', fontSize: '12px' }}>
              ID: {selectedElement.id}
            </p>
            <p style={{ color: '#858585', fontSize: '12px' }}>
              Type: {selectedElement.type}
            </p>
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
