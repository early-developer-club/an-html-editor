import { useEditorStore } from '../stores/editor-store'

function LeftPanel() {
  const elements = useEditorStore((state) => state.elements)
  const selectedElementId = useEditorStore((state) => state.selectedElementId)
  const addElement = useEditorStore((state) => state.addElement)
  const selectElement = useEditorStore((state) => state.selectElement)
  const deleteElement = useEditorStore((state) => state.deleteElement)

  const handleAddSection = () => {
    const newElement = {
      id: `element-${Date.now()}`,
      type: 'section' as const,
      tagName: 'section',
      textContent: '새로운 섹션',
      style: {
        padding: '20px',
        backgroundColor: '#f5f5f5',
      },
      children: [],
      parentId: null,
    }
    addElement(newElement)
  }

  return (
    <div className="left-panel">
      <div className="panel-header">레이어</div>
      <div className="panel-content">
        <button
          onClick={handleAddSection}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '16px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          + 섹션 추가
        </button>

        {elements.length === 0 ? (
          <p style={{ color: '#858585', fontSize: '13px' }}>
            요소가 없습니다. 섹션을 추가해보세요.
          </p>
        ) : (
          <div>
            {elements.map((element) => (
              <div
                key={element.id}
                onClick={() => selectElement(element.id)}
                style={{
                  padding: '8px',
                  marginBottom: '4px',
                  backgroundColor:
                    selectedElementId === element.id ? '#094771' : '#2d2d30',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{element.tagName}</span>
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
                    fontSize: '11px',
                  }}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LeftPanel
