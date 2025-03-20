import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import TopBar from "../../ui/TopBar";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import api from "../../api/api";
import PlayingCurriculumSidebar from "../../ui/class/PlayingCurriculumSidebar";
import { UsersContext } from "../../contexts/usersContext";
import AssignmentSubmitBox from "../../ui/class/AssignmentSubmitBox";
import AssignmentShowBox from "../../ui/class/AssignmentShowBox";
import { ModalOverlay } from "../../ui/modal/ModalStyles";

const ClassAssignmentSubmit = () => {
  const navigate = useNavigate();
  const { courseId, lectureId, assignmentId } = useParams();
  const { user } = useContext(UsersContext);

  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [previousFiles, setPreviousFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);

  const [submissionId, setSubmissionId] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [submissionType, setSubmissionType] = useState(null);

  const [curriculumData, setCurriculumData] = useState([]);
  const [currentLectureInfo, setCurrentLectureInfo] = useState([]);
  const [currentAssignmentInfo, setCurrentAssignmentInfo] = useState([]);

  const [isSubmittedModalOpen, setIsSubmittedModalOpen] = useState(false);
  const [isReSubmittedModalOpen, setIsReSubmittedModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const handleNavigationCurriculum = () => {
    navigate(`/class/${courseId}/curriculum/${lectureId}`);
  };

  useEffect(() => {
    const fetchSubmissionData = async () => {
      try {
        if (!assignmentId || !lectureId || !user || !courseId) return;

        const lectureResponse = await api.get(
          `/lectures/history/${courseId}/${user.userId}`
        );
        if (lectureResponse.data.success) {
          const submission = lectureResponse.data.data.submissions.find(
            (submission) => submission.assignmentId === parseInt(assignmentId)
          );
          if (submission) {
            setSubmissionId(submission.submissionId);
            setSubmissionStatus(submission.submissionStatus);
          } else {
            setSubmissionId(null);
            setSubmissionStatus("NOT_SUBMITTED");
          }
        }
      } catch (error) {
        console.error("제출 정보 로딩 오류:", error);
      }
    };

    fetchSubmissionData();
  }, [assignmentId, lectureId, courseId, user]);

  useEffect(() => {
    const fetchAssignmentData = async () => {
      if (!submissionId || !assignmentId || !user) return;

      try {
        const statusResponse = await api.get(
          `/assignments/${assignmentId}/submissions/${submissionId}/${user.userId}`
        );

        if (statusResponse.data.success) {
          const filesData = statusResponse.data.data.fileNames.map(
            (fileName, index) => ({
              id: Date.now() + "_" + Math.random().toString(36).substr(2, 9),
              name: fileName,
              size: statusResponse.data.data.fileSizes[index],
              fileUrl: statusResponse.data.data.fileUrls[index],
            })
          );

          setFiles(filesData);
          setPreviousFiles(filesData);
          setContent(statusResponse.data.data.textContent);
        }
      } catch (error) {
        console.error("과제 정보 로딩 오류:", error);
      }
    };

    fetchAssignmentData();
  }, [submissionId, assignmentId, user]);

  useEffect(() => {
    if (!currentLectureInfo?.videos || !assignmentId) return;

    const foundAssignment = currentLectureInfo.assignments.find(
      (assignment) => assignment.assignmentId === Number(assignmentId)
    );

    if (foundAssignment) {
      setCurrentAssignmentInfo(foundAssignment);
    }
  }, [currentLectureInfo, assignmentId]);

  useEffect(() => {
      const fetchSubmissionType = async () => {
        if (!assignmentId || !courseId || !user) return;
  
        try {
          const response = await api.get(
            `/lectures/curriculum/${courseId}/${user.userId}`
          );
  
          if (response.data.success) {
            const curriculum = response.data.data.curriculumResponses;
            
            let foundType = null;
            for (const lecture of curriculum) {
              const assignment = lecture.assignments.find(
                (a) => a.assignmentId === parseInt(assignmentId)
              );
              if (assignment) {
                foundType = assignment.submissionType;
                console.log(foundType);
                break;
              }
            }
  
            if (foundType) {
              setSubmissionType(foundType);
            } else {
              console.warn("해당 과제의 submissionType을 찾을 수 없습니다.");
            }
          }
        } catch (error) {
          console.error("과제 유형 로딩 오류:", error);
        }
      };
  
      fetchSubmissionType();
    }, [assignmentId, courseId, user]);

  useEffect(() => {
    if (submissionStatus === "NOT_SUBMITTED") {
      setCanEdit(true);
    } else {
      setCanEdit(false);
    }
  }, [assignmentId, submissionStatus]);

  return (
      <Container>
        <LeftSide>
          <TitleContainer>
            <MainTitle>
              {currentLectureInfo?.lectureDescription || "강의를 선택해주세요"}
            </MainTitle>

            <ClickContainer onClick={handleNavigationCurriculum}>
              <ArrowForwardIosIcon
                style={{ width: "13px", marginLeft: "15px" }}
              />
            </ClickContainer>
          </TitleContainer>

          <WhiteBoxComponent>
            <NoticeTitleContainer>
              <FormTitle style={{ marginTop: "0px" }}>
                {currentAssignmentInfo?.assignmentTitle || "과제 제목"}
              </FormTitle>
            </NoticeTitleContainer>
            <NoticeContentContainer>
              {currentAssignmentInfo?.assignmentDescription || "과제 설명"}
            </NoticeContentContainer>
          </WhiteBoxComponent>

          {submissionStatus === "NOT_SUBMITTED" || canEdit ? (
            <AssignmentSubmitBox
              courseId={courseId}
              userId={user?.userId}
              canEdit={canEdit}
              setCanEdit={setCanEdit}
              content={content}
              setContent={setContent}
              files={files}
              setFiles={setFiles}
              submissionId={submissionId}
              submissionStatus={submissionStatus}
              submissionType={submissionType}
              setIsSubmittedModalOpen={setIsSubmittedModalOpen}
              setIsReSubmittedModalOpen={setIsReSubmittedModalOpen}
            />
          ) : (
            <AssignmentShowBox
              setCanEdit={setCanEdit}
              content={content}
              files={files}
              submissionId={submissionId}
              submissionStatus={submissionStatus}
              submissionType={submissionType}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
            />
          )}
        </LeftSide>

        <RightSide>
          <PlayingCurriculumSidebar
            curriculumData={curriculumData}
            setCurriculumData={setCurriculumData}
            currentLectureInfo={currentLectureInfo}
            setCurrentLectureInfo={setCurrentLectureInfo}
          />
        </RightSide>

        {isSubmittedModalOpen && (
          <ModalOverlay>
            <ModalContainer>
              <Message>과제 제출이 완료되었어요</Message>
              <CloseButton
                onClick={() => {
                  setIsSubmittedModalOpen(false);
                  window.location.reload();
                }}>확인</CloseButton>
            </ModalContainer>
          </ModalOverlay>
        )}
        {isReSubmittedModalOpen && (
          <ModalOverlay>
            <ModalContainer>
              <Message>과제가 수정되었어요</Message>
              <CloseButton
                onClick={() => {
                  setIsReSubmittedModalOpen(false);
                  window.location.reload();
                }}>확인</CloseButton>
            </ModalContainer>
          </ModalOverlay>
        )}
        {isDeleteModalOpen && (
          <ModalOverlay>
            <ModalContainer>
              <Message>과제가 삭제되었어요</Message>
              <CloseButton
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  window.location.reload();
                }}>확인</CloseButton>
            </ModalContainer>
          </ModalOverlay>
        )}
      </Container>
  );
};

const Container = styled.div`
  display: flex;
  margin-top: 30px;
  background-color: #F6F7F9;
`;

const LeftSide = styled.div`
  width: 70vw;
  flex: 1;
  padding-left: 5px;
  padding-right: 20px;

`;

const FormTitle = styled.div`
  font-size: 17px;
  font-weight: 700;
  padding: 0px 10px;
  margin-top: 5px;
`;

const WhiteBoxComponent = styled.div`
  border-radius: 20px;
  background-color: #ffffff;
  height: 30vh;
  margin-bottom: 50px;
  padding: 10px;
`;

const NoticeTitleContainer = styled.div`
  border-radius: 13px;
  background-color: #f6f7f9;
  height: 40px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const NoticeContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  overflow: auto;
  height: calc(30vh - 65px);
  white-space: pre-wrap;
  &::-webkit-scrollbar {
    display: block;
  }
`;

const TitleContainer = styled.div`
  margin-bottom: 26px;
  display: flex;
  align-items: flex-end;
`;

const MainTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const ClickContainer = styled.div`
  display: flex;
  cursor: pointer;
`;

const RightSide = styled.div`
  width: 20vw;
  height: 70vh;
  overflow-y: auto;
  padding: 25px 20px;
  background-color: #FFFFFF;
  border-radius: 20px;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 40px 80px;
  border-radius: 8px;
  text-align: center;
  width: 50%;
  max-width: 300px;
  font-size: 1rem;
  position: relative;
`;

const Message = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: red;
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  right: 30px;
  bottom: 20px;
  font-weight: 700;
`;

export default ClassAssignmentSubmit;
