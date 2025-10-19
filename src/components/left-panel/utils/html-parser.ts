import type { HTMLElement, HTMLElementType } from '../../../types/editor'

export const parseHTMLToElements = (htmlString: string): HTMLElement[] => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  const bodyElement = doc.body

  const convertedElements: HTMLElement[] = []
  let idCounter = Date.now()

  // CSS 문자열을 React style 객체로 변환
  const parseStyleString = (styleString: string): React.CSSProperties => {
    const style: Record<string, string> = {}
    if (!styleString) return style

    styleString.split(';').forEach((declaration) => {
      const [property, value] = declaration.split(':').map((s) => s.trim())
      if (property && value) {
        // kebab-case를 camelCase로 변환
        const camelProperty = property.replace(/-([a-z])/g, (g) =>
          g[1].toUpperCase()
        )
        style[camelProperty] = value
      }
    })

    return style
  }

  // DOM 노드를 HTMLElement로 변환 (재귀)
  const convertNode = (
    node: Node,
    parentId: string | null
  ): HTMLElement | null => {
    // 텍스트 노드는 부모에서 처리
    if (node.nodeType === Node.TEXT_NODE) {
      return null
    }

    // Element 노드만 처리
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null
    }

    const domElement = node as Element
    const tagName = domElement.tagName.toLowerCase()

    // html, head, body 태그는 스킵
    if (['html', 'head', 'body', 'meta', 'title'].includes(tagName)) {
      // 자식 노드들만 처리
      Array.from(domElement.childNodes).forEach((child) => {
        const converted = convertNode(child, parentId)
        if (converted) {
          convertedElements.push(converted)
        }
      })
      return null
    }

    const id = `element-${idCounter++}`
    const styleAttr = domElement.getAttribute('style')
    const style = styleAttr ? parseStyleString(styleAttr) : {}

    // 텍스트 컨텐츠 추출 (직접 자식 텍스트만)
    let textContent = ''
    Array.from(domElement.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE && child.textContent) {
        textContent += child.textContent.trim()
      }
    })

    const newElement: HTMLElement = {
      id,
      type: tagName as HTMLElementType,
      tagName: tagName,
      textContent: textContent || '',
      style,
      children: [],
      parentId,
    }

    // img 태그 특수 처리
    if (tagName === 'img') {
      newElement.src = domElement.getAttribute('src') || ''
      newElement.alt = domElement.getAttribute('alt') || ''
      newElement.textContent = '' // img는 textContent 없음
    }

    // a 태그 특수 처리
    if (tagName === 'a') {
      newElement.href = domElement.getAttribute('href') || '#'
    }

    convertedElements.push(newElement)

    // 자식 요소 처리
    Array.from(domElement.childNodes).forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        convertNode(child, id)
      }
    })

    return newElement
  }

  // body의 모든 자식 노드를 변환
  Array.from(bodyElement.childNodes).forEach((child) => {
    convertNode(child, null)
  })

  return convertedElements
}
