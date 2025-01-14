import {BrowserRouter, Route, Routes} from "react-router-dom";
import Start from "./component/page/Start.jsx";

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
