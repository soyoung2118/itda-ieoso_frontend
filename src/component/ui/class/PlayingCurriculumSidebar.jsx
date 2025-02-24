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
}) => {
    const navigate = useNavigate();
    const { courseId, lectureId, videoId, assignmentId } = useParams();
    const { user } = useContext(UsersContext);
    const [submissionStatusList, setSubmissionStatusList] = useState([]);
    const [assignmentIdList, setAssignmentIdList] = useState([]);
    const [selectedContentId, setSelectedContentId] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!courseId || !user) return;

                const curriculumResponse = await api.get(`/lectures/curriculum/${courseId}/${user.userId}`);
                if (curriculumResponse.data.success) {
                    setCurriculumData(curriculumResponse.data.data);
                }

                const historyResponse = await api.get(`/lectures/history/${courseId}/${user.userId}`);
                
                if (historyResponse.data.success) {
                    const submissions = Array.isArray(historyResponse.data.data.submissions)
                        ? historyResponse.data.data.submissions
                        : [];
                
                    setAssignmentIdList(prev => [
                        ...prev, 
                        ...submissions.map(sub => sub.assignmentId)
                    ]);
                
                    setSubmissionStatusList(prev => [
                        ...prev, 
                        ...submissions.map(sub => sub.submissionStatus)
                    ]);
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
        }
    }, [curriculumData, lectureId, videoId, assignmentId, setCurrentLectureInfo]);

    const truncate = (str, n) => {
        return str?.length > n ? str.substr(0, n - 1) + "..." : str;
    };

    const getStatusIcon = (type, id) => {
        if (type === 'assignment') {
            const index = assignmentIdList.findIndex((listid) => listid === id);
            if (index === -1) return null;
    
            const status = submissionStatusList[index];
            switch (status) {
                case 'NOT_SUBMITTED':
                    return <span key={id} className="material-icons" style={{ color: '#C3C3C3', fontSize: '20px' }}>check_circle</span>;
                case 'LATE':
                case 'SUBMITTED':
                    return <span key={id} className="material-icons" style={{ color: '#474747', fontSize: '20px' }}>check_circle</span>;
                default:
                    return null;
            }
        }
        return null;
    }

    const handleVideoClick = (goLecture, goVideo) => {
        setSelectedContentId(goVideo);
        setSelectedType("video");
      navigate(`/playing/${courseId}/${goLecture}/${goVideo}`);
    };

    const handleMaterialClick = async (material) => {
        setSelectedContentId(material.materialId);
        setSelectedType("material");
      const materialUrl = material.materialFile;
  
      try {
          const response = await api.get("/files/download", {
              params: { 
                  fileUrl: materialUrl
              },
          });

          const presignedUrl = response.data;
          const fileResponse = await fetch(presignedUrl);

          const arrayBuffer = await fileResponse.arrayBuffer();

          const fileExtension = material.originalFilename.split('.').pop().toLowerCase();
          let mimeType = 'application/octet-stream';

          if (fileExtension === 'pdf') {
              mimeType = 'application/pdf';
          } else if (fileExtension === 'txt') {
              mimeType = 'text/plain';
          } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
              mimeType = `image/${fileExtension}`;
          } else if (fileExtension === 'zip') {
              mimeType = 'application/zip';
          }

          const blob = new Blob([arrayBuffer], { type: mimeType });
  
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
  
          a.download = material.originalFilename; 
          a.click();
  
          window.URL.revokeObjectURL(url);
  
      } catch (error) {
          console.error("파일 처리 중 오류:", error);
      }
  };

    const handleAssignmentClick = (goLecture, goAssignment) => {
        setSelectedContentId(goAssignment);
        setSelectedType("assignment");
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
                {curriculumData.map((lecture, index) => {
                      const sortedContents = [...lecture.videos, ...lecture.materials, ...lecture.assignments]
                          .sort((a, b) => a.contentOrderIndex - b.contentOrderIndex);

                      return (
                          <div key={lecture.lectureId}>
                              <CurriculumItem>
                                  <ItemTitle>{index + 1}. {lecture.lectureDescription}</ItemTitle>
                              </CurriculumItem>
                                {lecture.lectureId && sortedContents.map((content) => {
                                    const isSelected =
                                        (selectedType === "video" && Number(content.videoId) === Number(selectedContentId)) ||
                                        (selectedType === "material" && Number(content.materialId) === Number(selectedContentId)) ||
                                        (selectedType === "assignment" && Number(content.assignmentId) === Number(selectedContentId));

                                    return (
                                        <SubItem 
                                            $now={isSelected} 
                                            key={content.contentOrderId} 
                                            status={content.contentType === 'video' ? content.videoHistoryStatus : null}>
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
                                              <BlackText>{truncate(content.videoTitle, 25)}</BlackText>
                                            </ContentItem> 
                                          }
                                          {content.contentType === 'material' &&
                                            <ContentItem onClick={() => handleMaterialClick(content)}>
                                              <img
                                                  className="material-icons"
                                                  src={Material}
                                                  alt="material icon"
                                                  style={{
                                                  width: "16px",
                                                  marginRight: "4px",
                                                  }}
                                              />
                                              <BlackText>{content.originalFilename}</BlackText>
                                              <RedText>{content.fileSize}</RedText>
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
                                              <BlackText>{content.assignmentTitle}</BlackText>
                                              <RedText>{dateText(content.startDate)} - {dateText(content.endDate)}</RedText>
                                              </TextContainer>
                                              <IconContainer>{getStatusIcon(content.contentType, content.assignmentId)}</IconContainer>
                                            </ContentItem>
                                          }
                                      </SubItemTitle>
                                  </SubItem>
                                );
                            })}
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
    background-color: ${props => props.now ? '#F8F8F8' : 'transparent'};
`;

const ContentItem = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 0;
    cursor: pointer;
`;

const SubItemTitle = styled.div`
    font-size: 15px;
    margin-bottom: 4px;
    font-weight: ${props => props.status === 'WATCHING' ? 800 : 400}
`;
const TextContainer = styled.div`
`

const IconContainer = styled.div`
    margin-left: auto;
`

const BlackText = styled.div`
  font-size: 13px;
  color: #474747;
`

const RedText = styled.div`
  font-size: 11px;
  color: #FF4747;
  white-space: no-wrap;
  text-overflow: ellipsis;
`
export default PlayingCurriculumSidebar;