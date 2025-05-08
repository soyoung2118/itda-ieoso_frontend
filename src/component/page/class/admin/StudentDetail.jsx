import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Section } from "../../../ui/class/ClassLayout";
import styled from "styled-components";

import assignmentIcon from "../../../img/admin/student_assignment.svg";
import api from "../../../api/api";
import Download from "../../../img/icon/download.svg";

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
      const formattedTime = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;
      setCurrentTime(
        `${formattedTime} ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`,
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get(
          `/statistics/courses/${courseId}/assignments/submissions`,
        );

        if (response.data.success) {
          const assignments = response.data.data;
          const studentMap = new Map();
          assignments.forEach((assignment) => {
            assignment.studentResults.forEach((result) => {
              if (!studentMap.has(result.userId)) {
                studentMap.set(result.userId, result.studentName);
              }
            });
          });

          setStudents(
            [...studentMap].map(([userId, name]) => ({ userId, name })),
          );

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
              })),
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

  const handleDownload = async (file) => {
    try {
      const response = await api.get("/files/download", {
        params: { fileUrl: file.fileUrl },
      });

      const presignedUrl = response.data.data;
      const fileResponse = await fetch(presignedUrl);
      const arrayBuffer = await fileResponse.arrayBuffer();

      const fileExtension = file.fileName.split(".").pop().toLowerCase();
      let mimeType = "application/octet-stream";

      if (fileExtension === "pdf") mimeType = "application/pdf";
      else if (fileExtension === "txt") mimeType = "text/plain";
      else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension))
        mimeType = `image/${fileExtension}`;
      else if (fileExtension === "zip") mimeType = "application/zip";

      const blob = new Blob([arrayBuffer], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("파일 다운로드 중 오류 발생:", error);
    }
  };

  return (
    <MainWrapper>
      <div>
        <TopBar>
          <Title>학생별 과제 보기</Title>
          <TimeText>{currentTime} 기준</TimeText>
          <NavButton
            onClick={() => navigate(`/class/${courseId}/admin/summary`)}
          >
            요약 보기
          </NavButton>
        </TopBar>

        <ContentWrapper>
          <Sidebar>
            {students.map((student) => (
              <StudentItem
                key={student.userId}
                onClick={() =>
                  navigate(
                    `/class/${courseId}/admin/students/${student.userId}`,
                  )
                }
                selected={student.userId.toString() === studentId}
              >
                {student.name}
              </StudentItem>
            ))}
          </Sidebar>

          <StudentContent>
            {studentData ? (
              studentData.submissions.map((submission, idx) => (
                <SubmissionBox key={idx}>
                  <SubmissionHeader>
                    <AssignmentInfo>
                      <AssignmentIcon src={assignmentIcon} alt="과제 아이콘" />
                      <h4>{submission.assignmentTitle}</h4>
                      <p>
                        {submission.submittedAt
                          ? new Date(
                              submission.submittedAt,
                            ).toLocaleDateString()
                          : ""}
                      </p>
                    </AssignmentInfo>
                    <FileList>
                      {submission.files.length > 0 ? (
                        submission.files.map((file, fileIdx) => (
                          <DownloadLink
                            key={fileIdx}
                            onClick={() => handleDownload(file)}
                          >
                            {file.fileName}
                          </DownloadLink>
                        ))
                      ) : submission.textContent &&
                        submission.textContent !== "null" ? null : (
                        <span>미제출</span>
                      )}
                    </FileList>
                  </SubmissionHeader>

                  {submission.textContent &&
                    submission.textContent !== "null" && (
                      <TextContent>{submission.textContent}</TextContent>
                    )}
                </SubmissionBox>
              ))
            ) : (
              <p>학생 데이터를 불러오는 중...</p>
            )}
          </StudentContent>
        </ContentWrapper>
      </div>
    </MainWrapper>
  );
};

export default ClassStudents;

const MainWrapper = styled.main`
  flex: 1;
  border-radius: 8px;
`;

const TopBar = styled.div`
  display: flex;
  align-items: baseline;
  margin-left: 2.5vh;

  @media (max-width: 1024px) {
    margin-left: 2vh;
  }

  @media (max-width: 768px) {
    margin-left: 1.5vh;
  }
`;

const Title = styled.h3`
  font-size: 23px;
  font-weight: 800;
  color: var(--black-color);

  @media (max-width: 1024px) {
    font-size: 22px;
    font-weight: 750;
  }

  @media (max-width: 768px) {
    font-size: 19px;
    font-weight: 700;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    font-weight: 650;
  }

  @media (max-width: 376px) {
    font-size: 12.8px;
  }
`;

const TimeText = styled.p`
  color: var(--darkgrey-color);
  font-size: 15px;
  margin-left: 1.5vh;
  font-weight: 500;

  @media (max-width: 1024px) {
    margin-left: 1vh;
  }

  @media (max-width: 768px) {
    font-size: 12.5px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }

  @media (max-width: 376px) {
    font-size: 8.5px;
  }
`;

const NavButton = styled.button`
  padding: 1.5vh 3vh;
  background-color: var(--main-color);
  color: white;
  font-size: 15px;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-left: auto;

  @media (max-width: 1024px) {
    padding: 0.85vh 1.7vh;
    border-radius: 6px;
    font-size: 13.5px;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    padding: 0.8vh 1.8vh;
    border-radius: 5px;
    font-size: 11.5px;
    font-weight: 550;
  }

  @media (max-width: 480px) {
    padding: 1.1vh 2vh;
    border-radius: 4px;
    font-size: 9.3px;
    font-weight: 550;
  }

  @media (max-width: 376px) {
    padding: 0.65vh 1.35vh;
    border-radius: 3px;
    font-size: 7.7px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  margin: 2vh 0;

  @media (max-width: 1024px) {
    margin: 1.3vh 0;
  }

  @media (max-width: 768px) {
    margin: 0.7vh 0;
  }
  @media (max-width: 376px) {
    margin: 0.35vh 0;
  }
`;

const Sidebar = styled.aside`
  width: 13%;
  background-color: white;
  padding: 2.5vh 1.8vh;
  overflow-y: auto;
  border-radius: 20px;

  @media (max-width: 1024px) {
    width: 16%;
    padding: 1.8vh 1.5vh;
  }

  @media (max-width: 768px) {
    padding: 1.55vh 1.4vh;
    border-radius: 16px;
  }
  @media (max-width: 480px) {
    width: 17%;
    padding: 2vh 1.5vh;
    border-radius: 13px;
  }
  @media (max-width: 376px) {
    width: 16%;
    padding: 1.3vh 1vh;
    border-radius: 9px;
  }
`;

const StudentItem = styled.div`
  padding: 1.15vh 2.6vh;
  font-size: 16px;
  margin-bottom: 5px;
  cursor: pointer;
  border-radius: 10px;
  font-weight: 550;
  background-color: ${(props) =>
    props.selected ? "var(--pink-color)" : "transparent"};

  @media (max-width: 1024px) {
    padding: 0.9vh 1.3vh;
    border-radius: 8px;
    font-size: 15px;
  }

  @media (max-width: 768px) {
    padding: 0.8vh 1vh;
    border-radius: 7.3px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    padding: 1vh 2vh;
    border-radius: 6.3px;
    font-size: 10px;
  }

  @media (max-width: 376px) {
    padding: 0.7vh 1.2vh;
    border-radius: 6px;
    font-size: 8px;
  }
`;

const StudentContent = styled.div`
  flex: 1;
  padding-left: 6vh;
  margin-bottom: 5vh;

  @media (max-width: 1024px) {
    padding-left: 2vh;
  }

  @media (max-width: 768px) {
    padding-left: 1.7vh;
  }

  @media (max-width: 376px) {
    padding-left: 1.3vh;
  }
`;

const AssignmentIcon = styled.img`
  width: 35px;
  height: 35px;

  @media (max-width: 1024px) {
    width: 2.35vh;
  }

  @media (max-width: 768px) {
    width: 2.1vh;
  }

  @media (max-width: 480px) {
    width: 2.7vh;
  }

  @media (max-width: 376px) {
    width: 1.9vh;
  }
`;

const SubmissionBox = styled.div`
  background-color: white;
  padding: 1.8vh 3.5vh 3vh;
  border-radius: 20px;
  margin-bottom: 3vh;

  @media (max-width: 1024px) {
    padding: 1vh 2vh 2.5vh;
    border-radius: 15px;
    margin-bottom: 2vh;
  }

  @media (max-width: 768px) {
    padding: 0.6vh 1.9vh 2.1vh;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 0.5vh 2.5vh 2.3vh;
    border-radius: 12px;
  }

  @media (max-width: 376px) {
    padding: 0.25vh 1.7vh 1.8vh;
    border-radius: 8.5 px;
  }
`;

const SubmissionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AssignmentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5vh;

  @media (max-width: 1024px) {
    gap: 0.9vh;
  }

  @media (max-width: 768px) {
    gap: 0.7vh;
  }

  @media (max-width: 376px) {
    gap: 0.55vh;
  }

  & h4 {
    font-size: 18px;
    font-weight: bold;

    @media (max-width: 1024px) {
      font-size: 17px;
      font-weight: 700;
    }

    @media (max-width: 768px) {
      font-size: 13.5px;
      font-weight: 600;
    }

    @media (max-width: 480px) {
      font-size: 10.5px;
    }

    @media (max-width: 376px) {
      font-size: 9px;
      font-weight: 550;
    }
  }

  & p {
    font-size: 15px;
    color: #c3c3c3;

    @media (max-width: 1024px) {
      font-size: 14px;
    }

    @media (max-width: 768px) {
      font-size: 11.5px;
    }

    @media (max-width: 480px) {
      font-size: 9px;
    }

    @media (max-width: 376px) {
      font-size: 7.2px;
    }
  }
`;

const FileList = styled.div`
  display: flex;
  gap: 2vh;
  font-size: 16px;
  color: var(--main-color);

  @media (max-width: 1024px) {
    font-size: 13.5px;
    max-width: 40%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }

  @media (max-width: 768px) {
    font-size: 11.3px;
  }

  @media (max-width: 480px) {
    font-size: 8.5px;
  }

  @media (max-width: 376px) {
    font-size: 7px;
  }
`;

const DownloadLink = styled.a`
  text-decoration: underline;
  cursor: pointer;
`;

const TextContent = styled.div`
  margin-top: 1.5vh;
  padding: 2.5vh 3.5vh;
  background-color: #f6f7f9;
  border-radius: 8px;
  white-space: pre-wrap;

  @media (max-width: 1024px) {
    margin-top: 0.5vh;
    padding: 2vh 2vh;
    font-size: 13.5px;
  }

  @media (max-width: 768px) {
    margin-top: 0.3vh;
    padding: 1.5vh 1.3vh;
    font-size: 11.5px;
    border-radius: 7px;
  }

  @media (max-width: 480px) {
    margin-top: -0.5vh;
    padding: 1.6vh 1.3vh;
    font-size: 9.3px;
    border-radius: 6px;
  }

  @media (max-width: 376px) {
    margin-top: -0.5vh;
    padding: 1.4vh 1.1vh;
    font-size: 7.6px;
    border-radius: 4px;
  }
`;
