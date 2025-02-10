import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TopBar from "../ui/TopBar";
import LogoGray from "../img/logo/itda_logo_gray.svg";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EventIcon from '@mui/icons-material/Event';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PersonIcon from '@mui/icons-material/Person';
import api from "../api/api";
import { UsersContext } from "../contexts/usersContext";

export default function Class() {
    const navigate = useNavigate();
    const [selectedMenu, setSelectedMenu] = useState("전체 강의실");
    const [showPopup, setShowPopup] = useState(false);
    const { user } = useContext(UsersContext);
    const [lectures, setLectures] = useState([]);

    const handleLectureClick = (id) => {
        navigate(`/class/${id}`);
    };

    const getAllLectures = async () => {
        try{
            const response = await api.get(`/courses/${user.userId}/my-courses`);
            setLectures(response.data.data); //data 안의 data
        } catch (error) {
            console.error('강의실 조회 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        if (user && user.userId) {
            getAllLectures();
        }
    }, [user]);  // user가 업데이트될 때마다 호출

    const lecturesToDisplay = selectedMenu === "전체 강의실" ? lectures : lectures.filter(lecture => lecture.user.userId === user.userId);
    const lecturesCount = lecturesToDisplay.length;

    return (
      <>
        <TopBar />
            <Container>
                <Sidebar>
                    <MenuItem active={selectedMenu === "전체 강의실"} onClick={() => setSelectedMenu("전체 강의실")}>
                        전체 강의실
                    </MenuItem>
                    <MenuItem active={selectedMenu === "내 강의실"} onClick={() => setSelectedMenu("내 강의실")}>
                        내 강의실
                    </MenuItem>
                </Sidebar>
                <Content>
                   <h2>{selectedMenu}</h2>
                   {lecturesCount === 0 ? ( // 강의실이 없을 경우
                        <NoLecturesMessage>
                            <img src={LogoGray} alt="LogoGray" width="40" height="40" />
                            <br />
                            현재 생성된 강의실이 없습니다 :
                            <br />
                            + 버튼을 눌러 강의실을 생성해보세요!
                        </NoLecturesMessage>
                   ) : (
                    lecturesToDisplay?.map((lecture) => (
                        <LectureCard key={lecture.courseId} onClick={() => handleLectureClick(lecture.courseId)}>
                            <LectureImage src={lecture.courseThumbnail} alt="Lecture" />
                               <LectureInfo>
                                <LectureTitle>{lecture.courseTitle}</LectureTitle>
                                {/* 강의 시작일 */}
                                <LectureDetail>
                                <IconRow>
                                    <EventIcon />
                                    <span>{lecture.startDate ? `${lecture.startDate} 시작` : '시작일 미정'}</span>
                                </IconRow>

                                {/* 강의 기간 */}
                                <IconRow>
                                    <VideoLibraryIcon />
                                    <span>{lecture.durationWeeks > 0 ? `${lecture.durationWeeks}주 커리큘럼` : '기간 미정'}</span>
                                </IconRow>

                                {/* 강사 이름 */}
                                <IconRow>
                                    <PersonIcon />
                                    <span>{lecture.instructorName}</span>
                                </IconRow>
                                </LectureDetail>
                               </LectureInfo>
                           </LectureCard>
                       ))
                   )}
                </Content>
                <AddButton onClick={() => setShowPopup(!showPopup)} data-showpopup={showPopup}>
                    {showPopup ? '×' : '+'}
                </AddButton>
                {showPopup && (
                    <PopupMenu>
                        {lecturesCount === 0 ? ( // 강의실이 없을 때
                            <PopupItem onClick={() => navigate('/class/create')}>
                                강의실 생성하기!
                            </PopupItem>
                        ) : (
                            <>
                                <PopupItem onClick={() => navigate('/class/create')}>
                                    <OpenInNewIcon style={{ marginRight: '15px' }}/>
                                    강의실 만들기
                                </PopupItem>
                                <PopupItem onClick={() => navigate('/participate')}>
                                    <ExitToAppIcon style={{ marginRight: '15px' }}/>
                                    강의실 들어가기
                                </PopupItem>
                            </>
                        )}
                    </PopupMenu>
                )}
            </Container>
        </>
    );
}

const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    margin-bottom: 100px;
`;

const Sidebar = styled.div`
    width: 15%;
    max-width: 200px;
    height: 70vh;

    margin: 30px 20px;
    background-color: #fff;
    padding: 20px;
    border-radius: 20px;
`;

const MenuItem = styled.div`
    padding: 15px 15px;
    margin-bottom: 10px;
    color: #000;
    font-weight: ${props => props.active ? 'bold' : 'bold'};
    background-color: ${props => props.active ? 'var(--pink-color)' : '#FFFFFF'};  
    border-radius: 10px;
    cursor: pointer;
`;

const Content = styled.div`
    flex: 1;
    padding: 10px;
`;

const LectureCard = styled.div`
    display: flex;
    background-color: #fff;
    margin: 10px 20px 20px 10px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
`;

const LectureImage = styled.img`
    width: 200px;
    height: 200px;
    margin-right: 20px;
`;

const LectureInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const LectureDetail = styled.div`
    flex-direction: column;
    gap: 10px;
`;

const LectureTitle = styled.h3`
    margin: 0;
    font-size: 24px;
`;

const IconRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  color: var(--darkgrey-color);

  .material-symbols-outlined {
    font-size: 1.2rem;
    vertical-align: middle;
  }

  span {
    font-size: 1rem;
    font-weight: 500;
  }
`;

const AddButton = styled.button`
    position: fixed;
    bottom: 45px;
    right: 45px;
    width: 60px;
    height: 60px;
    background-color: ${props => (props['data-showpopup'] ? '#000' : 'var(--main-color)')};
    color: #fff;
    border: none;
    border-radius: 50%;
    font-size: 44px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const PopupMenu = styled.div`
    position: fixed;
    bottom: 105px;
    right: 95px;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    padding: 10px;
`;

const PopupItem = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 50px 10px 20px;
    font-size: 16px;
    cursor: pointer;
    &:hover {
        background-color: #f0f0f0;
        border-radius: 10px;
    }
`;

const NoLecturesMessage = styled.p`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh; /* 원하는 높이로 조정 */
    font-size: 18px;
    color: #BABABA;
`;