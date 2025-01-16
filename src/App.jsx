import {BrowserRouter, Route, Routes} from "react-router-dom";
import Start from "./component/page/Start.jsx";
import LogIn from "./component/page/LogIn.jsx";
import SignUp from "./component/page/SignUp.jsx";
import ClassRoom from "./component/page/ClassRoom.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/classroom" element={<ClassRoom/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
