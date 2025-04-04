import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlayingCurriculumSidebar from "../../ui/class/PlayingCurriculumSidebar";
import api from "../../api/api";
import { UsersContext } from "../../contexts/usersContext";
import VideoPlaying from "../../ui/class/VideoPlaying";

const ClassPlaying = () => {
  const navigate = useNavigate();
  const { courseId, lectureId, videoId } = useParams();
  const isMobile = window.screen.width <= 480;
  const [isVisible, setIsVisible] = useState(!isMobile);
  const { user } = useContext(UsersContext);

  const [curriculumData, setCurriculumData] = useState([]);
  const [currentLectureInfo, setCurrentLectureInfo] = useState([]);
  const [currentVideoInfo, setCurrentVideoInfo] = useState([]);

  useEffect(() => {
    const fetchCurriculumAndVideoData = async () => {
      if (!courseId || !user || !lectureId || !videoId) return;

      try {
        const curriculumResponse = await api.get(
          `/lectures/curriculum/${courseId}/${user.userId}`,
        );

        if (curriculumResponse.data.success) {
          const curriculum = curriculumResponse.data.data.curriculumResponses;
          setCurriculumData(curriculum);

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

            {isMobile && (
              <MenuContainer>
                <MenuIcon onClick={setIsVisibleHandler} className="menu-icon" />
              </MenuContainer>
            )}
          </TopContainer>

          <VideoPlaying videoUrl={currentVideoInfo.videoUrl} />
        </LeftSide>

        {(!isMobile || isVisible) && (
          <>
            {isVisible && (
              <RightSide isVisible={isVisible}>
                <PlayingCurriculumSidebar
                  curriculumData={curriculumData}
                  setCurriculumData={setCurriculumData}
                  currentLectureInfo={currentLectureInfo}
                  setCurrentLectureInfo={setCurrentLectureInfo}
                />
              </RightSide>
            )}
          </>
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

  @media (max-width: 480px) {
    display: ${(props) => (props.isVisible ? "block" : "none")};
    position: absolute;
    width: 60vw !important;
    right: 0;
    margin-top: 35px;
    margin-right: 25px;
    background: white;
    z-index: 1000;
    border: 2px solid #e0e0e0;
  }

  @media (max-width: 768px) {
    width: 25vw;
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

export default ClassPlaying;
