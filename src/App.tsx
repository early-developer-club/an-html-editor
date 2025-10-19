import { useEffect } from 'react'
import LeftPanel from './components/left-panel'
import CenterCanvas from './components/center-canvas'
import RightPanel from './components/right-panel'
import { useEditorStore } from './stores/editor-store'

function App() {
  const canvasTheme = useEditorStore((state) => state.canvasTheme)

  useEffect(() => {
    console.log('Current theme:', canvasTheme)
    console.log('color-scheme before:', document.documentElement.style.colorScheme)

    // Tailwind v4의 light-dark() 함수는 CSS color-scheme 속성을 사용합니다
    document.documentElement.style.colorScheme = canvasTheme

    console.log('color-scheme after:', document.documentElement.style.colorScheme)
  }, [canvasTheme])

  return (
    <div className="grid grid-cols-[280px_1fr_320px] h-screen w-screen overflow-hidden bg-canvas-bg">
      <LeftPanel />
      <CenterCanvas />
      <RightPanel />
    </div>
  )
}

export default App
