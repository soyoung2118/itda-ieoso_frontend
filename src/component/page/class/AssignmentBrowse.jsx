import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { getCurriculumWithAssignments, getAllAssignmentSubmissions } from "../../api/classCurriculumApi";
import { UsersContext } from "../../contexts/usersContext";
import AssignmentBrowseSidebar from "../../ui/class/AssignmentBrowseSidebar";
import api from "../../api/api";

const formatSubmissionDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

const AssignmentBrowse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UsersContext);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [curriculum, setCurriculum] = useState([]); // 주차별 커리큘럼
  const [allSubmissions, setAllSubmissions] = useState([]); // 모든 과제 제출
  const [openWeek, setOpenWeek] = useState(null);
  const [galleryIndexes, setGalleryIndexes] = useState({}); // {assignmentId: idx}
  const [imageErrors, setImageErrors] = useState({});

  // 커리큘럼, 제출 데이터 fetch
  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || !user) return;
      try {
        const lectures = await getCurriculumWithAssignments(courseId, user.userId);
        console.log('Curriculum Data:', lectures);
        setCurriculum(lectures);
        const submissions = await getAllAssignmentSubmissions(courseId);
        console.log('All Submissions:', submissions);
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
        const studentList = [...studentMap.values()];
        console.log('Student List:', studentList);
        setStudents(studentList);
      } catch (e) {
        console.error('Error fetching data:', e);
      }
    };
    fetchData();
  }, [courseId, user]);

  // 학생 자동 선택
  useEffect(() => {
    if (students.length > 0) setSelectedStudentId(students[0].id);
  }, [students]);

  // 현재 선택된 학생의 제출 정보도 확인
  useEffect(() => {
    if (selectedStudentId) {
      console.log('Selected Student ID:', selectedStudentId);
      const selectedStudent = students.find(s => s.id === selectedStudentId);
      console.log('Selected Student Info:', selectedStudent);
    }
  }, [selectedStudentId, students]);

  // 현재 열린 주차 정보도 확인
  useEffect(() => {
    if (openWeek) {
      console.log('Open Week ID:', openWeek);
      const currentLecture = curriculum.find(l => l.lectureId === openWeek);
      console.log('Current Lecture Info:', currentLecture);
    }
  }, [openWeek, curriculum]);

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

  const handleNavigationCurriculum = () => {
    navigate(`/class/${courseId}/curriculum/${curriculum[0].lectureId}`);
  };

  // 이미지 로드 에러 핸들러
  const handleImageError = (fileUrl, fileName) => {
    console.error('Image load failed:', { fileUrl, fileName });
    setImageErrors(prev => ({
      ...prev,
      [fileUrl]: true
    }));
  };

  return (
    <Container>
      <ContentWrapper>
        <TopTitle>
          {(() => {
            const selected = students.find(s => s.id === selectedStudentId);
            return selected ? (
              <>
                <span className="name">{selected.name}</span>
                <span className="subtitle"> 과제목록 <ArrowForwardIosIcon onClick={handleNavigationCurriculum} style={{ width: "13px", marginLeft: "15px", cursor: "pointer" }} /></span>
              </>
            ) : '';
          })()}
        </TopTitle>
      
        <MainContent>
          <SubmissionList>
            {curriculum.map((lecture, idx) => (
              <AccordionBox key={lecture.lectureId} isOpen={openWeek === lecture.lectureId}>
                <AccordionHeader 
                  onClick={() => handleWeekToggle(lecture.lectureId)}
                  isOpen={openWeek === lecture.lectureId}
                >
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
                              {submission?.submittedAt && (
                                <span className="submission-date">{formatSubmissionDate(submission.submittedAt)}</span>
                              )}
                            </AssignmentInfo>
                            <FileList>
                              {/* 이미지 갤러리 */}
                              {imageFiles.length > 0 && (
                                <GalleryWrapper>
                                  <GalleryArrow onClick={() => handlePrev(assignment.assignmentId, imageFiles.length)} disabled={imageFiles.length <= 1}>&lt;</GalleryArrow>
                                  <GalleryImage 
                                    src={imageFiles[galleryIdx].fileUrl} 
                                    alt={imageFiles[galleryIdx].fileName}
                                    onError={() => handleImageError(imageFiles[galleryIdx].fileUrl, imageFiles[galleryIdx].fileName)}
                                    style={{ display: imageErrors[imageFiles[galleryIdx].fileUrl] ? 'none' : 'block' }}
                                  />
                                  {imageErrors[imageFiles[galleryIdx].fileUrl] && (
                                    <div style={{ 
                                      width: '100%', 
                                      height: '100%', 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'center',
                                      background: '#f8f8f8',
                                      borderRadius: '8px',
                                      color: '#666'
                                    }}>
                                      이미지를 불러올 수 없습니다
                                    </div>
                                  )}
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
      </ContentWrapper>

      <SidebarArea>
        <AssignmentBrowseSidebar
          students={students}
          selectedId={selectedStudentId}
          onSelect={setSelectedStudentId}
        />
      </SidebarArea>
    </Container>
  );
};

const Container = styled.div`
  background: #f6f7f9;
  min-height: 80vh;
  display: flex;
  flex-direction: row;
  padding: 28px 0px;
`;

const TopTitle = styled.div`
  font-size: 20px;
  color: #222;
  margin-bottom: 18px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;

  .name {
    font-weight: 700;
    display: flex;
    align-items: center;
  }

  .subtitle {
    font-weight: 400;
    display: flex;
    align-items: center;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  padding-left: 5px;
  padding-right: 20px;
  position: relative;

  @media screen and (max-width: 1440px) {
    width: 65vw;
  }

  @media screen and (max-width: 1024px) {
    width: 60vw;
  }

  @media screen and (max-width: 768px) {
    width: 55vw;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const SidebarArea = styled.div`
  background: transparent;
  display: flex;
  flex-direction: column;
`;

const SubmissionList = styled.div`
  flex: 1;
`;

const AccordionBox = styled.div`
  margin-bottom: 18px;
`;

const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: ${props => props.isOpen ? '10px 10px 0 0' : '10px'};
  padding: 24px 28px;
  font-size: 17px;
  font-weight: 700;
  background: #fff;
  cursor: pointer;
  border-bottom: ${props => props.isOpen ? '1px solid #E5E5E5' : 'none'};
`;

const AccordionTitle = styled.div``;
const AccordionIcon = styled.div`
  font-size: 18px;
`;
const AccordionContent = styled.div`
  padding: 24px 28px;
  background: #fff;
  border-radius: 0 0 10px 10px;
  width: 100%;
  box-sizing: border-box;
`;
const NoAssignment = styled.div`
  color: #bbb;
  font-size: 15px;
  padding: 16px 0;
`;
const SubmissionBox = styled.div`
  background: #fff;
  border-radius: 12px;
  margin-top: 14px;
`;
const SubmissionHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 12px;
`;
const AssignmentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  h4 {
    font-size: 17px;
    font-weight: 600;
    margin: 0 0 4px 0;
  }
  .submission-date {
    font-size: 14px;
    font-weight: 600;
    color: #474747;
  }
`;
const FileList = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
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

const GalleryWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  width: 480px;
  height: 320px;

  @media screen and (max-width: 1440px) {
    width: 400px;
    height: 280px;
  }

  @media screen and (max-width: 1024px) {
    width: 320px;
    height: 240px;
  }

  @media screen and (max-width: 768px) {
    width: 280px;
    height: 200px;
  }
`;
const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: contain;
  // background: #f8f8f8;
`;
const GalleryArrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #bbb;
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
  z-index: 1;
  &:disabled {
    color: #eee;
    cursor: default;
  }

  &:first-child {
    left: -32px;
  }

  &:last-child {
    right: -32px;
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
