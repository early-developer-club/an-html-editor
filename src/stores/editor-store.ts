import { create } from 'zustand'
import type {
  AHTMLElement,
  Asset,
  CanvasState,
  EditorHistory,
  AHTMLDocumentMetadata,
} from '../types/editor'

interface EditorState {
  // 페이지 요소들 (DOM 트리)
  elements: AHTMLElement[]

  // HTML 문서 메타데이터 (DOCTYPE, html 속성, head 내용 등)
  documentMetadata: AHTMLDocumentMetadata | null

  // 선택된 요소 ID
  selectedElementId: string | null

  // 메타데이터 선택 여부
  isMetadataSelected: boolean

  // 에셋 리스트
  assets: Asset[]

  // 캔버스 상태
  canvas: CanvasState

  // 캔버스 배경 테마
  canvasTheme: 'dark' | 'light'

  // 히스토리 (실행 취소/다시 실행)
  history: EditorHistory

  // Actions
  // 요소 관련
  addElement: (element: AHTMLElement, parentId?: string) => void
  updateElement: (id: string, updates: Partial<AHTMLElement>) => void
  deleteElement: (id: string) => void
  selectElement: (id: string | null) => void
  selectMetadata: () => void
  moveElement: (elementId: string, newParentId: string | null) => void
  reorderElements: (elements: AHTMLElement[]) => void

  // 에셋 관련
  addAsset: (asset: Asset) => void
  deleteAsset: (id: string) => void

  // 캔버스 관련
  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void
  resetCanvas: () => void
  setCanvasTheme: (theme: 'dark' | 'light') => void

  // 히스토리 관련
  undo: () => void
  redo: () => void

  // 유틸리티
  clearAll: () => void
  loadTemplate: (
    elements: AHTMLElement[],
    metadata?: AHTMLDocumentMetadata
  ) => void
  setDocumentMetadata: (metadata: AHTMLDocumentMetadata) => void
}

const INITIAL_CANVAS_STATE: CanvasState = {
  zoom: 1.0,
  panX: 0,
  panY: 0,
}

const INITIAL_HISTORY: EditorHistory = {
  past: [],
  future: [],
}

export const useEditorStore = create<EditorState>((set) => ({
  // Initial state
  elements: [],
  documentMetadata: null,
  selectedElementId: null,
  isMetadataSelected: false,
  assets: [],
  canvas: INITIAL_CANVAS_STATE,
  canvasTheme: 'light',
  history: INITIAL_HISTORY,

  // Actions
  addElement: (element, parentId) => {
    set((state) => {
      const newElement = {
        ...element,
        parentId: parentId || null,
      }

      return {
        elements: [...state.elements, newElement],
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      }
    })
  },

  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
      history: {
        past: [...state.history.past, state.elements],
        future: [],
      },
    }))
  },

  deleteElement: (id) => {
    set((state) => {
      // 자식 요소도 함께 삭제
      const deleteWithChildren = (elementId: string): string[] => {
        const children = state.elements.filter((el) => el.parentId === elementId)
        const childIds = children.flatMap((child) =>
          deleteWithChildren(child.id)
        )
        return [elementId, ...childIds]
      }

      const idsToDelete = deleteWithChildren(id)

      return {
        elements: state.elements.filter((el) => !idsToDelete.includes(el.id)),
        selectedElementId:
          state.selectedElementId === id ? null : state.selectedElementId,
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      }
    })
  },

  selectElement: (id) => {
    set({ selectedElementId: id, isMetadataSelected: false })
  },

  selectMetadata: () => {
    set({ isMetadataSelected: true, selectedElementId: null })
  },

  moveElement: (elementId, newParentId) => {
    set((state) => {
      // 자기 자신을 부모로 설정할 수 없음
      if (elementId === newParentId) {
        return state
      }

      // 순환 참조 방지: newParentId가 elementId의 자손인지 확인
      const isDescendant = (parentId: string, targetId: string): boolean => {
        const element = state.elements.find((el) => el.id === parentId)
        if (!element) return false
        if (element.parentId === targetId) return true
        if (element.parentId) {
          return isDescendant(element.parentId, targetId)
        }
        return false
      }

      if (newParentId && isDescendant(newParentId, elementId)) {
        console.warn('순환 참조를 만들 수 없습니다.')
        return state
      }

      return {
        elements: state.elements.map((el) =>
          el.id === elementId ? { ...el, parentId: newParentId } : el
        ),
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      }
    })
  },

  reorderElements: (elements) => {
    set((state) => ({
      elements,
      history: {
        past: [...state.history.past, state.elements],
        future: [],
      },
    }))
  },

  addAsset: (asset) => {
    set((state) => ({
      assets: [...state.assets, asset],
    }))
  },

  deleteAsset: (id) => {
    set((state) => ({
      assets: state.assets.filter((asset) => asset.id !== id),
    }))
  },

  setZoom: (zoom) => {
    const clampedZoom = Math.min(Math.max(zoom, 0.1), 3.0)
    set((state) => ({
      canvas: { ...state.canvas, zoom: clampedZoom },
    }))
  },

  setPan: (x, y) => {
    set((state) => ({
      canvas: { ...state.canvas, panX: x, panY: y },
    }))
  },

  resetCanvas: () => {
    set({ canvas: INITIAL_CANVAS_STATE })
  },

  setCanvasTheme: (theme) => {
    set({ canvasTheme: theme })
  },

  undo: () => {
    set((state) => {
      if (state.history.past.length === 0) return state

      const previous = state.history.past[state.history.past.length - 1]
      const newPast = state.history.past.slice(0, -1)

      return {
        elements: previous,
        history: {
          past: newPast,
          future: [state.elements, ...state.history.future],
        },
      }
    })
  },

  redo: () => {
    set((state) => {
      if (state.history.future.length === 0) return state

      const next = state.history.future[0]
      const newFuture = state.history.future.slice(1)

      return {
        elements: next,
        history: {
          past: [...state.history.past, state.elements],
          future: newFuture,
        },
      }
    })
  },

  clearAll: () => {
    set({
      elements: [],
      documentMetadata: null,
      selectedElementId: null,
      assets: [],
      canvas: INITIAL_CANVAS_STATE,
      history: INITIAL_HISTORY,
    })
  },

  loadTemplate: (elements, metadata) => {
    set({
      elements: elements,
      documentMetadata: metadata || null,
      selectedElementId: null,
    })
  },

  setDocumentMetadata: (metadata) => {
    set({ documentMetadata: metadata })
  },
}))
