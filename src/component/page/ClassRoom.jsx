import { useState } from 'react';
import styled from 'styled-components';
import TopBar from '../ui/TopBar';

export default function ClassRoom() {
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

    const TimelineItems = [
        { time: '00:00', title: '오늘의 학습목표' },
        { time: '03:21', title: '게임적 사회생활이란?' },
        { time: '08:33', title: '사회화 기관의 의미와 종류' },
        { time: '11:13', title: '사회화 기관 사례 포인트' },
        { time: '23:31', title: '현대 사회에서의 사회생활' },
        { time: '30:51', title: '사회현상 역사' },
        { time: '47:38', title: '사회생활의 특징2' },
        { time: '51:25', title: '오늘 학습내용 정리' },
        { time: '01:00:25', title: '오늘 과제 공지' }
    ];

    const curriculumItems = [
        { 
            id: 1, 
            title: '1. 기초를 준비해요', 
            subItems: [
                { title: '1. 무리고 싶은 타입을 정해서 다이어리...', time: '2:17', isPlaying: true }
            ]
        },
        { 
            id: 2, 
            title: '2. 꿈키우는 소재', 
            subItems: [
                { title: '2. 활기차 수업자료', time: '4:33', isPlaying: false }
            ]
        },
        { id: 3, title: '3. 나만의 색깔된 커트', subItems: [] },
        { id: 4, title: '4. 하루를 끝마요', subItems: [] }
    ];

    return (
        <>
            <TopBar />
            <Container>
                <LeftSide>
                    <ThumbnailContainer>
                        <img 
                            src="../../component/img/classroom/thumbnail.png"
                            alt="Teaching video placeholder"
                            className="w-full h-full object-cover"
                        />
                    </ThumbnailContainer>
                    <TitleContainer>
                        <MainTitle>고등학교 입학 전 마스터하는 통합사회1</MainTitle>
                        <SubTitle>사회화 기관의 의미와 종류</SubTitle>
                    </TitleContainer>
                </LeftSide>

                <RightSide>
                    <MenuSelect>
                        <MenuButton 
                            isSelected={selectedMenu === 'curriculum'}
                            onClick={() => setSelectedMenu('curriculum')}
                        >
                            커리큘럼
                        </MenuButton>
                        <MenuButton 
                            isSelected={selectedMenu === 'timeline'}
                            onClick={() => setSelectedMenu('timeline')}
                        >
                            타임라인
                        </MenuButton>
                    </MenuSelect>
                    <RightContainer>
                        {selectedMenu === 'curriculum' && (
                            <CurriculumList>
                                {curriculumItems.map((item) => (
                                    <div key={item.id}>
                                        <CurriculumItem>
                                            <ItemTitle>{item.title}</ItemTitle>
                                            {item.subItems.length > 0 && (
                                                <IconWrapper onClick={() => toggleItem(item.id)}>
                                                    <span className="material-icons">
                                                        {expandedItems.has(item.id) ? 'expand_more' : 'chevron_right'}
                                                    </span>
                                                </IconWrapper>
                                            )}
                                        </CurriculumItem>
                                        {expandedItems.has(item.id) && item.subItems.map((subItem, subIndex) => (
                                            <SubItem key={subIndex} isPlaying={subItem.isPlaying}>
                                                <SubItemLeft>
                                                    <SubItemTitle>{subItem.title}</SubItemTitle>
                                                    <SubItemTime>{subItem.time}</SubItemTime>
                                                </SubItemLeft>
                                                <span className="material-icons">
                                                    {subItem.isPlaying ? 'play_circle' : 'play_circle_outline'}
                                                </span>
                                            </SubItem>
                                        ))}
                                    </div>
                                ))}
                            </CurriculumList>
                        )}
                        {selectedMenu === 'timeline' && (
                            <TimelineList>
                                {TimelineItems.map((item, index) => (
                                    <TimelineItem key={index}>
                                        <TimeText>{item.time}</TimeText>
                                        <TitleText>{item.title}</TitleText>
                                    </TimelineItem>
                                ))}
                            </TimelineList>
                        )}
                    </RightContainer>
                </RightSide>
            </Container>
        </>
    );
}

const Container = styled.div`
    height: 92vh;
    display: flex;
    background-color: #FFFFFF;
`;

const LeftSide = styled.div`
    width: 75vw;
    padding-left: 57px;
    padding-top: 46px;
`;

const ThumbnailContainer = styled.div`
    width: 85%;
    aspect-ratio: 16 / 9;
    background-color: black;
    margin-bottom: 20px;
`;

const TitleContainer = styled.div`
    padding: 20px 0;
`;

const MainTitle = styled.h1`
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
`;

const SubTitle = styled.p`
    font-size: 16px;
    color: #666;
`;

const RightSide = styled.div`
    width: 40vw;
    padding-top: 46px;
    padding-right: 57px;
`;

const MenuSelect = styled.div`
    display: flex;
    width: 90%;
    margin: 0 auto;
    margin-bottom: 20px;
`;

const MenuButton = styled.button`
    flex: 1;
    padding: 16px;
    font-size: 16px;
    font-weight: ${props => props.isSelected ? '600' : '400'};
    background: none;
    border: none;
    border-bottom: 2px solid ${props => props.isSelected ? '#000' : 'transparent'};
    color: ${props => props.isSelected ? '#000' : '#666'};
    cursor: ${props => props.isSelected ? 'default' : 'pointer'};
`;

const RightContainer = styled.div`
    overflow-y: auto;
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
    font-size: 15px;
    font-weight: 700;
    color: #333;
`;

const SubItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    background-color: ${props => props.isPlaying ? '#F8F8F8' : 'transparent'};
`;

const SubItemLeft = styled.div`
    flex: 1;
`;

const SubItemTitle = styled.div`
    font-size: 14px;
    color: #666;
    margin-bottom: 4px;
`;

const SubItemTime = styled.div`
    font-size: 12px;
    color: #999;
`;

const TimelineList = styled.div`
    padding: 0 20px;
`;

const TimelineItem = styled.div`
    display: flex;
    padding: 15px 14px;
    ${props => props.isFirst && `
        background-color: #F7F7F7;
    `}
`;

const TimeText = styled.div`
    width: 30%;
    font-size: 15px;
    font-weight: 500;
    color: #333;
`;

const TitleText = styled.div`
    width: 70%;
    font-size: 15px;
    font-weight: 500;
    color: #333;
`;