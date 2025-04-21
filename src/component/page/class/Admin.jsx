import { useState, useEffect, useContext } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { UsersContext } from "../../contexts/usersContext";
import AdminTopBar from "../../ui/class/AdminTopBar";
import { ModalOverlay, AlertModalContainer } from "../../ui/modal/ModalStyles";

const Admin = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UsersContext);

  const [courseData, setCourseData] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (!courseId || !user) return;

    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/courses/${courseId}`);
        if (response.data.success) {
          setCourseData(response.data.data);
          setIsCreator(response.data.data.user?.userId === user.userId);
        }
      } catch (error) {
        console.error("강의 정보 가져오기 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, user]);

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/class/list");
  };

  if (loading) return <div>로딩 중...</div>;
  if (!courseData) return <div>강의 정보를 불러올 수 없습니다.</div>;

  return (
    <div>
      <AdminTopBar />
      <Outlet context={{ courseData, isCreator }} />
      {showModal && (
        <ModalOverlay>
          <AlertModalContainer>
            <div className="text">{modalMessage}</div>
            <div className="close-button" onClick={handleModalClose}>
              확인
            </div>
          </AlertModalContainer>
        </ModalOverlay>
      )}
    </div>
  );
};

export default Admin;
