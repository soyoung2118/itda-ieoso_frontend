import { useEffect, useRef, useCallback, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { UsersProvider } from "./component/contexts/usersContext.jsx";
import { logout } from "./component/api/usersApi.js";
import {
  ModalOverlay,
  AlertModalContainer,
} from "./component/ui/modal/ModalStyles.jsx";

import LandingPage from "./component/page/LandingPage.jsx";
import LogIn from "./component/page/users/LogIn.jsx";
import SignUp from "./component/page/users/SignUp.jsx";
import FindPassword from "./component/page/users/FindPassword.jsx";
import ChangePassword from "./component/page/users/ChangePassword.jsx";
import ClassList from "./component/page/ClassList.jsx";
import Create from "./component/page/class/Create.jsx";
import Setting from "./component/page/class/Setting.jsx";
import Participate from "./component/page/Participate.jsx";
import Class from "./component/page/Class.jsx";
import ClassOverview from "./component/page/class/Overview.jsx";
import ClassSummary from "./component/page/class/Summary.jsx";
import ClassStudents from "./component/page/class/Students.jsx";
import ClassNotice from "./component/page/class/Notice.jsx";
import NoticeCreate from "./component/page/class/NoticeCreate.jsx";
import ClassCurriculum from "./component/page/class/Curriculum.jsx";
import ClassCurriculumEdit from "./component/page/class/CurriculumEdit.jsx";
import Dashboard from "./component/page/dashboard/Dashboard.jsx";
import ClassPlaying from "./component/page/class/Playing.jsx";
import ClassAssignmentSubmit from "./component/page/class/AssignmentSubmit.jsx";
import StudentDetail from "./component/page/class/StudentDetail.jsx";
import GoogleAuthCallback from "./component/page/users/GoogleAuthCallback.jsx";
import GoogleAccountLink from "./component/page/users/GoogleAccountLink.jsx";

// 페이지 이동 시 스크롤을 맨 위로 이동시키는 컴포넌트
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function LogoutHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const logoutTimerRef = useRef(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      navigate("/");
    } catch (error) {
      console.error("자동 로그아웃 중 오류 발생:", error);
    }
  }, [navigate]);

  const checkExpiration = useCallback(() => {
    const expirationTime = localStorage.getItem("tokenExpiration");
    if (expirationTime && new Date().getTime() > expirationTime) {
      setModalIsOpen(true);
    }
  }, []);

  useEffect(() => {
    checkExpiration();

    const expirationTime = localStorage.getItem("tokenExpiration");
    if (expirationTime) {
      const timeLeft = expirationTime - new Date().getTime();

      if (timeLeft <= 0) {
        setModalIsOpen(true);
      } else {
        setTimeout(() => {
          setModalIsOpen(true);
        }, timeLeft);
      }
    }

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [checkExpiration]);

  useEffect(() => {
    checkExpiration();
  }, [location, checkExpiration]);

  return (
    <>
      {modalIsOpen && (
        <ModalOverlay>
          <AlertModalContainer
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
          >
            <div className="text">로그인 시간이 만료되어 로그아웃합니다.</div>
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
        <LogoutHandler />
        <ScrollToTop /> {/* 필요 없으면 지우면 됨 */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/oauth/callback" element={<GoogleAuthCallback />} />
          <Route path="/oauth/account/link" element={<GoogleAccountLink />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/find-password" element={<FindPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
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
            <Route path="curriculum/:lectureId" element={<ClassCurriculum />} />
            <Route
              path="curriculum/:lectureId/edit"
              element={<ClassCurriculumEdit />}
            />
            <Route path="admin/summary" element={<ClassSummary />} />
            <Route path="admin/students" element={<ClassStudents />} />
            <Route
              path="admin/students/:studentId"
              element={<StudentDetail />}
            />
            <Route path="admin/setting" element={<Setting />} />
            <Route
              path="playing/:lectureId/:videoId"
              element={<ClassPlaying />}
            />
            <Route
              path="assignment/submit/:lectureId/:assignmentId"
              element={<ClassAssignmentSubmit />}
            />
          </Route>

          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </UsersProvider>
    </BrowserRouter>
  );
}

export default App;
