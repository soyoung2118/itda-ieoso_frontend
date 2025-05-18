import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { getCurriculumWithAssignments, getAllAssignmentSubmissions } from "../../api/classCurriculumApi";
import { UsersContext } from "../../contexts/usersContext";
import AssignmentBrowseSidebar from "../../ui/class/AssignmentBrowseSidebar";
import api from "../../api/api";

const AssignmentBrowse = () => {
  const { courseId } = useParams();
  const { user } = useContext(UsersContext);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [curriculum, setCurriculum] = useState([]); // 주차별 커리큘럼
  const [allSubmissions, setAllSubmissions] = useState([]); // 모든 과제 제출
  const [openWeek, setOpenWeek] = useState(null);
  const [galleryIndexes, setGalleryIndexes] = useState({}); // {assignmentId: idx}

  // 커리큘럼, 제출 데이터 fetch
  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || !user) return;
      try {
        const lectures = await getCurriculumWithAssignments(courseId, user.userId);
        setCurriculum(lectures);
        const submissions = await getAllAssignmentSubmissions(courseId);
        setAllSubmissions(submissions);
        // 학생 목록 추출 (중복 없이)
        const studentMap = new Map();
        submissions.forEach(assignment => {
          assignment.studentResults.forEach(result => {
            if (!studentMap.has(result.userId)) {
              studentMap.set(result.userId, {
                id: result.userId,
                name: result.studentName,
                disabled: result.userId === user?.userId
              });
            }
          });
        });
        setStudents([...studentMap.values()]);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [courseId, user]);

  // 학생 자동 선택
  useEffect(() => {
    if (students.length > 0) setSelectedStudentId(students[0].id);
  }, [students]);

  // 아코디언 토글
  const handleWeekToggle = (lectureId) => {
    setOpenWeek(prev => (prev === lectureId ? null : lectureId));
  };

  // 특정 assignmentId에 대한 해당 학생 제출 내역 찾기
  const findStudentSubmission = (assignmentId) => {
    const assignment = allSubmissions.find(a => a.assignmentId === assignmentId);
    if (!assignment) return null;
    return assignment.studentResults.find(r => r.userId === selectedStudentId) || null;
  };

  // 이미지 확장자 판별 함수
  const isImageFile = (fileName = "") => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  };

  // PDF 파일만 추출
  const isPdfFile = (fileName = "") => {
    return /\.pdf$/i.test(fileName);
  };

  // 갤러리 넘기기 핸들러
  const handlePrev = (assignmentId, imageCount) => {
    setGalleryIndexes(prev => ({
      ...prev,
      [assignmentId]: prev[assignmentId] === 0 ? imageCount - 1 : (prev[assignmentId] || 0) - 1
    }));
  };
  const handleNext = (assignmentId, imageCount) => {
    setGalleryIndexes(prev => ({
      ...prev,
      [assignmentId]: prev[assignmentId] === imageCount - 1 ? 0 : (prev[assignmentId] || 0) + 1
    }));
  };

  // PDF 미리보기 핸들러
  const handlePdfPreview = async (fileUrl) => {
    try {
      const res = await api.get("/files/download", { params: { fileUrl } });
      const presignedUrl = res.data.data;
      window.open(presignedUrl, "_blank");
    } catch (e) {
      alert("PDF 미리보기에 실패했습니다.");
    }
  };

  return (
    <Container>
      <ContentArea>
        <MainContent>
          <TopTitle>
            {(() => {
              const selected = students.find(s => s.id === selectedStudentId);
              return selected ? `${selected.name} 과제 목록 >` : '';
            })()}
          </TopTitle>
          <SubmissionList>
            {curriculum.map((lecture, idx) => (
              <AccordionBox key={lecture.lectureId}>
                <AccordionHeader onClick={() => handleWeekToggle(lecture.lectureId)}>
                  <AccordionTitle>{lecture.lectureTitle}</AccordionTitle>
                  <AccordionIcon>{openWeek === lecture.lectureId ? '▲' : '▼'}</AccordionIcon>
                </AccordionHeader>
                {openWeek === lecture.lectureId && (
                  <AccordionContent>
                    {lecture.assignments.length === 0 && <NoAssignment>과제가 없습니다.</NoAssignment>}
                    {lecture.assignments.map((assignment) => {
                      const submission = findStudentSubmission(assignment.assignmentId);
                      const imageFiles = (submission?.files || []).filter(f => isImageFile(f.fileName));
                      const pdfFiles = (submission?.files || []).filter(f => isPdfFile(f.fileName));
                      const otherFiles = (submission?.files || []).filter(f => !isImageFile(f.fileName) && !isPdfFile(f.fileName));
                      const galleryIdx = galleryIndexes[assignment.assignmentId] || 0;

                      return (
                        <SubmissionBox key={assignment.assignmentId}>
                          <SubmissionHeader>
                            <AssignmentInfo>
                              <h4>{assignment.assignmentTitle}</h4>
                            </AssignmentInfo>
                            <FileList>
                              {/* 이미지 갤러리 */}
                              {imageFiles.length > 0 && (
                                <GalleryWrapper>
                                  <GalleryArrow onClick={() => handlePrev(assignment.assignmentId, imageFiles.length)} disabled={imageFiles.length <= 1}>&lt;</GalleryArrow>
                                  <GalleryImage src={imageFiles[galleryIdx].fileUrl} alt={imageFiles[galleryIdx].fileName} />
                                  <GalleryArrow onClick={() => handleNext(assignment.assignmentId, imageFiles.length)} disabled={imageFiles.length <= 1}>&gt;</GalleryArrow>
                                </GalleryWrapper>
                              )}
                            </FileList>
                            {/* PDF 파일 빨간 글씨로 목록화 */}
                            {pdfFiles.length > 0 && (
                              <PdfList>
                                {pdfFiles.map((file, fileIdx) => (
                                  <PdfLinkButton key={fileIdx} type="button" onClick={() => handlePdfPreview(file.fileUrl)}>
                                    {file.fileName}
                                  </PdfLinkButton>
                                ))}
                              </PdfList>
                            )}
                            {/* 이미지/ PDF 외 파일 다운로드 */}
                            <FileList>
                              {otherFiles.length > 0 && otherFiles.map((file, fileIdx) => (
                                <DownloadLink key={fileIdx} href={file.fileUrl} download>
                                  {file.fileName}
                                </DownloadLink>
                              ))}
                              {/* 미제출 안내 */}
                              {(!submission || ((submission.files?.length ?? 0) === 0 && (!submission.textContent || submission.textContent === "null"))) && (
                                <span>미제출</span>
                              )}
                            </FileList>
                          </SubmissionHeader>
                          {submission && submission.textContent && submission.textContent !== "null" && (
                            <TextContent>{submission.textContent}</TextContent>
                          )}
                        </SubmissionBox>
                      );
                    })}
                  </AccordionContent>
                )}
              </AccordionBox>
            ))}
          </SubmissionList>
        </MainContent>
        <SidebarArea>
          <AssignmentBrowseSidebar
            students={students}
            selectedId={selectedStudentId}
            onSelect={setSelectedStudentId}
          />
        </SidebarArea>
      </ContentArea>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #f6f7f9;
  min-height: 100vh;
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 0 0 0;
  min-height: 80vh;
  gap: 32px;
`;

const MainContent = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 20px;
  padding: 32px 32px 32px 32px;
  min-width: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
`;

const SidebarArea = styled.div`
  width: 260px;
  min-width: 220px;
  background: transparent;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #222;
  margin: 0;
  
  @media (max-width: 1023px) {
    font-size: 20px;
  }
`;

const SubmissionList = styled.div`
  flex: 1;
`;

const AccordionBox = styled.div`
  background: #fff;
  border-radius: 16px;
  margin-bottom: 18px;
  border: 1px solid #e5e5e5;
`;
const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  font-size: 18px;
  font-weight: 700;
  border-bottom: 1px solid #e5e5e5;
  background: #fff;
  cursor: pointer;
`;
const AccordionTitle = styled.div``;
const AccordionIcon = styled.div`
  font-size: 18px;
`;
const AccordionContent = styled.div`
  padding: 0 24px 24px 24px;
`;
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #e5e5e5;
  margin: 16px 0;
`;
const NoAssignment = styled.div`
  color: #bbb;
  font-size: 15px;
  padding: 16px 0;
`;
const SubmissionBox = styled.div`
  background: #fff;
  border-radius: 12px;
  margin: 24px 0 0 0;
  border: 1px solid #f0f0f0;
  padding: 24px 24px 16px 24px;
`;
const SubmissionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;
const AssignmentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  h4 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 4px 0;
  }
`;
const FileList = styled.div`
  display: flex;
  gap: 16px;
`;
const DownloadLink = styled.a`
  color: var(--main-color);
  text-decoration: none;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
`;
const TextContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
  margin-top: 8px;
`;

const TopTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 18px;
  color: #222;
`;

const GalleryWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const GalleryImage = styled.img`
  max-width: 320px;
  max-height: 220px;
  border-radius: 8px;
  object-fit: contain;
  background: #f8f8f8;
`;
const GalleryArrow = styled.button`
  background: none;
  border: none;
  color: #bbb;
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
  &:disabled {
    color: #eee;
    cursor: default;
  }
`;

const PdfList = styled.div`
  margin: 10px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const PdfLinkButton = styled.button`
  background: none;
  border: none;
  color: #ff4747;
  font-weight: 600;
  font-size: 15px;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  margin: 0;
  text-align: left;
  &:hover {
    text-decoration: none;
    opacity: 0.8;
  }
`;

export default AssignmentBrowse;
