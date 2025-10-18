import type { HTMLElement } from '../types/editor'

// 쇼핑몰 상세 페이지 샘플 템플릿
export const SAMPLE_TEMPLATE: HTMLElement[] = [
  {
    id: 'header-1',
    type: 'header',
    tagName: 'header',
    style: {
      backgroundColor: '#ffffff',
      padding: '40px 20px',
      textAlign: 'center',
      borderBottom: '2px solid #e0e0e0',
    },
    children: [],
    parentId: null,
  },
  {
    id: 'header-h1',
    type: 'h1',
    tagName: 'h1',
    textContent: '프리미엄 상품 이름',
    style: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#333333',
      margin: '0 0 10px 0',
    },
    children: [],
    parentId: 'header-1',
  },
  {
    id: 'header-p',
    type: 'p',
    tagName: 'p',
    textContent: '최고급 품질의 상품을 만나보세요',
    style: {
      fontSize: '16px',
      color: '#666666',
      margin: '0',
    },
    children: [],
    parentId: 'header-1',
  },
  {
    id: 'section-main',
    type: 'section',
    tagName: 'section',
    style: {
      backgroundColor: '#f9f9f9',
      padding: '60px 20px',
    },
    children: [],
    parentId: null,
  },
  {
    id: 'section-main-h2',
    type: 'h2',
    tagName: 'h2',
    textContent: '상품 특징',
    style: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#333333',
      textAlign: 'center',
      marginBottom: '40px',
    },
    children: [],
    parentId: 'section-main',
  },
  {
    id: 'section-main-p1',
    type: 'p',
    tagName: 'p',
    textContent: '✓ 프리미엄 소재 사용',
    style: {
      fontSize: '18px',
      color: '#444444',
      marginBottom: '15px',
      paddingLeft: '20px',
    },
    children: [],
    parentId: 'section-main',
  },
  {
    id: 'section-main-p2',
    type: 'p',
    tagName: 'p',
    textContent: '✓ 친환경 제조 공정',
    style: {
      fontSize: '18px',
      color: '#444444',
      marginBottom: '15px',
      paddingLeft: '20px',
    },
    children: [],
    parentId: 'section-main',
  },
  {
    id: 'section-main-p3',
    type: 'p',
    tagName: 'p',
    textContent: '✓ 1년 품질 보증',
    style: {
      fontSize: '18px',
      color: '#444444',
      marginBottom: '15px',
      paddingLeft: '20px',
    },
    children: [],
    parentId: 'section-main',
  },
  {
    id: 'section-info',
    type: 'section',
    tagName: 'section',
    style: {
      backgroundColor: '#ffffff',
      padding: '60px 20px',
    },
    children: [],
    parentId: null,
  },
  {
    id: 'section-info-h2',
    type: 'h2',
    tagName: 'h2',
    textContent: '상세 정보',
    style: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#333333',
      textAlign: 'center',
      marginBottom: '30px',
    },
    children: [],
    parentId: 'section-info',
  },
  {
    id: 'section-info-p',
    type: 'p',
    tagName: 'p',
    textContent:
      '이 상품은 최고급 원료만을 사용하여 제작되었습니다. 엄격한 품질 관리를 통해 고객님께 최상의 제품을 제공합니다.',
    style: {
      fontSize: '16px',
      color: '#555555',
      lineHeight: '1.8',
      textAlign: 'center',
    },
    children: [],
    parentId: 'section-info',
  },
  {
    id: 'footer-1',
    type: 'footer',
    tagName: 'footer',
    style: {
      backgroundColor: '#333333',
      color: '#ffffff',
      padding: '30px 20px',
      textAlign: 'center',
    },
    children: [],
    parentId: null,
  },
  {
    id: 'footer-p',
    type: 'p',
    tagName: 'p',
    textContent: '© 2025 Your Brand. All rights reserved.',
    style: {
      fontSize: '14px',
      margin: '0',
    },
    children: [],
    parentId: 'footer-1',
  },
]

// 부모-자식 관계를 기반으로 children 배열을 채우는 함수
export function buildElementTree(elements: HTMLElement[]): HTMLElement[] {
  const elementMap = new Map(elements.map((el) => [el.id, { ...el }]))

  // children 배열 초기화
  elementMap.forEach((el) => {
    el.children = []
  })

  // 부모-자식 관계 구축
  elementMap.forEach((el) => {
    if (el.parentId) {
      const parent = elementMap.get(el.parentId)
      if (parent) {
        parent.children.push(el)
      }
    }
  })

  // 최상위 요소만 반환 (parentId가 null인 요소)
  return Array.from(elementMap.values()).filter((el) => el.parentId === null)
}
