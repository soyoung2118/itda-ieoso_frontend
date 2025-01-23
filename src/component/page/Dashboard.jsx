import styled from "styled-components";
import TopBar from "../ui/TopBar";
import { useNavigate } from "react-router-dom";
import userIcon from "../img/mainpage/usericon.png";
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Video from "../img/dashboard/video.png";
import Docs from "../img/dashboard/docs.png";
import Pdf from "../img/dashboard/pdf.png";
import PropTypes from 'prop-types';

export default function DashBoard() {
  const navigate = useNavigate();
  const userName = "홍길동";
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getWeekDates = (date) => {
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const nextWeek = () => {
    setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() + 7)));
  };

  const prevWeek = () => {
    setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() - 7)));
  };

  const weekDates = getWeekDates(new Date(currentWeek));

  return (
    <>
    <Header>
      <TopBar />
      <div className="header-right">
        {/* 대시보드로 가기 버튼 파일 존재x*/}
        <button className="godashboard" onClick={() => navigate('/class')}>강의실 입장하기</button>
        <UserIcon src={userIcon} alt="user icon" />
        <UserName>{userName}님</UserName>
      </div>
    </Header>
    <Container>
        <WeekRange>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{fontSize: '26px', fontWeight: 'bold', color: '#000'}}>이번 주 강의표</div>
            <div style={{ fontSize: '16px', color: '#888', marginLeft: '10px', paddingTop: '5px' }}>{weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}</div>
          </div>
        <WeekButton>
          <button onClick={prevWeek} style={{transform: 'scale(0.8)'}}>
            <ChevronLeft />
          </button>
          <button onClick={nextWeek} style={{transform: 'scale(0.8)'}}>
            <ChevronRight /> 
          </button>
        </WeekButton>
      </WeekRange>
      <WeeklyCalendar currentWeek={currentWeek} setSelectedDate={setSelectedDate} />
        <ToDoContainer>
          <Sidebar />
          <TaskList selectedDate={selectedDate} />
        </ToDoContainer>
    </Container>
    </>
  );
}

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .godashboard{
      background-color: transparent;
      color: #000;
      border: 1px solid #000;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 60px;
    }
`;

const UserIcon = styled.img`
    width: 40px;
    height: 40px;
`;

const UserName = styled.div`
    font-size: 14px;
    margin-right: 30px;
`;

//헤더 밑 
const Container = styled.div`
    padding: 20px 30px;
`;

const WeekRange = styled.div`
  display: flex;
  align-items: center;
  color: #888;
  margin-bottom: 10px;
  justify-content: space-between;
`;

const WeekButton = styled.div`
  display: flex;
  gap: 10px;
  button {
    background: #FF4747;
    border: none;
    border-radius: 100%;
    color: #fff;
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

function WeeklyCalendar({ currentWeek, setSelectedDate }) {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const getWeekDates = (date) => {
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const weekDates = getWeekDates(new Date(currentWeek));
  const days = ['일', '월', '화', '수', '목', '금', '토'];

  // 예시 할 일 데이터
  const tasks = {
    23: [{ completed: true }, { completed: false }], // 1일에 할 일 2개
    24: [{ completed: true }], // 2일에 할 일 1개
    25: [{ completed: false }, { completed: true }, { completed: false }], // 3일에 할 일 3개
    26: [{ completed: false }, { completed: true }], // 4일에 할 일 2개
    27: [{ completed: true }], // 5일에 할 일 1개
    28: [{ completed: true }, { completed: false }], // 6일에 할 일 2개
    29: [{ completed: true }], // 7일에 할 일 1개
    // ... 다른 날짜의 할 일
  };

  return (
    <CalendarContainer>
      {weekDates.map((date, index) => (
        <DateBox
          key={index}
          onClick={() => {
            setSelectedDay(date.getDate());
            setSelectedDate(date);
          }}
          isSelected={selectedDay === date.getDate()}
        >
          <DayLabel>{days[index]}</DayLabel>
          <DateNumber isSelected={selectedDay === date.getDate()}>{date.getDate()}</DateNumber>
          <DateTodo>
            {(tasks[date.getDate()] || []).map((task, i) => (
              <TodoCircle key={i} completed={task.completed} />
            ))}
          </DateTodo>
        </DateBox>
      ))}
    </CalendarContainer>
  );
}

WeeklyCalendar.propTypes = {
  currentWeek: PropTypes.instanceOf(Date).isRequired,
};

const CalendarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
`;

const DateBox = styled.div`
  width: 10vw;
  height: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 5px;
  font-size: 16px; 
  padding: 2% 3%;
  cursor: pointer;
`;

const DateNumber = styled.div`
  color: #000;
  background-color: ${({ isSelected }) => (isSelected ? '#FFD1D1' : 'transparent')};
  border-radius: 50%;
  margin-top: 12px;
  padding: 10px;
`;

const DayLabel = styled.div`
  margin-bottom: 5px;
`;

const DateTodo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 5px;
`;

const TodoCircle = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${({ completed }) => (completed ? '#FF4747' : '#DEDEDE')};
  border-radius: 50%;
  margin: 2px;
`;

const ToDoContainer = styled.div`
  display: flex;
  margin-top: 30px;
`;

//사이드바
function Sidebar() {
  return (
    <SidebarContainer>
      <MenuItem>
        <span className="activeicon"></span>
        다이어리 꾸미기
      </MenuItem> 
      <MenuItem>
        <span className="activeicon"></span>
        다이어리 꾸미기
      </MenuItem>
      <MenuItem>
        <span className="unactiveicon"></span>
        다이어리 꾸미기
      </MenuItem>
    </SidebarContainer>
  );
}

const SidebarContainer = styled.div`
    width: 15%;
    max-width: 200px;
    min-height: 20vh;
    height: 40vh;
    background-color: #fff;
    padding: 20px;
    border-radius: 20px;
`;

const MenuItem = styled.div`
    padding: 5px;
    margin-bottom: 10px;
    color: #000;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;

    .activeicon {
      margin-right: 10px;
      display: inline-block;
      width: 12px;
      height: 12px;
      background:#FF4747;
      border-radius: 50%;
      text-align: center;
      line-height: 12px;
    }

    .unactiveicon {
      margin-right: 10px;
      display: inline-block;
      width: 12px;
      height: 12px;
      background: #D9D9D9;
      border-radius: 50%;
      text-align: center;
      line-height: 12px;
    }
`;

//오늘의 할 일
function TaskList({ selectedDate }) {
  const formattedDate = `${selectedDate.getFullYear()}.${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}.${selectedDate.getDate().toString().padStart(2, '0')} ${['일', '월', '화', '수', '목', '금', '토'][selectedDate.getDay()]}요일`;

  const tasks = [
    {
      title: "다이어리 꾸미기",
      items: [
        { name: "1강 꾸미고 싶은 타입을 골라 봅시다", type: "동영상" },
        { name: "다이어리 재료 조사하기", type: "과제" },
        { name: "1강 강의 자료", type: "강의 자료" }
      ]
    },
    {
      title: "다이어리 꾸미기 심화",
      items: [
        { name: "4강 다이어리 제작 업체 소개", type: "동영상" },
        { name: "스티커 제작", type: "과제" }
      ]
    }
  ];

  return (
    <TaskContainer>
      <TaskHeader date={formattedDate} />
      <TaskListContainer>
      {tasks.map((section, index) => (
        <div key={index}>
          <TaskSection title={section.title} tasks={section.items} />
          {index < tasks.length - 1 && <hr style={{ border: '1px solid #E0E0E0', width: '92%' }} />}
        </div>
      ))}
      </TaskListContainer>
    </TaskContainer>
  );
}

function TaskHeader({ date }) {
  return (
    <HeaderContainer>
      <HeaderTitle>오늘의 할 일</HeaderTitle>
      <TaskDate>{date}</TaskDate>
    </HeaderContainer>
  );
}

function TaskSection({ title, tasks }) {
  const [checkedItems, setCheckedItems] = useState(tasks.map(() => false));

  const toggleCheck = (index) => {
    setCheckedItems(prevState => {
      const newCheckedItems = [...prevState];
      newCheckedItems[index] = !newCheckedItems[index];
      return newCheckedItems;
    });
  };

  const getIcon = (type) => {
    switch (type) {
      case "동영상":
        return <img src={Video} alt="동영상 아이콘" style={{ width: '24px', height: '24px' }} />;
      case "과제":
        return <img src={Docs} alt="과제 아이콘" style={{ width: '20px', height: '28px' }} />;
      case "강의 자료":
        return <img src={Pdf} alt="강의 자료 아이콘" style={{ width: '20px', height: '28px' }} />;
      default:
        return "🔹";
    }
  };

  return (
    <SectionContainer>
      <TaskTitle>{title}</TaskTitle>
      {tasks.map((task, index) => (
        <TaskItem key={index}>
          {getIcon(task.type)} {task.name}
          <button onClick={() => toggleCheck(index)} style={{ 
            marginLeft: 'auto', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            borderRadius: '50%', 
            padding: '5px' 
          }}>
            {CustomCheckboxCircle(checkedItems[index])}
          </button>
        </TaskItem>
      ))}
    </SectionContainer>
  );
}

const TaskContainer = styled.div`
  flex-grow: 1;
  background-color: transparent;
  border-radius: 10px;
  margin-left: 20px;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 5px;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
`;

const HeaderTitle = styled.h2`
  font-size: 20px;
  padding-left: 10px;
`;

const TaskDate = styled.div`
  font-size: 14px;
  color: #ff4747;
  margin: 3px 10px 0 10px;
`;

const TaskListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #ffffff;
  border-radius: 10px;
`;

const SectionContainer = styled.div`
  margin-bottom: 20px;
  padding: 5px 30px;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
`;

const TaskTitle = styled.h3`
  font-size: 18px;
  color: #ff4747;
  margin-bottom: 10px;
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 10px;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  padding: 7px;
  margin-left: 5px;
  gap: 15px;
`;

const CustomCheckboxCircle = (checked) => {
  if (checked) {
    return (
      <span
        className="material-icons"
        style={{ color: "#d4d4d4", fontSize: "24px" }}
      >
        circle
      </span>
    );
  }
  return (
    <span
      className="material-icons"
      style={{ color: "#909090", fontSize: "24px" }}
    >
      check_circle
    </span>
  );
};
