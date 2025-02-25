import { useState, useEffect, useContext } from 'react';
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import TopBar from "../../ui/TopBar";
import WeeklyCalendar from "./WeekCalendar";
import Sidebar from "./Sidebar";
import TaskList from "./TaskList";
import { UsersContext } from "../../contexts/usersContext";
import { getDashboard } from '../../api/dashboardApi';

export default function DashBoard() {
  const { user } = useContext(UsersContext);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lectures, setLectures] = useState({});
  const [filteredLectures, setFilteredLectures] = useState([]);

  const getCurrentWeekDates = (date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay(); 
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek); 

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day.toISOString().split("T")[0];
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const allLectures = { ...lectures };

      try {
        const weekDates = getCurrentWeekDates(currentWeek);
        console.log("Week Dates:", weekDates); 

        const fetchWeekData = async (dates) => {
          await Promise.all(dates.map(async (date) => {
            const formattedDate = date;
            if (!allLectures[formattedDate]) {
              const data = await getDashboard(user.userId, formattedDate);
              if (data.success) {
                allLectures[formattedDate] = data.data;
              }
            }
          }));
        };

        await fetchWeekData(weekDates);
        console.log("All Lectures:", allLectures);
        setLectures(allLectures);

        const formattedDate = selectedDate.toLocaleDateString('en-CA');

        const filtered = weekDates.map(date => {
          const dateStr = date;
          return (allLectures[dateStr] || []).filter(lecture => {
            const hasContent = (Array.isArray(lecture.assignmentDtos) && lecture.assignmentDtos.some(assignment => {
              const assignmentEndDate = new Date(assignment.endDate).toISOString().split('T')[0];
              return assignmentEndDate === formattedDate;
            })) ||
            (Array.isArray(lecture.materialDtos) && lecture.materialDtos.some(material => {
              const materialStartDate = new Date(material.startDate).toISOString().split('T')[0];
              return formattedDate >= materialStartDate;
            })) ||
            (Array.isArray(lecture.videoDtos) && lecture.videoDtos.some(video => {
              const videoStartDate = new Date(video.startDate).toISOString().split('T')[0];
              return formattedDate >= videoStartDate;
            }));
            return hasContent;
          });
        }).flat();

        console.log("Filtered Lectures:", filtered); // 필터링된 강의 데이터 확인
        setFilteredLectures(filtered);

      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };

    fetchData();
  }, [user, currentWeek, selectedDate]);

  if (!user) {
    return <div>사용자 정보가 없습니다.</div>;
  }

  // 주간 날짜 배열 가져오기 (일요일을 기준으로)
  const getWeekDates = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // 일요일
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const nextWeek = () => {
    const next = new Date(currentWeek);
    next.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(next);
  };

  const prevWeek = () => {
    const prev = new Date(currentWeek);
    prev.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(prev);
  };

  const weekDates = getWeekDates(new Date(currentWeek));

  return (
    <>
      <TopBar />
      <Container>
        <WeekRange>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#000' }}>이번 주 강의표</div>
            <div style={{ fontSize: '16px', color: '#888', marginLeft: '10px', paddingTop: '5px' }}>{weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}</div>
          </div>
          <WeekButton>
            <button onClick={prevWeek} style={{ transform: 'scale(0.8)' }}>
              <ChevronLeft style={{ fontSize: '30px' }} />
            </button>
            <button onClick={nextWeek} style={{ transform: 'scale(0.8)' }}>
              <ChevronRight style={{ fontSize: '30px' }} />
            </button>
          </WeekButton>
        </WeekRange>
        <WeeklyCalendar currentWeek={currentWeek} setSelectedDate={setSelectedDate} lectures={lectures} />
        <ToDoContainer>
          <Sidebar userId={String(user.userId)} selectedDate={selectedDate} lectures={filteredLectures} />
          <TaskList userId={String(user.userId)} selectedDate={selectedDate} lectures={filteredLectures} />
        </ToDoContainer>
      </Container>
    </>
  );
}

// 헤더 밑 
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
    background: #C3C3C3;
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

function getLectureIcon(submissionStatus) {
  return submissionStatus === 'SUBMITTED' ? (
    <span className="activeicon"></span>
  ) : (
    <span className="unactiveicon"></span>
  );
}

export { getLectureIcon };
