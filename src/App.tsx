import { useEffect } from 'react'
import LeftPanel from './components/left-panel'
import CenterCanvas from './components/center-canvas'
import RightPanel from './components/right-panel'
import { useEditorStore } from './stores/editor-store'

function App() {
  const canvasTheme = useEditorStore((state) => state.canvasTheme)

  useEffect(() => {
    if (canvasTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [canvasTheme])

  return (
    <div className="grid grid-cols-[280px_1fr_320px] h-screen w-screen overflow-hidden">
      <LeftPanel />
      <CenterCanvas />
      <RightPanel />
    </div>
  )
}

export default App
