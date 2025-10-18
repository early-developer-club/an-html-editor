import LeftPanel from './components/left-panel'
import CenterCanvas from './components/center-canvas'
import RightPanel from './components/right-panel'
import './styles/layout.css'

function App() {
  return (
    <div className="editor-layout">
      <LeftPanel />
      <CenterCanvas />
      <RightPanel />
    </div>
  )
}

export default App
