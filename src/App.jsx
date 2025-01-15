import {BrowserRouter, Route, Routes} from "react-router-dom";
import Start from "./component/page/Start.jsx";
import ClassRoom from "./component/page/ClassRoom.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start/>}/>
          <Route path="/classroom" element={<ClassRoom/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
