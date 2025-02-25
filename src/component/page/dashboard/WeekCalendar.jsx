import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function WeeklyCalendar({ currentWeek, setSelectedDate, lectures }) {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [tasks, setTasks] = useState({});

  const getWeekDates = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const weekDates = getWeekDates(new Date(currentWeek));
  const days = ['일', '월', '화', '수', '목', '금', '토'];

  useEffect(() => {
    const newTasks = weekDates.reduce((acc, date) => {
      const formattedDate = date.toLocaleDateString('en-CA');
      const dayLectures = lectures[formattedDate] || [];
      
      const dayTasks = dayLectures.filter(lecture => {
        const hasContent = (Array.isArray(lecture.assignmentDtos) && lecture.assignmentDtos.some(assignment => {
          const assignmentEndDate = new Date(assignment.endDate).toLocaleDateString('en-CA');
          return assignmentEndDate === formattedDate;
        })) ||
        (Array.isArray(lecture.materialDtos) && lecture.materialDtos.some(material => {
          const materialStartDate = new Date(material.startDate).toLocaleDateString('en-CA');
          return materialStartDate === formattedDate;
        })) ||
        (Array.isArray(lecture.videoDtos) && lecture.videoDtos.some(video => {
          const videoStartDate = new Date(video.startDate).toLocaleDateString('en-CA');
          return videoStartDate === formattedDate;
        }));
        return hasContent;
      }).map(lecture => {
        const allTasksCompleted = 
          (lecture.assignmentDtos || []).every(task => task.submissionStatus === 'SUBMITTED') &&
          (lecture.materialDtos || []).every(task => task.materialHistoryStatus === true) &&
          (lecture.videoDtos || []).every(() => true); // video는 기본적으로 true로 간주
        return {
          completed: allTasksCompleted,
        };
      });

      acc[date.getDate()] = dayTasks;
      return acc;
    }, {});

    setTasks(newTasks);
  }, [lectures, currentWeek, selectedDay]);

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
  lectures: PropTypes.object.isRequired,
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
