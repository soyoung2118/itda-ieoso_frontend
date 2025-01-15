import {useState} from "react";
import styled from "styled-components";
import TopBar from "../ui/TopBar";

export default function ClassRoom() {
    const [curri, SetCurri] = useState(true);

    const TimelineItems = [
        { time: '03:21', title: '게임적 사례생활이란?' },
        { time: '08:33', title: '사회화 기관의 의미와 종류' },
        { time: '11:13', title: '사회화 기관 사례 포인트' },
        { time: '23:31', title: '현대 사회에서의 사회생활' },
        { time: '30:51', title: '사회현상 역사' },
        { time: '47:38', title: '사회생활의 특징2' },
        { time: '51:25', title: '오늘 학습내용 정리' },
        { time: '01:00:25', title: '오늘 과제 공지' }
    ];

    const MenuChange = () => {
        SetCurri(!curri);
    }

    return (
        <>
        <TopBar />
        
        <Container>
            <LeftSide>
                <div className="relative aspect-video bg-black">
                <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                    src="../img/classroom/thumbnail.png"
                    alt="Teaching video placeholder"
                    className="w-full h-full object-cover"
                    style={{width: "126px", height: "33px"}}
                    />
                </div>
                </div>
                <div className="p-4">
                <h1 className="text-xl font-bold mb-2">고등학교 입학 전 마스터하는 통합사회1</h1>
                <p className="text-gray-600">사회화 기관의 의미와 종류</p>
                </div>
            </LeftSide>

            <RightSide>
                <MenuSelect>
                    <MenuText onClick={MenuChange}>타임라인</MenuText>
                    <MenuText onClick={MenuChange}>커리큘럼</MenuText>
                </MenuSelect>
                <RightContainer>
                    {curri && 
                        <>
                        <CurrentTime>
                            <CurrentTimeText>1. 기초를 준비해요요</CurrentTimeText>
                            <TitleText>1. 꾸미고 싶은 타입을 정해서 다이어리...</TitleText>
                        </CurrentTime>
                        {TimelineItems.map((item, index) => (
                            <CurriculumItemContainer key={index}>
                                <TimeText>{item.time}</TimeText>
                                <TitleText>{item.title}</TitleText>
                            </CurriculumItemContainer>
                        ))}
                        </>
                    }
                    {!curri && 
                        <>
                        <CurrentTime>
                            <CurrentTimeText>00:00</CurrentTimeText>
                            <TitleText>오늘의 학습목표</TitleText>
                        </CurrentTime>
                        {TimelineItems.map((item, index) => (
                            <CurriculumItemContainer key={index}>
                                <TimeText>{item.time}</TimeText>
                                <TitleText>{item.title}</TitleText>
                            </CurriculumItemContainer>
                        ))}
                        </>
                    }
                </RightContainer>
            </RightSide>
        </Container>
    </>
  );
}

const Container = styled.div`
    display: flex;
    padding-top: 46px;
    background-color: #FFFFFF;
`

const LeftSide = styled.div`
    width: 75vw;
    padding-left: 57px;
`

const RightSide = styled.div`
    width: 25vw;
    padding-right: 57px;
`

const MenuSelect = styled.div`
    width: 90%;
    display: flex;
    flex-direction: row;
    margin: 18px 0px;
    cursor: pointer;
`

const RightContainer = styled.div`
    height: 100%;
`

const CurrentTime = styled.div`
    display: flex;
    padding: 0px 14px;
    background-color: #F7F7F7;
`

const CurriculumItemContainer = styled.div`
    display: flex;
    padding: 0px 14px;
`

const CurrentTimeText = styled.div`
    width: 30%;
    font-size: 18px;
    font-weight: 400;
    padding: 15px 0px;
    color: var(--main-color);
`

const TimeText = styled.div`
    width: 30%;
    font-size: 18px;
    font-weight: 400;
    padding: 15px 0px;
`

const TitleText = styled.div`
    width: 70%;
    font-size: 18px;
    font-weight: 400;
    padding: 15px 0px;
`

const MenuText = styled.div`
    width: 50%;
    font-size: 25px;
    font-weight: 600;
    margin: 0px 5px;
    border-bottom: 2px solid #000000;
`