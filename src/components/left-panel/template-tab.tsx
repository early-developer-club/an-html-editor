'use client'

import type {
  AHTMLDocumentMetadata,
  AHTMLElement,
} from '@/types/html-editor.types'
import { Download, Upload, FileText } from 'lucide-react'
import { generateHTML } from './utils/html-generator'
import { parseHTMLToElements } from './utils/html-parser'
import sampleHTML from '@/constants/sample-html.html?raw'

interface TemplateTabProps {
  elements: AHTMLElement[]
  documentMetadata: AHTMLDocumentMetadata | null
  onLoadTemplate: (
    elements: AHTMLElement[],
    metadata?: AHTMLDocumentMetadata
  ) => void
  onSwitchToLayers: () => void
}

function TemplateTab({
  elements,
  documentMetadata,
  onLoadTemplate,
  onSwitchToLayers,
}: TemplateTabProps) {
  const handleLoadSampleHTML = () => {
    if (
      elements.length > 0 &&
      !confirm('현재 작업 중인 내용이 삭제됩니다. 계속하시겠습니까?')
    ) {
      return
    }

    try {
      const parseResult = parseHTMLToElements(sampleHTML)
      if (parseResult.elements.length === 0) {
        alert('유효한 HTML 요소를 찾을 수 없습니다.')
        return
      }

      onLoadTemplate(parseResult.elements, parseResult.metadata)
      alert(`샘플 HTML을 불러왔습니다. (${parseResult.elements.length}개 요소)`)
      onSwitchToLayers()
    } catch (error) {
      console.error('샘플 HTML 로드 에러:', error)
      alert('샘플 HTML을 불러오는 중 오류가 발생했습니다.')
    }
  }

  const handleDownloadHTML = () => {
    if (elements.length === 0) {
      alert('다운로드할 컨텐츠가 없습니다.')
      return
    }

    const html = generateHTML(elements, documentMetadata)
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

  const handleUploadHTML = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.html'
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const htmlString = e.target?.result as string
        if (!htmlString) {
          alert('파일을 읽을 수 없습니다.')
          return
        }

        try {
          const parseResult = parseHTMLToElements(htmlString)
          if (parseResult.elements.length === 0) {
            alert('유효한 HTML 요소를 찾을 수 없습니다.')
            return
          }

          if (
            elements.length > 0 &&
            !confirm('현재 작업 중인 내용이 삭제됩니다. 계속하시겠습니까?')
          ) {
            return
          }

          onLoadTemplate(parseResult.elements, parseResult.metadata)
          alert(`${parseResult.elements.length}개의 요소를 불러왔습니다.`)
          onSwitchToLayers()
        } catch (error) {
          console.error('HTML 파싱 에러:', error)
          alert('HTML 파일을 파싱하는 중 오류가 발생했습니다.')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div>
      {/* 샘플 HTML 불러오기 버튼 */}
      <button
        onClick={handleLoadSampleHTML}
        className="w-full p-2 mb-2 font-bold text-white border-none rounded cursor-pointer bg-green-600 hover:bg-green-700 text-sm flex items-center justify-center gap-2"
      >
        <FileText size={16} />
        샘플 HTML 불러오기
      </button>

      {/* HTML 업로드 버튼 */}
      <button
        onClick={handleUploadHTML}
        className="w-full p-2 mb-2 font-bold text-white border-none rounded cursor-pointer bg-blue-600 hover:bg-blue-700 text-sm flex items-center justify-center gap-2"
      >
        <Upload size={16} />
        HTML 업로드
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
  )
}

export default TemplateTab
