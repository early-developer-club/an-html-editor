import { useEffect, useState } from "react";

interface DeleteButtonPosition {
  top: number;
  right: number;
}

interface UseDeleteButtonPositionProps {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  selectedElementId: string | null;
}

/**
 * 선택된 요소의 버튼 위치 계산
 */
export function useButtonPosition({ iframeRef, selectedElementId }: UseDeleteButtonPositionProps) {
  const [buttonPos, setButtonPos] = useState<DeleteButtonPosition | null>(null);

  useEffect(() => {
    if (!selectedElementId || !iframeRef.current) {
      setButtonPos(null);
      return;
    }

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    const iframeWindow = iframe.contentWindow;

    if (!iframeDoc || !iframeWindow) return;

    const setupButtonPosition = () => {
      const element = iframeDoc.querySelector(`[data-element-id="${selectedElementId}"]`) as HTMLElement;

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });

        // 삭제 버튼 위치 계산
        const updateDeleteButtonPosition = () => {
          const iframeRect = iframe.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();

          setButtonPos({
            top: iframeRect.top + elementRect.top - 30,
            right: window.innerWidth - (iframeRect.left + elementRect.right) - 4,
          });
        };

        // 초기 위치 계산 (약간 지연시켜서 높이 조정이 먼저 일어나도록)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            updateDeleteButtonPosition();
          });
        });

        // 스크롤 이벤트 리스너
        const scrollContainer = iframe.parentElement;
        const listeners: (() => void)[] = [];

        if (scrollContainer) {
          scrollContainer.addEventListener("scroll", updateDeleteButtonPosition);
          listeners.push(() => scrollContainer.removeEventListener("scroll", updateDeleteButtonPosition));
        }

        // iframe 크기 변화 감지 (높이 조정 시 버튼 위치 재계산)
        const resizeObserver = new ResizeObserver(() => {
          updateDeleteButtonPosition();
        });
        resizeObserver.observe(iframe);
        listeners.push(() => resizeObserver.disconnect());

        // window 리사이즈 감지
        window.addEventListener("resize", updateDeleteButtonPosition);
        listeners.push(() => window.removeEventListener("resize", updateDeleteButtonPosition));

        return () => {
          listeners.forEach((cleanup) => cleanup());
        };
      }
    };

    // iframe의 모든 리소스(스크립트, 이미지 등) 로드 완료를 기다림
    let cleanup: (() => void) | undefined;

    const handleLoad = () => {
      cleanup = setupButtonPosition();
    };

    if (iframeDoc.readyState === "complete") {
      // 이미 로드 완료
      cleanup = setupButtonPosition();
    } else {
      // load 이벤트 대기
      iframeWindow.addEventListener("load", handleLoad, { once: true });
    }

    return () => {
      cleanup?.();
      iframeWindow.removeEventListener("load", handleLoad);
    };
  }, [selectedElementId, iframeRef]);

  return buttonPos;
}
