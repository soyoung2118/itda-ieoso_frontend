import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '../../ui/TopBar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Assignment from "../../img/icon/docs.svg";
import Material from "../../img/icon/pdf.svg";

export default function PlayingCurriculumSidebar() {
    const navigate = useNavigate();
    const [selectedMenu, setSelectedMenu] = useState('curriculum');
    const [expandedItems, setExpandedItems] = useState(new Set([1]));

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

    const handleNavigationCurriculum = (lectureId) => {
        navigate(`/class/${lectureId}`);
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

    return (
        <>
        <Container>
            <MenuTitle>커리큘럼</MenuTitle>
            
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
        </Container>
        </>
    );
}

const Container = styled.div`
    height: 92vh;
    display: flex;
    overflow: hidden;
    background-color: #FFFFFF;
    flex-direction: column;
`;

const MenuTitle = styled.div`
    display: flex;
    width: 90%;
    margin: 0 auto;
    margin-bottom: 20px;
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