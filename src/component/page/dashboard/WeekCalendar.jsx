import React,{ useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function WeeklyCalendar({ currentWeek, setSelectedDate, lectures }) {
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

  // 각 날짜에 해당하는 할 일 데이터
  const tasks = weekDates.reduce((acc, date) => {
    const formattedDate = date.toISOString().split('T')[0];
    const dayTasks = (lectures[formattedDate] || []).filter(lecture => {
      const hasContent = (Array.isArray(lecture.assignmentDtos) && lecture.assignmentDtos.length > 0) ||
                         (Array.isArray(lecture.materialDtos) && lecture.materialDtos.length > 0) ||
                         (Array.isArray(lecture.videoDtos) && lecture.videoDtos.length > 0);
      return hasContent;
    }).map(lecture => {
      const allTasksSubmitted = 
        (lecture.assignmentDtos || []).every(task => task.submissionStatus === 'SUBMITTED') &&
        (lecture.materialDtos || []).every(task => task.submissionStatus === true) &&
        (lecture.videoDtos || []).every(() => true);
      return {
        completed: allTasksSubmitted,
      };
    });
    acc[date.getDate()] = dayTasks;
    return acc;
  }, {});

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
              <React.Fragment key={i}>
                <TodoCircle completed={task.completed} />
              </React.Fragment>
            ))}
          </DateTodo>
        </DateBox>
      ))}
    </CalendarContainer>
  );
}

WeeklyCalendar.propTypes = {
  currentWeek: PropTypes.instanceOf(Date).isRequired,
  setSelectedDate: PropTypes.func.isRequired,
  lectures: PropTypes.array.isRequired,
};

const CalendarContainer = styled.div`
  display: flex;
  align-items: stretch;
  gap: 5px;
  background-color: #fff;
  border-radius: 10px;
  width: 100%;
  box-sizing: border-box;
  padding: 2vh 0;
  height: 17vh;
  overflow: hidden;
`;

const DateBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-size: 16px;
  gap: 10px;
  cursor: pointer;
`;

const DayLabel = styled.div`
  font-size: 14px;
`;

const DateNumber = styled.div`
  color: #000;
  background-color: ${({ isSelected }) => (isSelected ? '#FFD1D1' : 'transparent')};
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DateTodo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  height: 10px;
`;

const TodoCircle = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${({ completed }) => (completed ? '#FF4747' : '#DEDEDE')};
  border-radius: 50%;
`;

export default WeeklyCalendar;
