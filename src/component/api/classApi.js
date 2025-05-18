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

// courses 데이터를 직접 받음
export const formatMyCoursesTitles = (courses, userId) => {
  return courses.map((course) => ({
    courseId: course.courseId,
    courseTitle: course.courseTitle,
    isCreator: String(course.user?.userId) === String(userId),
    isAssignmentPublic: course.isAssignmentPublic,
  }));
};

// 기존 함수는 backward compatibility를 위해 유지
export const getMyCoursesTitles = async (userId) => {
  const courses = await getMyCourses(userId);
  return formatMyCoursesTitles(courses, userId);
};

export const getCourseNameandEntryCode = async (courseId) => {
  try {
    const response = await api.get(`/courses/${courseId}`);
    if (response.data.success) {
      const { courseTitle, entryCode } = response.data.data;
      return { courseTitle, entryCode };
    } else {
      console.error("강의 정보 불러오기 실패");
      return null;
    }
  } catch (error) {
    console.error("강의 정보 불러오기 오류:", error);
    return null;
  }
};
