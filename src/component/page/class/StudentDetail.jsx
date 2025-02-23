import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminTopBar from "../../ui/class/AdminTopBar";
import { Section } from "../../ui/class/ClassLayout";

import assignmentIcon from "../../img/admin/student_assignment.svg";
import api from "../../api/api";
import Download from "../../img/icon/download.svg";

const ClassStudents = () => {
  const { courseId, studentId } = useParams();
  const [currentTime, setCurrentTime] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = `${now.getFullYear()}.${
        now.getMonth() + 1
      }.${now.getDate()}`;
      setCurrentTime(
        `${formattedTime} ${now.getHours()}:${String(now.getMinutes()).padStart(
          2,
          "0"
        )}`
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // API 호출하여 데이터 가져오기
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get(
          `/statistics/courses/${courseId}/assignments/submissions`
        );

        if (response.data.success) {
          const assignments = response.data.data;

          // 🔹 학생 목록 추출 (중복 제거)
          const studentMap = new Map();
          assignments.forEach((assignment) => {
            assignment.studentResults.forEach((result) => {
              if (!studentMap.has(result.userId)) {
                studentMap.set(result.userId, result.studentName);
              }
            });
          });

          setStudents(
            [...studentMap].map(([userId, name]) => ({ userId, name }))
          );

          // 🔹 특정 studentId의 과제 제출 내역 필터링
          const studentAssignments = assignments.flatMap((assignment) =>
            assignment.studentResults
              .filter((result) => result.userId.toString() === studentId)
              .map((result) => ({
                studentName: result.studentName,
                assignmentTitle: assignment.assignmentTitle,
                files: result.files || [],
                submittedAt: result.submittedAt,
                status: result.status,
                textContent: result.textContent,
              }))
          );

          if (studentAssignments.length > 0) {
            setStudentData({
              studentName: studentAssignments[0].studentName,
              submissions: studentAssignments,
            });
          } else {
            setStudentData(null);
          }
        } else {
          console.error("API 응답 오류:", response.data.message);
        }
      } catch (error) {
        console.error("과제 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    fetchAssignments();
  }, [courseId, studentId]);

  return (
    <main style={{ flex: 1, borderRadius: "8px" }}>
      <AdminTopBar />
      <div style={{ margin: "1vh 0vh" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginLeft: "2.5vh",
          }}
        >
          <h3
            style={{
              fontSize: "23px",
              fontWeight: "900",
              color: "var(--black-color)",
            }}
          >
            학생별 과제 제출
          </h3>
          <p
            style={{
              color: "var(--darkgrey-color)",
              fontSize: "15px",
              marginLeft: "1.5vh",
              fontWeight: "500",
            }}
          >
            {currentTime} 기준
          </p>
          {/* 제출 현황 보기 버튼 */}
          <button
            onClick={() => navigate("/class/${courseId}/admin/students")}
            style={{
              padding: "1.5vh 3.3h",
              backgroundColor: "var(--main-color)",
              color: "white",
              fontSize: "15px",
              fontWeight: "bold",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              marginLeft: "auto",
            }}
          >
            제출 현황 보기
          </button>
        </div>

        <div style={{ display: "flex", margin: "1vh 0vh" }}>
          {/*  Sidebar (학생 목록) */}
          <aside
            style={{
              width: "23vh",
              backgroundColor: "white",
              padding: "2.5vh 1.8vh",
              overflowY: "auto",
              borderRadius: "20px",
            }}
          >
            {students.map((student) => (
              <div
                key={student.userId}
                onClick={() =>
                  navigate(
                    `/class/${courseId}/admin/students/${student.userId}`
                  )
                }
                style={{
                  padding: "1.15vh 2.6vh",
                  fontSize: "17px",
                  marginBottom: "5px",
                  cursor: "pointer",
                  borderRadius: "10px",
                  backgroundColor:
                    student.userId.toString() === studentId
                      ? "var(--pink-color)"
                      : "transparent",
                  fontWeight: "550",
                }}
              >
                {student.name}
              </div>
            ))}
          </aside>

          <div style={{ flex: 1, padding: "0vh 6vh", marginBottom: "5vh" }}>
            {studentData ? (
              <div>
                {studentData.submissions.map((submission, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: "white",
                      padding: "0vh 3.5vh",
                      paddingTop: "1.8vh",
                      paddingBottom: "3vh",
                      borderRadius: "20px",
                      marginBottom: "3vh",
                    }}
                  >
                    {/* 🔹 과제 제목 + 제출 날짜 + 파일 (한 줄 배치) */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1.5vh",
                        }}
                      >
                        <img
                          src={assignmentIcon}
                          alt="과제 아이콘"
                          width="35"
                          height="35"
                        />
                        <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                          {submission.assignmentTitle}
                        </p>
                        <p style={{ fontSize: "15px", color: "#c3c3c3" }}>
                          {submission.submittedAt
                            ? new Date(
                                submission.submittedAt
                              ).toLocaleDateString()
                            : ""}
                        </p>
                      </div>

                      {/* 제출 파일 */}
                      <div style={{ display: "flex", gap: "10px" }}>
                        {submission.files.length > 0 ? (
                          submission.files.map((file, fileIdx) => (
                            <a
                              key={fileIdx}
                              href={file.fileUrl}
                              download
                              style={{
                                color: "var(--main-color)",
                                textDecoration: "underline",
                                fontSize: "16px",
                              }}
                            >
                              {file.fileName}
                            </a>
                          ))
                        ) : (
                          <p
                            style={{
                              color: "var(--main-color)",
                              fontSize: "16px",
                            }}
                          >
                            미제출
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 텍스트 제출 내용 */}
                    {submission.textContent &&
                      submission.textContent !== "null" && (
                        <div
                          style={{
                            marginTop: "10px",
                            padding: "15px",
                            backgroundColor: "#F6F7F9",
                            borderRadius: "8px",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {submission.textContent}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <p>학생 데이터를 불러오는 중...</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ClassStudents;
