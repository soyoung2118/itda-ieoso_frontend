import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getDashboard } from '../../api/dashboardApi';
import Video from '../../img/icon/videored.svg';
import Docs from '../../img/icon/docs.svg';
import Pdf from '../../img/icon/pdf.svg';

function TaskList({ userId, selectedDate }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const data = await getDashboard(userId, formattedDate);
        if (data.success) {
          const filteredTasks = data.data.filter(task => {
            const hasContent = (Array.isArray(task.assignmentDtos) && task.assignmentDtos.length > 0) ||
                               (Array.isArray(task.materialDtos) && task.materialDtos.length > 0) ||
                               (Array.isArray(task.videoDtos) && task.videoDtos.length > 0);
            return hasContent;
          });
          setTasks(filteredTasks);
        }
      } catch (error) {
        console.error("TaskList API 호출 에러:", error);
      }
    };

    fetchTasks();
  }, [userId, selectedDate]);

  const getTasksByType = (lecture) => {
    const tasks = [];
    if (lecture.videoDtos) {
      //videoHistoryStatus가 구현된 후 적용 해야하는 코드
      //tasks.push(...lecture.videoDtos.map(video => ({ ...video, type: 'video', title: video.videoTitle, submissionStatus: video.videoHistoryStatus === 'WATCHED' })));
      tasks.push(...lecture.videoDtos.map(video => ({ ...video, type: 'video', title: video.videoTitle, submissionStatus: true })));
    }
    if (lecture.materialDtos) {
      tasks.push(...lecture.materialDtos.map(material => ({ ...material, type: 'material', title: material.materialTitle, submissionStatus: material.materialHistoryStatus })));
    }
    if (lecture.assignmentDtos) {
      tasks.push(...lecture.assignmentDtos.map(assignment => ({ ...assignment, type: 'assignment', title: assignment.assignmentTitle, submissionStatus: assignment.submissionStatus === 'SUBMITTED' })));
    }
    return tasks;
  };

  return (
    <TaskContainer>
      <TaskHeader date={selectedDate.toLocaleDateString()} />
      <TaskListContainer>
        {tasks.map((lecture, index) => {
          const lectureTasks = getTasksByType(lecture);
          if (lectureTasks.length > 0) {
            return (
              <div key={lecture.id || index}>
                <TaskSection title={lecture.courseTitle || '제목 없음'} tasks={lectureTasks} />
                {index < tasks.length - 1 && <hr style={{ border: '1px solid #E0E0E0', width: '92%' }} />}
              </div>
            );
          }
          return null;
        })}
      </TaskListContainer>
    </TaskContainer>
  );
}

TaskList.propTypes = {
  userId: PropTypes.string.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
};

function TaskHeader({ date }) {
  return (
    <HeaderContainer>
      <HeaderTitle>오늘의 할 일</HeaderTitle>
      <TaskDate>{date}</TaskDate>
    </HeaderContainer>
  );
}

TaskHeader.propTypes = {
  date: PropTypes.string.isRequired,
};

function TaskSection({ title, tasks }) {
  const getIcon = (type) => {
    switch (type) {
      case 'video':
        return <img src={Video} alt='동영상 아이콘' style={{ width: '24px', height: '24px' }} />;
      case 'assignment':
        return <img src={Docs} alt='과제 아이콘' style={{ width: '20px', height: '28px' }} />;
      case 'material':
        return <img src={Pdf} alt='강의 자료 아이콘' style={{ width: '20px', height: '28px' }} />;
      default:
        return '';
    }
  };

  return (
    <SectionContainer>
      <TaskTitle>{title}</TaskTitle>
      {tasks.map((task) => (
        <TaskItem key={task.title}>
          {getIcon(task.type)} {task.title}
          <button style={{ 
            marginLeft: 'auto', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            borderRadius: '50%', 
            padding: '5px' 
          }}>
            {CustomCheckboxCircle(task.submissionStatus)}
          </button>
        </TaskItem>
      ))}
    </SectionContainer>
  );
}

TaskSection.propTypes = {
  title: PropTypes.string.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  })).isRequired,
};

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
        style={{ color: "#909090", fontSize: "24px" }}
      >
        check_circle
      </span>
    );
  }
  return (
    <span
      className="material-icons"
      style={{ color: "#d4d4d4", fontSize: "24px" }}
    >
      circle
    </span>
  );
};

export default TaskList;
