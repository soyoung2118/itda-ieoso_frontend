import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '../../ui/TopBar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import api from "../../api/api";
import PlayingCurriculumSidebar from '../../ui/class/PlayingCurriculumSidebar';
import { UsersContext } from '../../contexts/usersContext';
import VideoPlaying from '../../ui/class/VideoPlaying'

export default function ClassPlaying() {
    const navigate = useNavigate();
    const { courseId, lectureId, videoId } = useParams();
    const { user } = useContext(UsersContext);

    const [curriculumData, setCurriculumData] = useState([]);
    const [currentLectureInfo, setCurrentLectureInfo] = useState([]);
    const [currentVideoInfo, setCurrentVideoInfo] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!videoId || !lectureId || !user) return;

                const curriculumResponse = await api.get(`/lectures/curriculum/${courseId}/${user.userId}`);
                if (curriculumResponse.data.success) {
                    setCurriculumData(curriculumResponse.data.data);
                    console.log("커리큘럼 데이터", curriculumData);
                }
            } catch (error) {
                console.error("데이터 로딩 오류:", error);
            }
        };
    
        fetchData();
    }, [videoId, lectureId, user])

    useEffect(() => {
        if (!curriculumData || curriculumData.length === 0) return;

        const foundLecture = curriculumData.find(lecture => lecture.lectureId === Number(lectureId));
        if (foundLecture) {
            setCurrentLectureInfo(foundLecture);
        }
        const foundVideo = foundLecture.videos.find(video => video.videoId === Number(videoId));
        if (foundVideo) {
            setCurrentVideoInfo(foundVideo);
        }
    }, [curriculumData, lectureId]);

    const handleNavigationCurriculum = () => {
        navigate(`/class/${courseId}/curriculum`);
    };

    return (
        <>
            <TopBar />
            <Container>
                <LeftSide>
                    <TitleContainer>
                        <MainTitle>
                            <span>{currentLectureInfo.lectureTitle || "강의를 선택해주세요"}</span>
                        </MainTitle>
                        
                        <ClickContainer onClick={handleNavigationCurriculum}>
                            <SubTitle>
                                {currentLectureInfo.lectureDescription || "강의를 선택해주세요"}
                            </SubTitle>
                            <ArrowForwardIosIcon style={{ width: '13px', marginLeft: '15px' }}/>
                        </ClickContainer>
                    </TitleContainer>
                    <VideoPlaying videoUrl={currentVideoInfo.videoUrl} />
                </LeftSide>

                <RightSide>
                    <PlayingCurriculumSidebar curriculumData={curriculumData} />
                </RightSide>
            </Container>
        </>
    );
}

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

const RightSide = styled.div`
    width: 30vw;
    padding: 0px 15px;
    padding-top: 36px;
    padding-bottom: 24px;
    background-color: #FFFFFF;
`;

const TitleContainer = styled.div`
    display: flex;
    margin-top: 36px;
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
`

const SubTitle = styled.div`
    font-size: 16px;
    font-weight: 400;
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