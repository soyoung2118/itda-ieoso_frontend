import { Outlet, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import api from "../api/api";
import { UsersContext } from "../contexts/usersContext";

export default function Class() {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const { user } = useContext(UsersContext);
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId || !user) return;

    const fetchCourseData = async () => {
      try {
        const response = await api.get(`/courses/${courseId}`);
        if (response.data.success) {
          setCourseData(response.data.data);
          setIsCreator(response.data.data.user?.userId === user.userId);
          console.log("isCreator", response.data.data.user?.userId === user.userId);
        }
      } catch (error) {
        console.error("강의 정보 가져오기 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, user]);

  if (loading) return <div>로딩 중...</div>;
  if (!courseData) return <div>로딩 중...</div>;

  return (
        <Outlet context={{ courseData, isCreator }} />
  );
}
