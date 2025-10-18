import LeftPanel from './components/left-panel'
import CenterCanvas from './components/center-canvas'
import RightPanel from './components/right-panel'

function App() {
  return (
    <div className="grid grid-cols-[280px_1fr_320px] h-screen w-screen overflow-hidden bg-editor-bg text-editor-text">
      <LeftPanel />
      <CenterCanvas />
      <RightPanel />
    </div>
  )
}

export default App
