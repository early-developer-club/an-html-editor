import { AHTMLDocumentMetadata, AHTMLElement } from "@/components/html-editor/html-editor.types";
import { useEffect } from "react";

interface UseIframeHeightProps {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  elements: AHTMLElement[];
  documentMetadata: AHTMLDocumentMetadata | null;
}

/**
 * iframe 높이를 콘텐츠에 맞게 자동 조정
 */
export function useIframeHeight({ iframeRef, elements, documentMetadata }: UseIframeHeightProps) {
  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    const iframeWindow = iframe.contentWindow;

    if (!iframeDoc || !iframeWindow) return;

    const resizeIframe = () => {
      if (!iframeDoc.body) return;

      const body = iframeDoc.body;
      const html = iframeDoc.documentElement;

      if (!body || !html) return;

      // 전체 문서의 높이 계산 (콘텐츠 실제 높이)
      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );

      iframe.style.height = `${height}px`;
    };

    const setupHeightCalculation = () => {
      if (!iframeDoc.body) return;

      // 이미지 로드 대기 및 높이 조정
      const images = Array.from(iframeDoc.querySelectorAll("img"));
      if (images.length > 0) {
        let loadedCount = 0;
        images.forEach((img) => {
          if (img.complete) {
            loadedCount++;
          } else {
            img.addEventListener("load", () => {
              loadedCount++;
              if (loadedCount === images.length) {
                resizeIframe();
              }
            });
          }
        });
        if (loadedCount === images.length) {
          setTimeout(resizeIframe, 0);
        }
      } else {
        setTimeout(resizeIframe, 0);
      }

      // ResizeObserver로 콘텐츠 변경 감지
      const resizeObserver = new ResizeObserver(() => {
        resizeIframe();
      });
      resizeObserver.observe(iframeDoc.body);

      return () => {
        resizeObserver.disconnect();
      };
    };

    // iframe의 모든 리소스(스크립트, 이미지 등) 로드 완료를 기다림
    let cleanup: (() => void) | undefined;

    const handleLoad = () => {
      cleanup = setupHeightCalculation();
    };

    if (iframeDoc.readyState === "complete") {
      // 이미 로드 완료
      cleanup = setupHeightCalculation();
    } else {
      // load 이벤트 대기
      iframeWindow.addEventListener("load", handleLoad, { once: true });
    }

    return () => {
      cleanup?.();
      iframeWindow.removeEventListener("load", handleLoad);
    };
  }, [iframeRef, elements, documentMetadata]);
}
