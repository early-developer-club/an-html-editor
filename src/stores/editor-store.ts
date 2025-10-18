import { create } from 'zustand'
import type {
  HTMLElement,
  Asset,
  CanvasState,
  EditorHistory,
} from '../types/editor'

interface EditorState {
  // 페이지 요소들 (DOM 트리)
  elements: HTMLElement[]

  // 선택된 요소 ID
  selectedElementId: string | null

  // 에셋 리스트
  assets: Asset[]

  // 캔버스 상태
  canvas: CanvasState

  // 히스토리 (실행 취소/다시 실행)
  history: EditorHistory

  // Actions
  // 요소 관련
  addElement: (element: HTMLElement, parentId?: string) => void
  updateElement: (id: string, updates: Partial<HTMLElement>) => void
  deleteElement: (id: string) => void
  selectElement: (id: string | null) => void

  // 에셋 관련
  addAsset: (asset: Asset) => void
  deleteAsset: (id: string) => void

  // 캔버스 관련
  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void
  resetCanvas: () => void

  // 히스토리 관련
  undo: () => void
  redo: () => void

  // 유틸리티
  clearAll: () => void
  loadTemplate: (elements: HTMLElement[]) => void
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

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  elements: [],
  selectedElementId: null,
  assets: [],
  canvas: INITIAL_CANVAS_STATE,
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
      }
    })
  },

  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
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
      }
    })
  },

  selectElement: (id) => {
    set({ selectedElementId: id })
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

  undo: () => {
    // TODO: 히스토리 기능 구현
    console.log('Undo not implemented yet')
  },

  redo: () => {
    // TODO: 히스토리 기능 구현
    console.log('Redo not implemented yet')
  },

  clearAll: () => {
    set({
      elements: [],
      selectedElementId: null,
      assets: [],
      canvas: INITIAL_CANVAS_STATE,
      history: INITIAL_HISTORY,
    })
  },

  loadTemplate: (elements) => {
    set({
      elements: elements,
      selectedElementId: null,
    })
  },
}))
