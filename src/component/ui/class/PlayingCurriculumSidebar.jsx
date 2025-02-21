import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Assignment from "../../img/icon/docs.svg";
import Material from "../../img/icon/pdf.svg";
import api from "../../api/api";
import { UsersContext } from '../../contexts/usersContext';

const PlayingCurriculumSidebar = ({ 
    curriculumData, 
    setCurriculumData, 
    currentLectureInfo, 
    setCurrentLectureInfo 
}) => {
    const navigate = useNavigate();
    const { courseId, lectureId, videoId, assignmentId } = useParams();
    const { user } = useContext(UsersContext);
    const [expandedItems, setExpandedItems] = useState(new Set([1]));
    const [list, setList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!courseId || !user) return;

                const curriculumResponse = await api.get(`/lectures/curriculum/${courseId}/${user.userId}`);
                if (curriculumResponse.data.success) {
                    setCurriculumData(curriculumResponse.data.data);
                    //console.log(curriculumData);
                    const sortList = [];
                    for(let data in curriculumData){
                        sortList.push(data.assignment);
                    }
                    setList(sortList);
                    console.log(list);
                }
            } catch (error) {
                console.error("데이터 로딩 오류:", error);
            }
        };
        
        fetchData();
    }, [courseId, user, setCurriculumData]);

    useEffect(() => {
        if (!curriculumData?.length || !lectureId) return;
        
        const foundLecture = curriculumData.find(
            lecture => lecture.lectureId === Number(lectureId)
        );
        
        if (foundLecture) {
            setCurrentLectureInfo(foundLecture);
            
            if (videoId || assignmentId) {
                setExpandedItems(prev => new Set([...prev, foundLecture.lectureId]));
            }
        }
    }, [curriculumData, lectureId, videoId, assignmentId, setCurrentLectureInfo]);

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

    const handleVideoClick = (lectureId, videoId) => {
        navigate(`/class/${courseId}/${lectureId}/${videoId}`);
    };

    const handleAssignmentClick = (lectureId, assignmentId) => {
        navigate(`/assignment/submit/${courseId}/${lectureId}/${assignmentId}`);
    };

    return (
        <>
            <MenuTitle>커리큘럼</MenuTitle>
            
            <RightContainer>
                <CurriculumList>
                    {curriculumData.map((lecture) => (
                        <div key={lecture.lectureId}>
                            <CurriculumItem>
                                <ItemTitle>{lecture.lectureDescription}</ItemTitle>
                                {/* {lecture.videos.length > 0 && (
                                    <IconWrapper onClick={() => toggleItem(lecture.lectureId)}>
                                        <span className="material-icons">
                                            {expandedItems.has(lecture.lectureId) ? 'expand_more' : 'chevron_right'}
                                        </span>
                                    </IconWrapper>
                                )} */}
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
            </RightContainer>
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

export default PlayingCurriculumSidebar;