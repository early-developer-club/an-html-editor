import type { HTMLElement, HTMLElementType } from '../../../types/editor'

const createElement = (
  type: HTMLElementType,
  tagName: string,
  defaultContent: string,
  defaultStyle: React.CSSProperties = {},
  additionalProps: Partial<HTMLElement> = {}
): HTMLElement => {
  return {
    id: `element-${Date.now()}`,
    type,
    tagName,
    textContent: defaultContent,
    style: defaultStyle,
    children: [],
    parentId: null,
    ...additionalProps,
  }
}

const ELEMENT_CONFIGS: Record<
  HTMLElementType,
  { tagName: string; content: string; style: React.CSSProperties }
> = {
  section: {
    tagName: 'section',
    content: '',
    style: { padding: '40px 20px', backgroundColor: '#ffffff' },
  },
  header: {
    tagName: 'header',
    content: '',
    style: { padding: '30px 20px', backgroundColor: '#f9f9f9' },
  },
  footer: {
    tagName: 'footer',
    content: '',
    style: {
      padding: '30px 20px',
      backgroundColor: '#333333',
      color: '#ffffff',
    },
  },
  div: { tagName: 'div', content: '', style: { padding: '10px' } },
  h1: {
    tagName: 'h1',
    content: '제목 1',
    style: { fontSize: '32px', fontWeight: 'bold', margin: '0' },
  },
  h2: {
    tagName: 'h2',
    content: '제목 2',
    style: { fontSize: '28px', fontWeight: 'bold', margin: '0' },
  },
  h3: {
    tagName: 'h3',
    content: '제목 3',
    style: { fontSize: '24px', fontWeight: 'bold', margin: '0' },
  },
  p: {
    tagName: 'p',
    content: '텍스트를 입력하세요',
    style: { fontSize: '16px', lineHeight: '1.6' },
  },
  article: { tagName: 'article', content: '', style: {} },
  main: { tagName: 'main', content: '', style: {} },
  nav: { tagName: 'nav', content: '', style: {} },
  aside: { tagName: 'aside', content: '', style: {} },
  h4: { tagName: 'h4', content: '제목 4', style: { fontSize: '20px' } },
  h5: { tagName: 'h5', content: '제목 5', style: { fontSize: '18px' } },
  h6: { tagName: 'h6', content: '제목 6', style: { fontSize: '16px' } },
  span: { tagName: 'span', content: '스팬', style: {} },
  img: { tagName: 'img', content: '', style: { width: '100%' } },
  a: { tagName: 'a', content: '링크', style: { color: '#0066cc' } },
  button: {
    tagName: 'button',
    content: '버튼',
    style: { padding: '10px 20px', cursor: 'pointer' },
  },
  ul: { tagName: 'ul', content: '', style: {} },
  ol: { tagName: 'ol', content: '', style: {} },
  li: { tagName: 'li', content: '목록 항목', style: {} },
}

export const createElementByType = (
  type: HTMLElementType,
  parentId?: string
): HTMLElement => {
  const config = ELEMENT_CONFIGS[type]

  // img 태그는 특별 처리 (src, alt 속성 추가)
  if (type === 'img') {
    return createElement(type, config.tagName, config.content, config.style, {
      src: 'https://picsum.photos/seed/placeholder/400/300',
      alt: '이미지 설명을 입력하세요',
      parentId: parentId || null,
    })
  }

  return createElement(type, config.tagName, config.content, config.style, {
    parentId: parentId || null,
  })
}
