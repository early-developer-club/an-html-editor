import type {
  HTMLElement,
  HTMLDocumentMetadata,
} from '../../../types/editor'

export const generateHTML = (
  elements: HTMLElement[],
  metadata?: HTMLDocumentMetadata | null
): string => {
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

    // 일반 속성들을 HTML 속성 문자열로 변환
    const attributesString = element.attributes
      ? Object.entries(element.attributes)
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ')
      : ''

    // img 태그 처리
    if (element.tagName === 'img') {
      const attrs = [
        element.src ? `src="${element.src}"` : '',
        element.alt ? `alt="${element.alt}"` : '',
        attributesString,
        styleString ? `style="${styleString}"` : '',
      ]
        .filter(Boolean)
        .join(' ')
      return `${indentation}<img ${attrs} />`
    }

    // a 태그 처리
    if (element.tagName === 'a') {
      const href = element.href || '#'
      const attrs = [
        `href="${href}"`,
        attributesString,
        styleString ? `style="${styleString}"` : '',
      ]
        .filter(Boolean)
        .join(' ')
      const content =
        element.textContent ||
        children.map((child) => elementToHTML(child, indent + 1)).join('\n')
      return `${indentation}<a ${attrs}>${children.length > 0 ? '\n' + content + '\n' + indentation : element.textContent || ''}</a>`
    }

    // 일반 태그 처리
    const allAttrs = [attributesString, styleString ? `style="${styleString}"` : '']
      .filter(Boolean)
      .join(' ')
    const openTag = `${indentation}<${element.tagName}${allAttrs ? ' ' + allAttrs : ''}>`
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

  // 메타데이터가 있으면 원본 그대로 사용, 없으면 기본값 사용
  if (metadata) {
    const htmlAttrs = Object.entries(metadata.htmlAttributes)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ')

    return `<!DOCTYPE ${metadata.doctype}>
<html${htmlAttrs ? ' ' + htmlAttrs : ''}>
  <head>
${metadata.headContent}
  </head>
  <body>
${bodyContent}
  </body>
</html>`
  }

  // 기본 HTML 문서 생성 (메타데이터 없을 때)
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
