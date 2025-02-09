import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UsersProvider } from "./component/contexts/usersContext.jsx";
import LogIn from "./component/page/users/LogIn.jsx";
import SignUp from "./component/page/users/SignUp.jsx";
import ClassRoom from "./component/page/ClassRoom.jsx";
import MainPage from "./component/page/MainPage.jsx";
import Class from "./component/page/Class.jsx";
import Participate from "./component/page/Participate.jsx";

import ClassCurriculum from "./component/page/class/Curriculum.jsx";
import ClassOverview from "./component/page/class/Overview.jsx";
import ClassNotice from "./component/page/class/Notice.jsx";
import Dashboard from "./component/page/Dashboard.jsx";
import ClassStatistics from "./component/page/class/Statistics.jsx";
import ClassCurriculumEdit from "./component/page/class/CurriculumEdit.jsx";
import NoticeCreate from "./component/page/class/NoticeCreate.jsx";
import EditClass from "./component/ui/class/EditClass.jsx";

import Create from "./component/page/class/Create.jsx";
import Setting from "./component/page/class/Setting.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <UsersProvider>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/overview/info" element={<ClassOverview />} />
            <Route path="/overview/info/edit" element={<EditClass />} />
            <Route path="/overview/notice" element={<ClassNotice />} />
            <Route path="/overview/notice/create" element={<NoticeCreate />} />
          <Route path="/curriculum" element={<ClassCurriculum />} />
          <Route path="/curriculum/edit" element={<ClassCurriculumEdit />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/participate" element={<Participate />} />
          <Route path="/class" element={<Class />} />
          <Route path="/classroom" element={<ClassRoom />} />
          <Route path="/class/create" element={<Create />} />
          <Route path="/statistics" element={<ClassStatistics/>} />
          <Route path="/admin/setting" element={<Setting/>} />
          </Routes>
        </UsersProvider>
      </BrowserRouter>
    </>
  )
}

export default App
