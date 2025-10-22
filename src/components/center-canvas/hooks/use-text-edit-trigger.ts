import { useEffect } from "react";

interface UseTextEditTriggerProps {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  elementId: string | null;
  onSetEditingElementId: (id: string | null) => void;
}

/**
 * 외부에서 텍스트 편집 모드를 트리거할 수 있는 훅
 */
export function useTextEditTrigger({ iframeRef, elementId, onSetEditingElementId }: UseTextEditTriggerProps) {
  useEffect(() => {
    if (!elementId || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!iframeDoc) return;

    // requestAnimationFrame으로 DOM 렌더링 완료 후 실행
    requestAnimationFrame(() => {
      const element = iframeDoc.querySelector(`[data-element-id="${elementId}"]`) as HTMLElement;

      if (element) {
        onSetEditingElementId(elementId);
        element.contentEditable = "true";

        // focus와 selection을 순차적으로 처리
        requestAnimationFrame(() => {
          element.focus();

          // 한 프레임 더 기다린 후 텍스트 선택
          requestAnimationFrame(() => {
            const selection = iframeDoc.getSelection();
            if (selection) {
              const range = iframeDoc.createRange();
              range.selectNodeContents(element);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          });
        });
      }
    });
  }, [elementId, iframeRef, onSetEditingElementId]);
}
