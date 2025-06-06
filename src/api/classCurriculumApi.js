import api from "./api.js";

/**
 * 커리큘럼(주차별) + 과제 목록 불러오기
 * @param {string|number} courseId
 * @param {string|number} userId
 * @returns {Promise<Array>} lectures [{ lectureId, lectureTitle, assignments: [...] }]
 */
export async function getCurriculumWithAssignments(courseId, userId) {
  const res = await api.get(`/lectures/curriculum/${courseId}/${userId}`);
  if (!res.data.success)
    throw new Error(res.data.message || "커리큘럼 불러오기 실패");
  // 주차별로 assignments, videos, materials 모두 추출
  return res.data.data.curriculumResponses.map((lecture) => ({
    lectureId: lecture.lectureId,
    lectureTitle: lecture.lectureTitle,
    lectureDescription: lecture.lectureDescription,
    assignments: (lecture.assignments || []).filter((a) => a && a.assignmentId),
    videos: lecture.videos || [],
    materials: lecture.materials || [],
  }));
}

/**
 * 특정 강의실의 모든 과제에 대한 학생별 제출 내역 불러오기
 * @param {string|number} courseId
 * @returns {Promise<Array>} assignments [{ assignmentId, assignmentTitle, studentResults: [...] }]
 */
export async function getAllAssignmentSubmissions(courseId) {
  const res = await api.get(
    `/statistics/courses/${courseId}/assignments/submissions`,
  );
  if (!res.data.success)
    throw new Error(res.data.message || "과제 제출 불러오기 실패");
  return res.data.data;
}

/**
 * 특정 assignmentId에 해당하는 학생 제출 내역만 추출
 * @param {Array} allSubmissions (getAllAssignmentSubmissions 결과)
 * @param {number} assignmentId
 * @returns {Array} studentResults
 */
export function findStudentResultsByAssignmentId(allSubmissions, assignmentId) {
  const found = allSubmissions.find((a) => a.assignmentId === assignmentId);
  return found ? found.studentResults : [];
}
