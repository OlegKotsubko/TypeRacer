import { BrowserRouter, Routes, Route } from "react-router";
import Home from './pages/home.tsx'
import Room from './pages/room.tsx'
import Prompt from './pages/prompt.tsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/:roomId" element={<Prompt />} />
        <Route path="/:roomId/:userName" element={<Room />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
