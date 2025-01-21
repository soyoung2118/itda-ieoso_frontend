import {BrowserRouter, Route, Routes} from "react-router-dom";
import LogIn from "./component/page/LogIn.jsx";
import SignUp from "./component/page/SignUp.jsx";
import ClassRoom from "./component/page/ClassRoom.jsx";
import MainPage from "./component/page/MainPage.jsx";
import Class from "./component/page/Class.jsx";
import Participate from "./component/page/Participate.jsx";
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/participate" element={<Participate />} />
          <Route path="/class" element={<Class />} />
          <Route path="/classroom" element={<ClassRoom />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
