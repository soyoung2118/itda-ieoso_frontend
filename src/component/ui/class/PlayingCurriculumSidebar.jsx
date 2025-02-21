import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";
import styled from 'styled-components';
import Assignment from "../../img/icon/docs.svg";
import Material from "../../img/icon/pdf.svg";
import Video from "../../img/icon/videored.svg";
import api from "../../api/api";
import { UsersContext } from '../../contexts/usersContext';

const PlayingCurriculumSidebar = ({ 
    curriculumData,
    setCurriculumData, 
    currentLectureInfo, 
    setCurrentLectureInfo,
    sections = [],
    activeItem,
    setActiveItem,
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
                    const sortList = [];
                    for(let data in curriculumData){
                        sortList.push(data.assignment);
                    }
                    setList(sortList);
                    //console.log(curriculumData);
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
        newSet.has(itemId) ? newSet.delete(itemId) : newSet.add(itemId);
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

    const handleVideoClick = (goLecture, goVideo) => {
        navigate(`/playing/${courseId}/${goLecture}/${goVideo}`);
    };

    const handleAssignmentClick = (goLecture, goAssignment) => {
        navigate(`/assignment/submit/${courseId}/${goLecture}/${goAssignment}`);
    };

    const dateText = (time) => {
      return time.replace("T", " "); 
    }

    return (
        <>
            <MenuTitle>커리큘럼</MenuTitle>
            <RightContainer>
                <CurriculumList>
                {curriculumData.map((lecture) => {
                        const sortedContents = [...lecture.videos, ...lecture.materials, ...lecture.assignments]
                            .sort((a, b) => a.contentOrderIndex - b.contentOrderIndex);

                        return (
                            <div key={lecture.lectureId}>
                                <CurriculumItem>
                                    <ItemTitle>{lecture.lectureId}. {lecture.lectureDescription}</ItemTitle>
                                </CurriculumItem>
                                  {lecture.lectureId && sortedContents.map((content) => (
                                    <SubItem key={content.contentOrderId} status={content.contentType == 'video' ? content.videoHistoryStatus : null}>
                                        <SubItemTitle>
                                            {content.contentType === 'video' &&
                                              <ContentItem onClick={() => handleVideoClick(lecture.lectureId, content.videoId)}>
                                                <img
                                                    className="material-icons"
                                                    src={Video}
                                                    alt="video icon"
                                                    style={{
                                                    width: "16px",
                                                    marginRight: "4px",
                                                    }}
                                                />
                                                {truncate(content.videoTitle, 25)}
                                              </ContentItem> 
                                            }
                                            {content.contentType === 'material' &&
                                              <ContentItem>
                                                <img
                                                    className="material-icons"
                                                    src={Material}
                                                    alt="material icon"
                                                    style={{
                                                    width: "16px",
                                                    marginRight: "4px",
                                                    }}
                                                />
                                                {content.title}
                                                {content.size}
                                              </ContentItem>
                                            }
                                            {content.contentType === 'assignment' &&
                                              <ContentItem onClick={() => handleAssignmentClick(lecture.lectureId, content.assignmentId)}>
                                                <img
                                                    className="material-icons"
                                                    src={Assignment}
                                                    alt="assignment icon"
                                                    style={{
                                                    width: "16px",
                                                    marginRight: "4px",
                                                    }}
                                                />
                                                <TextContainer>
                                                <div>{content.assignmentTitle}</div>
                                                <div style={{ fontSize: '12px', color: '#FF4747', width: '100%', whiteSpace: 'no-wrap', textOverflow: 'ellipsis'}}>
                                                    {dateText(content.startDate)} - {dateText(content.endDate)}
                                                </div>
                                                </TextContainer>
                                              </ContentItem>
                                            }
                                        </SubItemTitle>
                                    </SubItem>
                                ))}
                            </div>
                        );
                    })}
                </CurriculumList>
            </RightContainer>
        </>
    );
}

const MenuTitle = styled.div`
    display: flex;
    width: 90%;
    margin: 0 auto;
    margin-bottom: 10px;
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

const ContentItem = styled.div`
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

const SubItemTitle = styled.div`
    font-size: 15px;
    margin-bottom: 4px;
    font-weight: ${props => props.status === 'WATCHING' ? 800 : 400}
`;
const TextContainer = styled.div`
  
`
export default PlayingCurriculumSidebar;