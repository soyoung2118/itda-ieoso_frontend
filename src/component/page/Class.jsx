import { useState, useEffect, useContext } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { UsersContext } from "../contexts/usersContext";
import TopBar from "../ui/TopBar";
import ClassTopbar from "../ui/class/ClassTopbar";
import { PageLayout } from "../ui/class/ClassLayout";  
export default function Class() {
  const { courseId: paramCourseId } = useParams(); 
  const navigate = useNavigate();
  const { user } = useContext(UsersContext);

  const [selectedCourseId, setSelectedCourseId] = useState(paramCourseId);
  const [courseData, setCourseData] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedCourseId || !user) return;

    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/courses/${selectedCourseId}`);
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
  }, [selectedCourseId, user]);

  const handleCourseChange = (newCourseId) => {
    setSelectedCourseId(newCourseId);
    navigate(`/class/${newCourseId}/overview/info`);
  };

  if (loading) return <div>로딩 중...</div>;
  if (!courseData) return <div>강의 정보를 불러올 수 없습니다.</div>;

  return (
    <div>
      <TopBar />
      <PageLayout>
        <ClassTopbar selectedCourseId={selectedCourseId} onCourseChange={handleCourseChange} />
        <Outlet context={{ courseData, isCreator }} />
      </PageLayout>
    </div>
  );
}
