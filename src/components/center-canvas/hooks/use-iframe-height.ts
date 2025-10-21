import { useEffect } from 'react'

interface UseIframeHeightProps {
  iframeRef: React.RefObject<HTMLIFrameElement>
  dependencies: unknown[]
}

/**
 * iframe 높이를 콘텐츠에 맞게 자동 조정
 */
export function useIframeHeight({
  iframeRef,
  dependencies,
}: UseIframeHeightProps) {
  useEffect(() => {
    if (!iframeRef.current) return

    const iframe = iframeRef.current
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

    if (!iframeDoc) return

    const resizeIframe = () => {
      if (!iframe.contentWindow) return

      const body = iframeDoc.body
      const html = iframeDoc.documentElement

      // 전체 문서의 높이 계산
      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      )

      iframe.style.height = `${height}px`
    }

    // 이미지 로드 대기 및 높이 조정
    const images = Array.from(iframeDoc.querySelectorAll('img'))
    if (images.length > 0) {
      let loadedCount = 0
      images.forEach((img) => {
        if (img.complete) {
          loadedCount++
        } else {
          img.addEventListener('load', () => {
            loadedCount++
            if (loadedCount === images.length) {
              resizeIframe()
            }
          })
        }
      })
      if (loadedCount === images.length) {
        setTimeout(resizeIframe, 0)
      }
    } else {
      setTimeout(resizeIframe, 0)
    }

    // ResizeObserver로 콘텐츠 변경 감지
    const resizeObserver = new ResizeObserver(() => {
      resizeIframe()
    })
    resizeObserver.observe(iframeDoc.body)

    return () => {
      resizeObserver.disconnect()
    }
  }, dependencies)
}
