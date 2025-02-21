import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '../../ui/TopBar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import api from "../../api/api";
import PlayingCurriculumSidebar from '../../ui/class/PlayingCurriculumSidebar';
import DragZone from "../../ui/DragZone";
import CloseIcon from '@mui/icons-material/Close';
import { UsersContext } from '../../contexts/usersContext';
import AssignmentModal from "../../ui/class/AssignmentModal";

const ClassAssignmentSubmit = () => {
    const navigate = useNavigate();
    const { courseId, lectureId, assignmentId } = useParams();
    const { user } = useContext(UsersContext);

    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);
    const [previousFiles, setPreviousFiles] = useState([]);
    const [deletedFiles, setDeletedFiles] = useState([]);
    
    const [submissionId, setSubmissionId] = useState(null);
    const [submissionStatus, setSubmissionStatus] = useState('');

    const [curriculumData, setCurriculumData] = useState([]);
    const [currentLectureInfo, setCurrentLectureInfo] = useState([]);
    const [currentAssignmentInfo, setCurrentAssignmentInfo] = useState([]);

    const [isSubmittedModalOpen, setIsSubmittedModalOpen] = useState(false);
    const [isReSubmittedModalOpen, setIsReSubmittedModalOpen] = useState(false);

    const handleSubmit = async () => {
        if (!user) return;

        if(!content && files.length === 0) {
            alert("제출할 것이 없습니다.");
            return;
        }

        try {
            let response;

            const newFiles = files.filter(file => !file.fileUrl);
            const existingFileUrls = files
                .filter(file => file.fileUrl)
                .map(file => file.fileUrl);
            const deleteFileUrls = [...deletedFiles];
    
            const formData = new FormData();
            formData.append("textContent", content);

            if (newFiles.length > 0) {
                newFiles.forEach((file) => {
                    formData.append("files", file.object);
                });
            }
    
            switch(submissionStatus) {
                case "NOT_SUBMITTED":
                case "LATE": {
                    response = await api.put(
                        `/assignments/${assignmentId}/submissions/${submissionId}/${user.userId}`,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );
                    break;
                }
                
                case "SUBMITTED": {
                    if (existingFileUrls.length > 0) {
                        existingFileUrls.forEach(url => {
                            formData.append("existingFileUrls", url);
                        });
                    }
                    
                    if (deleteFileUrls.length > 0) {
                        deleteFileUrls.forEach(url => {
                            formData.append("deleteFileUrls", url);
                        });
                    }
    
                    response = await api.put(
                        `/assignments/${assignmentId}/submissions/${submissionId}/${user.userId}`,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );
                    break;
                }
            }
            if (response.data.success) {
                const statusResponse = await api.get(
                    `/assignments/${assignmentId}/submissions/${submissionId}/${user.userId}`
                );
    
                if (statusResponse.data.success) {
                    submissionStatus === "NOT_SUBMITTED"
                        ? setIsSubmittedModalOpen(true)
                        : setIsReSubmittedModalOpen(true);
                }
            }
        } catch (error) {
            console.error("과제 제출 오류:", error);
        }
    };

    const handleNavigationCurriculum = () => {
        navigate(`/class/${courseId}/curriculum/${lectureId}`);
    };

    useEffect(() => {
        const fetchSubmissionData = async () => {
            try {
                if (!assignmentId || !lectureId || !user || !courseId) return;

                const lectureResponse = await api.get(`/lectures/history/${courseId}/${user.userId}`);
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
                    const filesData = statusResponse.data.data.fileNames.map((fileName, index) => ({
                        id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                        name: fileName,
                        size: statusResponse.data.data.fileSizes[index],
                        fileUrl: statusResponse.data.data.fileUrls[index],
                    }));
                    
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
            assignment => assignment.assignmentId === Number(assignmentId)
        );

        if (foundAssignment) {
            setCurrentAssignmentInfo(foundAssignment);
        }
    }, [currentLectureInfo, assignmentId]);
    
    const DeleteImageHandle = (e, fileId) => {
        e.preventDefault();
    
        const fileToDelete = files.find((file) => file.id === fileId);
    
        if (!fileToDelete) {
            console.warn("삭제할 파일을 찾을 수 없습니다.");
            return;
        }
    
        if (fileToDelete.object?.preview) {
            URL.revokeObjectURL(fileToDelete.object.preview);
        }
    
        const updatedFiles = files.filter((file) => file.id !== fileId);
        setFiles(updatedFiles);
        
        if (fileToDelete.fileUrl) {
            setDeletedFiles((prev) => [...prev, fileToDelete.fileUrl]);
        }
    };
    
    const OnClickImage = async (e, fileId) => {
        e.preventDefault();
        
        const fileToDownload = files.find((file) => file.id === fileId);
        if (!fileToDownload) {
            console.error('파일을 찾을 수 없습니다.');
            return;
        }
    
        try {
            const response = await api.get("/files/download", {
                params: { 
                    fileUrl: fileToDownload.fileUrl
                },
            });
            
            const presignedUrl = response.data;

            const fileResponse = await fetch(presignedUrl);

            const contentType = response.headers["content-type"];
            console.log("Content-Type:", contentType);  // 콘솔에 출력

            const arrayBuffer = await fileResponse.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: fileToDownload.type === 'pdf' ? 'application/pdf' : fileToDownload.mimeType });
        
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileToDownload.name;
            a.click();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("파일 처리 중 오류:", error);
        }
    };

    return (
        <Wrapper>
        <TopBar />
        <Container>
            <LeftSide>
                <TitleContainer>
                    <MainTitle>
                        {currentLectureInfo?.lectureTitle || "강의를 선택해주세요"}
                    </MainTitle>
                    
                    <ClickContainer onClick={handleNavigationCurriculum}>
                        <ArrowForwardIosIcon style={{ width: '13px', marginLeft: '15px' }}/>
                    </ClickContainer>
                </TitleContainer>
                
                <WhiteBoxComponent>
                    <NoticeTitleContainer>
                        <FormTitle style={{marginTop: '0px'}}>
                            {currentAssignmentInfo?.assignmentTitle || "과제 제목"}
                        </FormTitle>
                    </NoticeTitleContainer>
                    <NoticeContentContainer>
                        <span>{currentAssignmentInfo?.assignmentContent || "과제 설명"}</span>
                    </NoticeContentContainer>
                </WhiteBoxComponent>

                <WhiteBoxComponent style={{height: '70vh'}}>
                    <Box>
                        <FormTitle>내용</FormTitle>
                        <EditorContainer>
                            <TextArea
                                placeholder="내용을 입력하세요" 
                                value={content || ''}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </EditorContainer>
                    </Box>

                    <Box>
                        <FormTitle>파일 업로드하기</FormTitle>
                        <DragZone setFiles={setFiles}/>
                    </Box>

                    <ImageItemContainer>
                    {files.length > 0 && (
                        files.map((file) => (
                            <ImageItem 
                                key={file.fileUrl} 
                                $textWidth={file.name?.length ? file.name.length * 10 : 100}
                                title={file.fileName}
                            >
                                <ImageText title={file.fileName} onClick={(e) => OnClickImage(e, file.id)}>{file.name}</ImageText>
                                <CloseIcon 
                                    onClick={(e) => {
                                        DeleteImageHandle(e, file.id);
                                    }} 
                                    style={{width: '15px', cursor: 'pointer'}}
                                />
                            </ImageItem>
                        ))
                    )}
                    </ImageItemContainer>
                    {submissionStatus === 'LATE' ?
                        (<SubmitButton onClick={handleSubmit}>수정하기</SubmitButton> ) 
                        : (<SubmitButton onClick={handleSubmit}>제출하기</SubmitButton> ) }
                </WhiteBoxComponent>
            </LeftSide>

            <RightSide>
                <PlayingCurriculumSidebar
                    curriculumData={curriculumData} setCurriculumData={setCurriculumData}
                    currentLectureInfo={currentLectureInfo} setCurrentLectureInfo={setCurrentLectureInfo}
                />
            </RightSide>

            { isSubmittedModalOpen && <AssignmentModal text="과제 제출이 완료되었습니다."  onClose={() => setIsSubmittedModalOpen(false)}/> }
            { isReSubmittedModalOpen && <AssignmentModal text="과제 수정이 완료되었습니다."  onClose={() => setIsReSubmittedModalOpen(false)}/> }
        </Container>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    height: 100vh;
`

const Container = styled.div`
    display: flex;
    height: 100%,
    background-color: #F6F7F9;
`;

const LeftSide = styled.div`
    width: 70vw;
    flex: 1;
    padding: 0px 37px;
    height: calc(92vh - 16px);
    overflow-y: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
`;

const FormTitle = styled.div`
    font-size: 17px;
    font-weight: 700;
    padding: 0px 10px;
    margin-top: 5px;
`;

const WhiteBoxComponent = styled.div`
    border-radius: 20px;
    background-color: #FFFFFF;
    height: 30vh;
    margin-bottom: 50px;
    padding: 10px;
`

const Box = styled.div`
    height: 25vh;
    gap: 10px;
`

const NoticeTitleContainer = styled.div`
    border-radius: 13px;
    background-color: #F6F7F9;
    height: 40px;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
`

const NoticeContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding-left: 10px;
`

const TitleContainer = styled.div`
    margin-top: 36px;
    margin-bottom: 26px;
    display: flex;
    align-items: flex-end;
`;

const MainTitle = styled.div`
    font-size: 24px;
    font-weight: 700;
    display: flex;
    align-items: center;
    align-items: center;
    margin-right: 10px;
`;

const ClickContainer = styled.div`
    display: flex;
    cursor: pointer;
`

const RightSide = styled.div`
    width: 30vw;
    padding: 0px 15px;
    padding-top: 36px;
    background-color: #FFFFFF;
`;

const EditorContainer = styled.div`
    border: 2px solid #CDCDCD;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 10px;
    height: 18vh;
    margin: 10px;
`;

const TextArea = styled.textarea`
    width: 100%;
    height: 18vh;
    padding: 16px;
    border: none;
    resize: none;
    font-size: 13px;

    &::placeholder {
        color: #9E9E9E;
    }

    &:focus {
        outline: none;
    }
`;

const ImageItemContainer = styled.div`
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 10px;
    margin: 10px;
    padding-bottom: 5px;
`;

const ImageItem = styled.div`
    display: flex;
    align-items: center;
    background-color: #F6F7F9;
    min-width: fit-content;
    max-width: 150px;
    padding: 5px;
    justify-content: space-between;
    border-radius: 8px;
`;
const ImageText = styled.div`
    margin-right: 3px;
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
`;

const SubmitButton = styled.button`
    float: right;
    padding: 8px 20px;
    background-color: #FF4747;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    margin-right: 10px;

    &:hover {
        background-color: #E53935;
    }
`;

export default ClassAssignmentSubmit;