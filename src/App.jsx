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

            {/* 로그인 페이지 */}
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* 강의실 페이지 */}
            <Route path="/class" element={<Class />} />
            <Route path="/class/create" element={<Create />} />
            <Route path="/admin/setting" element={<Setting />} />
            
            {/* 강의실 입장 페이지 */}
            <Route path="/class/participate" element={<Participate />} />

            {/* 강의실 상세 페이지 */}
            <Route path="/class/:courseId/overview/info" element={<ClassOverview />} />
            <Route path="/class/:courseId/overview/info/edit" element={<EditClass />} />
            <Route path="/class/:courseId/overview/notice" element={<ClassNotice />} />
            <Route path="/class/:courseId/overview/notice/create" element={<NoticeCreate />} />
            <Route path="/class/:courseId/curriculum" element={<ClassCurriculum />} />
            <Route path="/class/:courseId/curriculum/edit" element={<ClassCurriculumEdit />} />
            <Route path="/class/:courseId/statistics" element={<ClassStatistics />} />
            
            {/* 대시보드 페이지 */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 강의실 수강  */}
            <Route path="/classroom" element={<ClassRoom />} />
          </Routes>
        </UsersProvider>
      </BrowserRouter>
    </>
  )
}

export default App
