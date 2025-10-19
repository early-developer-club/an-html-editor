import type { HTMLElement } from '../../../types/editor'

export const generateHTML = (elements: HTMLElement[]): string => {
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

    // img 태그 처리
    if (element.tagName === 'img') {
      return `${indentation}<img src="${element.src || ''}" alt="${element.alt || ''}"${styleString ? ` style="${styleString}"` : ''} />`
    }

    // a 태그 처리
    if (element.tagName === 'a') {
      const href = element.href || '#'
      const content =
        element.textContent ||
        children.map((child) => elementToHTML(child, indent + 1)).join('\n')
      return `${indentation}<a href="${href}"${styleString ? ` style="${styleString}"` : ''}>${children.length > 0 ? '\n' + content + '\n' + indentation : element.textContent || ''}</a>`
    }

    // 일반 태그 처리
    const openTag = `${indentation}<${element.tagName}${styleString ? ` style="${styleString}"` : ''}>`
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

  // 완전한 HTML 문서 생성
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
