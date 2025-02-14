import api from "./api";

export const getMyCourses = async (userId) => {
  if (!userId) return [];
  try {
    const response = await api.get(`/courses/${userId}/my-courses`);
    return response.data.data;
  } catch (error) {
    console.error("강의 목록 불러오기 오류:", error);
    return [];
  }
};

// courseId와 courseTitle만 가져오는 함수
export const getMyCoursesTitles = async (userId) => {
  const courses = await getMyCourses(userId);
  console.log("불러온 강의 목록",courses);
  return courses.map((course) => ({
    courseId: course.courseId,
    courseTitle: course.courseTitle
  }));
};