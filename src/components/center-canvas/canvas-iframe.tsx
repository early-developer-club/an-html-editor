import type {
  AHTMLDocumentMetadata,
  AHTMLElement,
} from '../../types/editor'
import { useIframeContent } from './hooks/use-iframe-content'
import { useIframeHeight } from './hooks/use-iframe-height'

interface CanvasIframeProps {
  iframeRef: React.RefObject<HTMLIFrameElement>
  elements: AHTMLElement[]
  documentMetadata: AHTMLDocumentMetadata | null
  selectedElementId: string | null
  editingElementId: string | null
  onSelectElement: (id: string | null) => void
  onUpdateElement: (id: string, updates: Partial<AHTMLElement>) => void
  onSetEditingElementId: (id: string | null) => void
}

function CanvasIframe({
  iframeRef,
  elements,
  documentMetadata,
  selectedElementId,
  editingElementId,
  onSelectElement,
  onUpdateElement,
  onSetEditingElementId,
}: CanvasIframeProps) {

  // iframe에 HTML 주입 및 이벤트 설정
  useIframeContent({
    iframeRef,
    elements,
    documentMetadata,
    selectedElementId,
    editingElementId,
    onSelectElement,
    onUpdateElement,
    onSetEditingElementId,
  })

  // iframe 높이 자동 조정
  useIframeHeight({
    iframeRef,
    dependencies: [elements, documentMetadata],
  })

  return (
    <iframe
      ref={iframeRef}
      title="Preview Canvas"
      style={{
        width: '100%',
        maxWidth: '960px',
        border: 'none',
        backgroundColor: 'white',
        boxShadow: '0 0 20px rgba(0,0,0,0.3)',
        display: 'block',
      }}
    />
  )
}

export default CanvasIframe
