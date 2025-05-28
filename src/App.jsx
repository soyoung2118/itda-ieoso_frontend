import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { UsersProvider } from "./component/contexts/usersContext.jsx";
import { handleLogout } from "./component/api/tokenManager.js";
import {
  ModalOverlay,
  AlertModalContainer,
} from "./component/ui/modal/ModalStyles.jsx";

import LandingPage from "./component/page/LandingPage.jsx";
import LogIn from "./component/page/users/LogIn.jsx";
import ClassList from "./component/page/ClassList.jsx";
import Create from "./component/page/class/Create.jsx";
import Participate from "./component/page/Participate.jsx";
import Class from "./component/page/Class.jsx";
import ClassOverview from "./component/page/class/Overview.jsx";
import ClassNotice from "./component/page/class/Notice.jsx";
import NoticeCreate from "./component/page/class/NoticeCreate.jsx";
import ClassCurriculum from "./component/page/class/Curriculum.jsx";
import ClassCurriculumEdit from "./component/page/class/CurriculumEdit.jsx";
import Admin from "./component/page/class/Admin.jsx";
import ClassSummary from "./component/page/class/admin/Summary.jsx";
import ClassStudents from "./component/page/class/admin/Students.jsx";
import StudentDetail from "./component/page/class/admin/StudentDetail.jsx";
import Setting from "./component/page/class/admin/Setting.jsx";
import Dashboard from "./component/page/dashboard/Dashboard.jsx";
import ClassPlaying from "./component/page/class/Playing.jsx";
import ClassAssignmentSubmit from "./component/page/class/AssignmentSubmit.jsx";
import GoogleAuthCallback from "./component/page/users/GoogleAuthCallback.jsx";
import GoogleAccountLink from "./component/page/users/GoogleAccountLink.jsx";
import { LanguageProvider } from "./component/contexts/LanguageContext.jsx";
import ChannelTalk from "./component/ui/ChannelTalk.jsx";
import AssignmentBrowse from "./component/page/class/AssignmentBrowse.jsx";


// 페이지 이동 시 스크롤을 맨 위로 이동시키는 컴포넌트
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function LogoutHandler() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");

  useEffect(() => {
    const checkSessionExpiration = () => {
      const sessionExpiration = localStorage.getItem("sessionExpiration");
      const currentTime = new Date().getTime();

      if (!sessionExpiration) return;

      if (currentTime > parseInt(sessionExpiration)) {
        setLogoutMessage("로그인 시간이 만료되어 로그아웃합니다.");
        setModalIsOpen(true);
      }
    };

    // 페이지 로드 시 한 번 체크
    checkSessionExpiration();

    // 1분마다 체크
    const interval = setInterval(checkSessionExpiration, 60000);

    // 토큰 관련 에러 발생 시 로그아웃
    const handleTokenError = (event) => {
      if (event.detail?.type === "token_error") {
        setLogoutMessage("인증에 문제가 발생하여 자동 로그아웃됩니다.");
        setModalIsOpen(true);
      }
    };

    // 토큰 에러 이벤트 리스너 등록
    window.addEventListener("tokenError", handleTokenError);

    return () => {
      clearInterval(interval);
      window.removeEventListener("tokenError", handleTokenError);
    };
  }, []);

  return (
    <>
      {modalIsOpen && (
        <ModalOverlay>
          <AlertModalContainer
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
          >
            <div className="text">{logoutMessage}</div>
            <div
              className="close-button"
              onClick={() => {
                setModalIsOpen(false);
                handleLogout();
              }}
            >
              확인
            </div>
          </AlertModalContainer>
        </ModalOverlay>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UsersProvider>
        <LanguageProvider>
          <LogoutHandler />
          <ScrollToTop />
          <ChannelTalk />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/oauth/callback" element={<GoogleAuthCallback />} />
            <Route path="/oauth/account/link" element={<GoogleAccountLink />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/class/list" element={<ClassList />} />
            <Route path="/class/create" element={<Create />} />
            <Route path="/class/participate" element={<Participate />} />

            <Route path="/class/:courseId" element={<Class />}>
              <Route path="overview/info" element={<ClassOverview />} />
              <Route path="overview/notice" element={<ClassNotice />} />
              <Route path="overview/notice/create" element={<NoticeCreate />} />
              <Route
                path="overview/notice/edit/:noticeId"
                element={<NoticeCreate />}
              />
              <Route
                path="curriculum/:lectureId"
                element={<ClassCurriculum />}
              />
              <Route
                path="curriculum/:lectureId/edit"
                element={<ClassCurriculumEdit />}
              />
              <Route path="admin/" element={<Admin />}>
                <Route path="summary" element={<ClassSummary />} />
                <Route path="students" element={<ClassStudents />} />
                <Route path="students/:studentId" element={<StudentDetail />} />
                <Route path="setting" element={<Setting />} />
              </Route>
              <Route
                path="playing/:lectureId/:videoId"
                element={<ClassPlaying />}
              />
              <Route
                path="assignment/submit/:lectureId/:assignmentId"
                element={<ClassAssignmentSubmit />}
              />
              <Route
                path="assignment/browse/:lectureId"
                element={<AssignmentBrowse />}
              />
            </Route>

            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </LanguageProvider>
      </UsersProvider>
    </BrowserRouter>
  );
}

export default App;
