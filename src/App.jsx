import {BrowserRouter, Route, Routes} from "react-router-dom";
import LogIn from "./component/page/LogIn.jsx";
import SignUp from "./component/page/SignUp.jsx";
import ClassRoom from "./component/page/ClassRoom.jsx";
import MainPage from "./component/page/MainPage.jsx";
import Class from "./component/page/Class.jsx";
import Participate from "./component/page/Participate.jsx";

import ClassCurriculum from "./component/page/class/ClassCurriculum.jsx";
import ClassOverview from "./component/page/class/ClassOverview.jsx";
import ClassNotice from "./component/page/class/ClassNotice.jsx";
import Dashboard from "./component/page/Dashboard.jsx";
import EditClass from "./component/ui/class/EditClass.jsx";
import ClassStatistics from "./component/page/class/ClassStatistics.jsx";
import ClassCurriculumEdit from "./component/page/class/ClassCurriculumEdit.jsx";

import ClassRoomCreate from "./component/page/class/ClassRoomCreate.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/overview/info" element={<ClassOverview />} />
          <Route path="/overview/info/edit" element={<EditClass />} />
          <Route path="/overview/notice" element={<ClassNotice />} />
          <Route path="/curriculum" element={<ClassCurriculum />} />
          <Route path="/curriculum/edit" element={<ClassCurriculumEdit />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/participate" element={<Participate />} />
          <Route path="/class" element={<Class />} />
          <Route path="/classroom" element={<ClassRoom />} />
          <Route path="/class/create" element={<ClassRoomCreate />} />
          <Route path="/statistics" element={<ClassStatistics/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
