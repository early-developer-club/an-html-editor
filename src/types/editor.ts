import { CSSProperties } from 'react'

// HTML 요소 타입 정의
export type HTMLElementType =
  | 'div'
  | 'section'
  | 'article'
  | 'header'
  | 'footer'
  | 'main'
  | 'nav'
  | 'aside'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'img'
  | 'a'
  | 'button'
  | 'ul'
  | 'ol'
  | 'li'

// 인라인 스타일 속성 (쇼핑몰 플랫폼 호환성을 위해 인라인만 사용)
// React의 CSSProperties를 사용하여 타입 안정성 확보
export type ElementStyle = CSSProperties

// 에디터에서 사용하는 HTML 요소 구조
export interface HTMLElement {
  id: string
  type: HTMLElementType
  tagName: string // 실제 HTML 태그명
  textContent?: string
  attributes?: Record<string, string>
  style: ElementStyle
  children: HTMLElement[]
  parentId: string | null
}

// 에셋 (이미지, 아이콘 등)
export interface Asset {
  id: string
  name: string
  type: 'image' | 'icon'
  url: string
  width?: number
  height?: number
  size?: number // bytes
  uploadedAt: Date
}

// 캔버스 상태
export interface CanvasState {
  zoom: number // 0.1 ~ 3.0
  panX: number
  panY: number
}

// 에디터 히스토리 (실행 취소/다시 실행용)
export interface EditorHistory {
  past: HTMLElement[][]
  future: HTMLElement[][]
}
