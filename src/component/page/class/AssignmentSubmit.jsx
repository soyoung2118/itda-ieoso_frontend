import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '../../ui/TopBar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Photo from "../../img/icon/photo.svg";
import Video from "../../img/icon/video.svg";
import Link from "../../img/icon/link.svg";
import Assignment from "../../img/icon/docs.svg";
import Material from "../../img/icon/pdf.svg";


const ClassAssignmentSubmit = () => {
    const navigate = useNavigate();
    const { lectureId, videoId } = useParams();
    const [selectedMenu, setSelectedMenu] = useState('curriculum');
    const [expandedItems, setExpandedItems] = useState(new Set([1]));
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);

    const handleFileUpload = (type) => {
        const input = document.createElement('input');
        input.type = 'file';
        if (type === 'photo') {
            input.accept = 'image/*';
        } else if (type === 'video') {
            input.accept = 'video/*';
        }
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setFiles([...files, { type, file }]);
            }
        };
        input.click();
    };
    
    const handleLinkAdd = () => {
        const link = prompt('링크를 입력하세요');
        if (link) {
            setFiles([...files, { type: 'link', url: link }]);
        }
    };

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

    const curriculumData = [
        {
            lectureId: 1,
            lectureTitle: "1. 기초를 준비해요.",
            lectureDescription: "챕터 설명을 작성하세요.",
            videos: [
                {
                    videoId: 1,
                    videoTitle: "꾸미고 싶은 타입을 정해서 다이어리를 꾸며보세요",
                    videoUrl: "영상 링크 첨부",
                    time: '21:30',
                    startDate: "2025-03-01T23:59:59",
                    endDate: "2025-03-07T23:59:59",
                    videoHistoryStatus: "WATCHED"
                },
                {
                    videoId: 2,
                    videoTitle: "필기구 소개",
                    videoUrl: "영상 링크 첨부",
                    time: '11:10',
                    startDate: "2025-03-01T23:59:59",
                    endDate: "2025-03-07T23:59:59",
                    videoHistoryStatus: "WATCHING",
                    material: {
                        name: "오늘의 다이어리",
                        size: "3.1MB",
                    },
                    assignment: {
                        name: "1/6(월) 과제 제출",
                        deadline: "2025.01.06 15:00:00 - 2025.01.12 23:59",
                    },
                },
                {
                    videoId: 3,
                    videoTitle: "나만의 색연필 차트",
                    videoUrl: "영상 링크 첨부",
                    time: '21:30',
                    startDate: "2025-03-01T23:59:59",
                    endDate: "2025-03-07T23:59:59",
                    videoHistoryStatus: "NOT_WATCHED"
                },
            ],
        },
        {
            lectureId: 2,
            lectureTitle: "2. 한 달을 기록해요",
            lectureDescription: "챕터 설명을 작성하세요.",
            videos: [],
        },
        {
            lectureId: 3,
            lectureTitle: "3. 한 주를 기록해요",
            lectureDescription: "챕터 설명을 작성하세요.",
            videos: [],
        },
        {
            lectureId: 4,
            lectureTitle: "4. 하루를 꾸며요",
            lectureDescription: "챕터 설명을 작성하세요.",
            videos: [],
        },
    ];

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

    const handleAssignmentClick = (lectureId, videoId) => {
        navigate(`/assignment/submit/${lectureId}/${videoId}`);
    };

    const handleNavigationCurriculum = () => {
        navigate('/curriculum');
    };

    const handleFileDelete = (indexToDelete) => {
        setFiles(files.filter((_, index) => index !== indexToDelete));
    };

    const handleSubmit = () => {
        console.log({
            title,
            content,
            files,
            lectureId,
            videoId,
            assignmentName: getCurrentAssignment()?.name
        });
    };

    const getCurrentVideo = () => {
        for (const lecture of curriculumData) {
            const currentVideo = lecture.videos.find(video => video.videoHistoryStatus === "WATCHING");
            if (currentVideo) {
                return {
                    lectureTitle: lecture.lectureTitle,
                    videoTitle: currentVideo.videoTitle,
                    lectureId: lecture.lectureId,
                    videoId: currentVideo.videoId
                };
            }
        }
        return null;
    };

    const getCurrentAssignment = () => {
        const currentLecture = curriculumData.find(lecture => 
            lecture.lectureId === parseInt(lectureId)
        );
        if (currentLecture) {
            const currentVideo = currentLecture.videos.find(video => 
                video.videoId === parseInt(videoId)
            );
            if (currentVideo && currentVideo.assignment) {
                return currentVideo.assignment;
            }
        }
        return null;
    };

    return (
        <>
        <TopBar />
        <Container>
            <LeftSide>
                <TitleContainer>
                        <MainTitle>
                            <span>{getCurrentVideo()?.lectureTitle || "강의를 선택해주세요"}</span>
                        </MainTitle>
                        
                        <ClickContainer onClick={handleNavigationCurriculum}>
                            <SubTitle>
                                {getCurrentVideo()?.videoId && `(${getCurrentVideo()?.videoId}) `}
                                {getCurrentVideo()?.videoTitle || "강의를 선택해주세요"}
                            </SubTitle>
                            <ArrowForwardIosIcon style={{ width: '13px', marginLeft: '15px' }}/>
                        </ClickContainer>
                </TitleContainer>

                <WhiteBoxComponent>
                    <NoticeTitleContainer>
                        <FormTitle style={{marginTop: '0px'}}>{getCurrentAssignment()?.name || "과제 작성"}</FormTitle>
                    </NoticeTitleContainer>
                    <NoticeContentContainer>
                        <span>안녕하세요</span>
                        <span>어쩌고저쩌고</span>
                        <span>랄랄라라</span>
                        <span>이것만 하고 잡니다!</span>
                    </NoticeContentContainer>
                </WhiteBoxComponent>

                <WhiteBoxComponent>
                    <FormTitle>내용</FormTitle>
                    <EditorContainer>
                        <TextArea
                            placeholder="내용을 입력하세요" 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </EditorContainer>
                    <SubmitButton onClick={handleSubmit}>제출하기</SubmitButton>
                </WhiteBoxComponent>

                <WhiteBoxComponent>
                    <FormTitle>파일 업로드</FormTitle>
                    <UploadContainer>
                        파일을 업로드 합니다
                    </UploadContainer>
                </WhiteBoxComponent>

                <WhiteBoxComponent>
                    <FormTitle>내용</FormTitle>
                    <EditorContainer>
                        <TextArea
                            placeholder="내용을 입력하세요" 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </EditorContainer>
                    <SubmitButton onClick={handleSubmit}>제출하기</SubmitButton>
                </WhiteBoxComponent>

                <WhiteBoxComponent style={{height: '60vh'}}>
                    <Box>
                        <FormTitle>내용</FormTitle>
                        <EditorContainer>
                            <TextArea
                                placeholder="내용을 입력하세요" 
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </EditorContainer>
                    </Box>

                    <Box>
                        <FormTitle>파일 업로드</FormTitle>
                        <UploadContainer>
                            파일을 업로드 합니다
                        </UploadContainer>
                    </Box>
                    <SubmitButton onClick={handleSubmit}>제출하기</SubmitButton>
                </WhiteBoxComponent>
            </LeftSide>

            <RightSide>
                <MenuSelect>
                    <MenuButton 
                        isSelected={selectedMenu === 'curriculum'}
                        onClick={() => setSelectedMenu('curriculum')}
                    >
                        커리큘럼
                    </MenuButton>
                </MenuSelect>
                
                <RightContainer>
                    {selectedMenu === 'curriculum' && (
                        <CurriculumList>
                            {curriculumData.map((lecture) => (
                                <div key={lecture.lectureId}>
                                    <CurriculumItem>
                                        <ItemTitle>{lecture.lectureTitle}</ItemTitle>
                                        {lecture.videos.length > 0 && (
                                            <IconWrapper onClick={() => toggleItem(lecture.lectureId)}>
                                                <span className="material-icons">
                                                    {expandedItems.has(lecture.lectureId) ? 'expand_more' : 'chevron_right'}
                                                </span>
                                            </IconWrapper>
                                        )}
                                    </CurriculumItem>
                                    {expandedItems.has(lecture.lectureId) && lecture.videos.map((video) => (
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
                                                        <AssignmentItem onClick={() => handleAssignmentClick(lecture.lectureId, video.videoId)}>
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
                                </div>
                            ))}
                        </CurriculumList>
                    )}
                </RightContainer>
            </RightSide>
        </Container>
        </>
    );
};

const Container = styled.div`
    display: flex;
    overflow: hidden;
    background-color: #F6F7F9;
`;

const LeftSide = styled.div`
    width: 70vw;
    height: 100%;
    padding: 0px 37px;
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
    width: 100%;
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

const SumbitContainer = styled.div`
    border: 1px solid #E0E0E0;
    border-radius: 20px;
    background-color: #FFFFFF;
    width: 100%;
    height: 70vh;
`;

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

const SubTitle = styled.div`
    font-size: 16px;
    font-weight: 400;
`;

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

const AssignmentForm = styled.div`
    padding: 20px;
`;

const Label = styled.div`
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 10px;
`;

const FormGroup = styled.div`
    margin-bottom: 14px;
    margin: 0px 10px;
`;

const Input = styled.input`
    width: calc(100% - 32px);
    height: 28px;
    padding: 0 16px;
    border: 2px solid #CDCDCD;
    border-radius: 10px;
    font-size: 13px;

    &::placeholder {
        color: #9E9E9E;
    }

    &:focus {
        outline: none;
        border-color: none;
    }
`;

const FilePreviewContainer = styled.div`
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    padding: 0px 10px 3px 10px;
    gap: 10px;
`;

const FilePreview = styled.div`
    padding: 8px 12px;
    background-color: #F5F5F5;
    border-radius: 6px;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
`;

const FilePreviewContent = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const DeleteButton = styled.button`
    background: none;
    border: none;
    color: #666;
    font-size: 18px;
    cursor: pointer;
    padding: 0 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
        color: #FF4747;
    }
`;

const EditorContainer = styled.div`
    border: 2px solid #CDCDCD;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 10px;
    height: 18vh;
    margin: 10px;
`;

const UploadContainer = styled.div`
    margin-top: 10px;
    height: 18vh;
    margin: 10px;
    background-color: #F6F7F9;
`

const EditorToolbar = styled.div`
    display: flex;
    gap: 8px;
    padding: 8px 16px;
    border-bottom: 2px solid #CDCDCD;
`;

const ToolButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 84px;
    height: 22px;
    border: none;
    background: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #E0E0E0;
    }

    .material-icons {
        font-size: 20px;
        color: #616161;
    }
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