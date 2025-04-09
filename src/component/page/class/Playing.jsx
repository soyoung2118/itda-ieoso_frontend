import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlayingCurriculumSidebar from "../../ui/class/PlayingCurriculumSidebar";
import api from "../../api/api";
import { UsersContext } from "../../contexts/usersContext";
import VideoPlaying from "../../ui/class/VideoPlaying";
import CloseIcon from "@mui/icons-material/Close";

const ClassPlaying = () => {
  const navigate = useNavigate();
  const { courseId, lectureId, videoId } = useParams();
  const isMobile = window.screen.width <= 480;
  const [isVisible, setIsVisible] = useState(!isMobile);
  const { user } = useContext(UsersContext);

  const [curriculumData, setCurriculumData] = useState([]);
  const [currentLectureInfo, setCurrentLectureInfo] = useState([]);
  const [currentVideoInfo, setCurrentVideoInfo] = useState([]);

  const toggleSidebar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible((prev) => !prev);
  };

  useEffect(() => {
    const fetchCurriculumAndVideoData = async () => {
      if (!courseId || !user || !lectureId || !videoId) return;

      try {
        const curriculumResponse = await api.get(
          `/lectures/curriculum/${courseId}/${user.userId}`,
        );

        if (curriculumResponse.data.success) {
          const curriculum = curriculumResponse.data.data.curriculumResponses;
          const filteredCurriculum = curriculum
            .map((lecture) => {
              const filteredVideos = lecture.videos.filter(
                (video) => video.videoTitle !== "강의 영상 제목을 입력하세요."
              );
        
              const filteredAssignments = lecture.assignments.filter(
                (assignment) => assignment.assignmentTitle !== "과제 제목을 입력하세요."
              );
        
              return {
                ...lecture,
                videos: filteredVideos,
                assignments: filteredAssignments,
              };
            })
            
            //.filter((lecture) => lecture.videos.length > 0 || lecture.assignments.length > 0);
        
          setCurriculumData(filteredCurriculum);

          const currentLecture = curriculum.find(
            (lecture) => lecture.lectureId === Number(lectureId),
          );

          if (currentLecture) {
            setCurrentLectureInfo(currentLecture);

            const currentVideo = currentLecture.videos.find(
              (video) => video.videoId === Number(videoId),
            );

            if (currentVideo) {
              setCurrentVideoInfo(currentVideo);
            }
          }
        }
      } catch (error) {
        console.error("데이터 로딩 오류:", error);
      }
    };

    fetchCurriculumAndVideoData();
  }, [courseId, lectureId, videoId, user]);

  const handleNavigationCurriculum = () => {
    navigate(`/class/${courseId}/curriculum/${lectureId}`);
  };

  const setIsVisibleHandler = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <Container>
        <LeftSide>
          <TopContainer>
            <TitleContainer>
              <MainTitle>
                {currentLectureInfo?.lectureTitle}{" "}
                {currentVideoInfo.videoTitle || "강의 영상 제목"}
              </MainTitle>

              <ClickContainer onClick={handleNavigationCurriculum}>
                <ArrowForwardIosIcon
                  style={{ width: "13px", marginLeft: "15px" }}
                />
              </ClickContainer>
            </TitleContainer>
          </TopContainer>

          <VideoPlaying videoUrl={currentVideoInfo.videoUrl} />
          {isMobile && (
            <MobileToggleButtonWrapper>
              <MobileToggleButton type="button" onClick={toggleSidebar}>
                {isVisible ? (
                  <CloseIcon style={{ fontSize: "3.7vh" }} />
                ) : (
                  <MenuIcon style={{ fontSize: "3.7vh" }} />
                )}
              </MobileToggleButton>
            </MobileToggleButtonWrapper>
          )}
        </LeftSide>

        {!isMobile ? (
          <RightSide>
            <PlayingCurriculumSidebar
              curriculumData={curriculumData}
              setCurriculumData={setCurriculumData}
              currentLectureInfo={currentLectureInfo}
              setCurrentLectureInfo={setCurrentLectureInfo}
            />
          </RightSide>
        ) : (
          <SidebarSlideWrapper show={isVisible}>
            <RightSide>
              <PlayingCurriculumSidebar
                curriculumData={curriculumData}
                setCurriculumData={setCurriculumData}
                currentLectureInfo={currentLectureInfo}
                setCurrentLectureInfo={setCurrentLectureInfo}
              />
            </RightSide>
          </SidebarSlideWrapper>
        )}
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  margin-top: 30px;
  overflow: hidden;
  background-color: #f6f7f9;
`;

const MenuContainer = styled.div`
  margin-top: 3px;
`;

const TopContainer = styled.div`
  margin-bottom: 26px;
  display: flex;
  justify-content: space-between;
`;

const LeftSide = styled.div`
  width: 70vw;
  flex: 1;
  padding-left: 5px;
  padding-right: 20px;
`;

const RightSide = styled.div`
  width: 20vw;
  height: 70vh;
  overflow-y: auto;
  padding: 25px 20px;
  background-color: #ffffff;
  border-radius: 20px;

  @media (max-width: 768px) {
    width: 25vw;
  }

  @media (max-width: 480px) {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  margin-bottom: 26px;
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

const SubTitle = styled.div`
  font-size: 16px;
  font-weight: 400;
`;
const MobileToggleButtonWrapper = styled.div`
  display: none;

  @media (max-width: 480px) {
    display: block;
    position: fixed;
    bottom: 20px;
    right: 12%;
    z-index: 1500;
  }
`;

const MobileToggleButton = styled.button`
  display: none;

  @media (max-width: 480px) {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    margin-top: 2vh;
    margin-left: auto;
    background: white;
    border: 1px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
    color: var(--main-color);
    padding: 0.5vh;
  }
`;

const SidebarSlideWrapper = styled.div`
  @media (max-width: 480px) {
    position: fixed;
    z-index: 999;
    top: 0;
    right: ${(props) => (props.show ? "0" : "-100%")};
    width: 75%;
    height: 100%;
    background-color: white;
    transition: right 0.3s ease-in-out;
    box-shadow: -2px 0px 10px rgba(0, 0, 0, 0.1);
  }
`;
export default ClassPlaying;
