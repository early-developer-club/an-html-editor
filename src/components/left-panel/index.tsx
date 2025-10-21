import { FileCode, Layers } from 'lucide-react'
import { useState } from 'react'
import { useEditorStore } from '../../stores/editor-store'
import LayersTab from './layers-tab'
import TemplateTab from './template-tab'

function LeftPanel() {
  const elements = useEditorStore((state) => state.elements)
  const documentMetadata = useEditorStore((state) => state.documentMetadata)
  const selectedElementId = useEditorStore((state) => state.selectedElementId)
  const isMetadataSelected = useEditorStore((state) => state.isMetadataSelected)
  const addElement = useEditorStore((state) => state.addElement)
  const selectElement = useEditorStore((state) => state.selectElement)
  const selectMetadata = useEditorStore((state) => state.selectMetadata)
  const deleteElement = useEditorStore((state) => state.deleteElement)
  const loadTemplate = useEditorStore((state) => state.loadTemplate)
  const moveElement = useEditorStore((state) => state.moveElement)
  const reorderElements = useEditorStore((state) => state.reorderElements)
  const [activeTab, setActiveTab] = useState<'template' | 'layers'>('template')

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
          <TemplateTab
            elements={elements}
            documentMetadata={documentMetadata}
            onLoadTemplate={loadTemplate}
            onSwitchToLayers={() => setActiveTab('layers')}
          />
        )}

        {/* 레이어 탭 */}
        {activeTab === 'layers' && (
          <LayersTab
            elements={elements}
            selectedElementId={selectedElementId}
            isMetadataSelected={isMetadataSelected}
            hasMetadata={documentMetadata !== null}
            onAddElement={addElement}
            onSelectElement={selectElement}
            onSelectMetadata={selectMetadata}
            onDeleteElement={deleteElement}
            onMoveElement={moveElement}
            onReorderElements={reorderElements}
          />
        )}
      </div>
    </div>
  )
}

export default LeftPanel
