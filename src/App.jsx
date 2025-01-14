import {BrowserRouter, Route, Routes} from "react-router-dom";
import Start from "./Start.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
