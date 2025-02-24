import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { UsersContext } from "../../contexts/usersContext";
import TopBar from "../../ui/TopBar";
import WeeklyCalendar from "./WeekCalendar";
import Sidebar from "./Sidebar";
import TaskList from "./TaskList";
import { getDashboard } from '../../api/dashboardApi';

export default function DashBoard() {
  const { user } = useContext(UsersContext);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const weekDates = getWeekDates(new Date(currentWeek));
      const allLectures = {};

      try {
        for (const date of weekDates) {
          const formattedDate = date.toISOString().split('T')[0];
          const data = await getDashboard(user.userId, formattedDate);
          if (data.success) {
            allLectures[formattedDate] = data.data;
          }
        }
        setLectures(allLectures);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };

    fetchData();
  }, [user, currentWeek]);

  // user 객체가 null인지 확인
  if (!user) {
    return <div>사용자 정보가 없습니다.</div>;
  }

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

  const selectedDateLectures = lectures[selectedDate.toISOString().split('T')[0]] || [];

  return (
    <>
    <TopBar />
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
        <WeeklyCalendar currentWeek={currentWeek} setSelectedDate={setSelectedDate} lectures={lectures} />
        <ToDoContainer>
          <Sidebar userId={user.userId} selectedDate={selectedDate} lectures={selectedDateLectures} />
          <TaskList userId={user.userId} selectedDate={selectedDate} lectures={selectedDateLectures} />
        </ToDoContainer>
    </Container>
    </>
  );
}

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

const ToDoContainer = styled.div`
  display: flex;
  margin-top: 30px;
`;

function TaskHeader({ selectedDate }) {
  return (
    <HeaderContainer>
      <HeaderTitle>오늘의 할 일</HeaderTitle>
      <TaskDate>{selectedDate}</TaskDate>
    </HeaderContainer>
  );
}

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

const TaskDate = styled.div`  font-size: 14px;
  color: #ff4747;
  margin: 3px 10px 0 10px;
`;

TaskHeader.propTypes = {
  selectedDate: PropTypes.string.isRequired,
};

function getLectureIcon(submissionStatus) {
  return submissionStatus === 'SUBMITTED' ? (
    <span className="activeicon"></span>
  ) : (
    <span className="unactiveicon"></span>
  );
}

export { getLectureIcon };

