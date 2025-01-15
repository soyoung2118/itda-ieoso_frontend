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

    const truncate = (str, n) => { //25글자 제한
        return str?.length > n ? str.substr(0, n - 1) + "..." : str;
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
                { title: '1. 꾸미고 싶은 타입을 정해서 다이어리를 꾸며봅시다', time: '21:30', status: 'completed' },
                { title: '2. 필기구 소개', time: '21:30', status: 'playing' },
                { title: '3. 나만의 색연필 차트', time: '21:30', status: 'pending' }
            ]
        },
        { 
            id: 2, 
            title: '2. 한 달을 기록해요', 
            subItems: [
                { title: '1. 효과적인 기록 법', time: '21:30', status: 'pending' }
            ]
        },
        { 
            id: 3, 
            title: '3. 한 주를 기록해요', 
            subItems: []
        },
        { 
            id: 4,
            title: '4. 하루를 꾸며요',
            subItems: []
        },
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <span className="material-icons" style={{ color: '#474747', fontSize: '22px' }}>check_circle</span>;
            case 'playing':
                return (
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <span className="material-icons" style={{ color: '#C3C3C3', fontSize: '22px' }}>check_circle</span>
                        <span className="material-icons" style={{ color: '#474747', fontSize: '22px' }}>play_circle</span>
                    </div>
                );
            case 'pending':
                return <span className="material-icons" style={{ color: '#C3C3C3', fontSize: '22px' }}>check_circle</span>;
            default:
                return null;
        }
    };

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
                                            <SubItem key={subIndex} status={subItem.status}>
                                                <SubItemLeft>
                                                    <SubItemTitle><span>{truncate(subItem.title, 25)}</span></SubItemTitle>
                                                    <SubItemTime>
                                                        <span className="material-icons" style={{ color: '#909090', fontSize: '13.33px',  marginRight: '3px' }}>play_circle_outline</span>
                                                        {subItem.time}
                                                    </SubItemTime>
                                                </SubItemLeft>
                                                {getStatusIcon(subItem.status)}
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

const MainTitle = styled.div`
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 28px;
`;

const SubTitle = styled.div`
    font-size: 16px;
    font-weight: 400;
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
    font-size: 15px;
    margin-bottom: 4px;
`;

const SubItemTime = styled.div`
    font-size: 12px;
    color: #999;
    display: flex;
    align-items: center;
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