import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '../../ui/TopBar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Assignment from "../../img/icon/docs.svg";
import Material from "../../img/icon/pdf.svg";
import api from "../../api/api";
import DragZone from "../../ui/DragZone";
import CloseIcon from '@mui/icons-material/Close';
import { UsersContext } from '../../contexts/usersContext';
import AssignmentModal from "../../ui/class/AssignmentModal";

const ClassAssignmentSubmit = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { courseId, lectureId, assignmentId } = useParams();
    
    const { user } = useContext(UsersContext);
    const [selectedMenu, setSelectedMenu] = useState('curriculum');
    const [expandedItems, setExpandedItems] = useState(new Set([1]));

    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);
    const [previousFiles, setPreviousFiles] = useState([]);
    const [deletedFiles, setDeletedFiles] = useState([]);
    
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [assignmentContent, setAssignmentContent] = useState('');
    const [submissionId, setSubmissionId] = useState(null);
    const [submissionStatus, setSubmissionStatus] = useState('');

    const [curriculumData, setCurriculumData] = useState([]);

    const [isSubmittedModalOpen, setIsSubmittedModalOpen] = useState(false);
    const [isReSubmittedModalOpen, setIsReSubmittedModalOpen] = useState(false);

    const toggleItem = (itemId) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const truncate = (str, n) => {
        return str?.length > n ? str.substr(0, n - 1) + "..." : str;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'WATCHED':
                return <span className="material-icons" style={{ color: '#474747', fontSize: '20px' }}>check_circle</span>;
            case 'WATCHING':
                return (
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <span className="material-icons" style={{ color: '#C3C3C3', fontSize: '20px' }}>check_circle</span>
                        <span className="material-icons" style={{ color: '#474747', fontSize: '20px' }}>play_circle</span>
                    </div>
                );
            case 'NOT_WATCHED':
                return <span className="material-icons" style={{ color: '#C3C3C3', fontSize: '20px' }}>check_circle</span>;
            default:
                return null;
        }
    };

    const handleAssignmentClick = (assignmentId) => {
        navigate(`/assignment/submit/${assignmentId}`);
    };

    const handleNavigationCurriculum = () => {
        navigate('/curriculum');
    };

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
            
            console.log("=== 제출 시점의 파일 상태 ===");
            console.log("현재 files 길이:", files.length);
            console.log("previousFiles 길이:", previousFiles.length);
            console.log("현재 files:", files);
            console.log("previousFiles:", previousFiles);
            console.log("📌 기존 파일 유지:", existingFileUrls);
            console.log("📌 새 파일 업로드:", newFiles);
            console.log("🚨 삭제할 파일:", deleteFileUrls);
    
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

    const getCurrentVideo = () => {
        return {
            lectureTitle: curriculumData.lectureTitle,
            //videoTitle: curriculumData.videos[0]?.videoTitle || "강의를 선택해주세요"
        };
    };

    const getCurrentAssignment = () => {
        if (curriculumData && assignmentId) {
            const assignment = curriculumData.assignments.find(
                assignment => assignment.assignmentId === parseInt(assignmentId)
            );
            if (assignment) {
                return {
                    name: assignment.assignmentTitle,
                    deadline: `${formatDate(assignment.startDate)} - ${formatDate(assignment.endDate)}`,
                    description: assignment.assignmentDescription
                };
            }
        }
        return null;
    };

    useEffect(() => {
        const fetchAssignmentData = async () => {
            if (!submissionId) return;
    
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
    }, [submissionId]); 

    useEffect(() => {
        const fetchSubmissionData = async () => {
            try {
                if (!assignmentId || !lectureId || !user) return;
    
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
                console.error("데이터 로딩 오류:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchSubmissionData();
    }, [assignmentId, lectureId, user]);
    

    const DeleteImageHandle = (e, fileId) => {
        e.preventDefault();

        console.log("=== 삭제 전 상태 ===");
        console.log("삭제할 fileId:", fileId);
        console.log("현재 files:", files);
        console.log("현재 previousFiles:", previousFiles);
    
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

        console.log("=== 삭제 후 상태 ===");
        console.log("업데이트된 files:", updatedFiles);
        console.log("previousFiles 유지:", previousFiles);
    };
    
    const OnClickImage = async (e, fileId) => {
        const fileToDownload = files.find((file) => file.id === fileId);
        
        if (!fileToDownload) {
            console.error('파일을 찾을 수 없습니다.');
            return;
        }
    
        try {
            const response = await api.get("/files/download", {
                params: { 
                    fileUrl: fileToDownload.object.fileUrl 
                },
                responseType: 'blob'
            });
    
            const blob = new Blob([response.data], { 
                type: 'application/octet-stream' 
            });
    
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileToDownload.object.name;
            document.body.appendChild(link);
            link.click();
            
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
    
        } catch (error) {
            console.error("파일 다운로드 중 오류:", error);
        }
    };

    return (
        <>
        <TopBar />
        {loading ?  (
            <></>
        ) : (
        <Container>
            <LeftSide>
                <TitleContainer>
                        <MainTitle>
                            <span>{getCurrentVideo()?.lectureTitle || "강의를 선택해주세요"}</span>
                        </MainTitle>
                        
                        <ClickContainer onClick={handleNavigationCurriculum}>
                            <ArrowForwardIosIcon style={{ width: '13px', marginLeft: '15px' }}/>
                        </ClickContainer>
                </TitleContainer>

                <WhiteBoxComponent>
                <NoticeTitleContainer>
                    <FormTitle style={{marginTop: '0px'}}>{assignmentTitle || "과제 작성"}</FormTitle>
                </NoticeTitleContainer>
                <NoticeContentContainer>
                    <span>{assignmentContent}</span>
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
                            >
                                <ImageText onClick={(e) => OnClickImage(e, file.fileUrl)}>{file.name}</ImageText>
                                <CloseIcon 
                                    onClick={(e) => {
                                        DeleteImageHandle(e, file.id);
                                    }} 
                                    style={{width: '15px'}}
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
                <MenuSelect>
                    <MenuButton>커리큘럼</MenuButton>
                </MenuSelect>
                
                <RightContainer>
                    {selectedMenu === 'curriculum' && (
                        <CurriculumList>
                            <CurriculumItem>
                                <ItemTitle>{curriculumData.lectureTitle}</ItemTitle>
                                {/* {curriculumData.videos.length > 0 && ( */}
                                    <IconWrapper onClick={() => toggleItem(curriculumData.lectureId)}>
                                        <span className="material-icons">
                                            {expandedItems.has(curriculumData.lectureId) ? 'expand_more' : 'chevron_right'}
                                        </span>
                                    </IconWrapper>
                                {/* )} */}
                            </CurriculumItem>
                            {expandedItems.has(curriculumData.lectureId) && curriculumData.videos.map((video) => (
                                <SubItem key={video.videoId} status={video.videoHistoryStatus}>
                                            <SubItemHeader>
                                                <SubItemLeft>
                                                    <SubItemTitle status={video.videoHistoryStatus}>
                                                        <span>{video.videoId}. {truncate(video.videoTitle, 25)}</span>
                                                    </SubItemTitle>
                                                    <SubItemTime>
                                                        <span className="material-icons" style={{ color: '#909090', fontSize: '13.33px', marginRight: '3px' }}>
                                                            play_circle_outline
                                                        </span>
                                                        {video.time}
                                                    </SubItemTime>
                                                </SubItemLeft>
                                                {getStatusIcon(video.videoHistoryStatus)}
                                            </SubItemHeader>
                                            {(video.material || video.assignment) && (
                                                <SubItemContent>
                                                    {video.material && (
                                                        <ResourceItem>
                                                            <img
                                                                className="material-icons"
                                                                src={Material}
                                                                alt="assignment icon"
                                                                style={{
                                                                width: "16px",
                                                                marginRight: "4px",
                                                                }}
                                                            />
                                                            {video.material.name}
                                                            <span style={{ fontSize: '12px', color: '#FF4747' }}>({video.material.size})</span>
                                                        </ResourceItem>
                                                    )}
                                                    {video.assignment && (
                                                        <AssignmentItem onClick={() => handleAssignmentClick(video.assignment.assignmentId)}>
                                                            <img
                                                                className="material-icons"
                                                                src={Assignment}
                                                                alt="assignment icon"
                                                                style={{
                                                                    width: "16px",
                                                                    marginRight: "4px",
                                                                }}
                                                            />
                                                            {video.assignment.name}
                                                            <span style={{ fontSize: '12px', color: '#FF4747' }}>
                                                                {video.assignment.deadline}
                                                            </span>
                                                        </AssignmentItem>
                                                    )}
                                                </SubItemContent>
                                            )}
                                        </SubItem>
                                    ))}
                        </CurriculumList>
                    )}
                </RightContainer>
            </RightSide>
            { isSubmittedModalOpen && <AssignmentModal text="과제 제출이 완료되었습니다."  onClose={() => setIsSubmittedModalOpen(false)}/> }
            { isReSubmittedModalOpen && <AssignmentModal text="과제 수정이 완료되었습니다."  onClose={() => setIsReSubmittedModalOpen(false)}/> }
        </Container>
        )}
        </>
    );
};

const Container = styled.div`
    display: flex;
    background-color: #F6F7F9;
    width: 100%;
    max-width: 100vw;
    overflow: hidden;
`;

const LeftSide = styled.div`
    width: 70%;
    min-width: 70%;
    max-width: 70%;
    height: 100%;
    padding: 0px 37px;
    flex-shrink: 0;
    overflow: hidden;
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

const MenuSelect = styled.div`
    display: flex;
    width: 90%;
    margin: 0 auto;
    margin-bottom: 20px;
`;

const MenuButton = styled.div`
    flex: 1;
    padding: 13px 0px;
    font-size: 20px;
    font-weight: 600;
    background: none;
    border: none;
    border-bottom: 3px solid #000
`;

const RightContainer = styled.div`
    height: 70vh;
    overflow-y: scroll;
    margin-right: -12px;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const CurriculumList = styled.div`
    padding: 0 20px;
`;

const CurriculumItem = styled.div`
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
`;

const IconWrapper = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    
    &:hover {
        background-color: #f5f5f5;
        border-radius: 50%;
    }
`;

const ItemTitle = styled.span`
    font-size: 17px;
    font-weight: 700;
`;

const SubItem = styled.div`
    display: flex;
    flex-direction: column;
    padding: 15px 14px;
    background-color: ${props => props.status === 'WATCHING' ? '#F8F8F8' : 'transparent'};
`;

const SubItemHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

const SubItemContent = styled.div`
    margin-top: 8px;
    padding-left: 2px;
`;

const ResourceItem = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 0;
    font-size: 13px;
    color: #474747;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

const AssignmentItem = styled(ResourceItem)`
`;

const SubItemLeft = styled.div`
    flex: 1;
`;

const SubItemTitle = styled.div`
    font-size: 15px;
    margin-bottom: 4px;
    font-weight: ${props => props.status === 'WATCHING' ? 800 : 400}
`;

const SubItemTime = styled.div`
    font-size: 12px;
    color: #909090;
    display: flex;
    align-items: center;
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
    curosr: pointer;
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