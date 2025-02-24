import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getDashboard } from '../../api/dashboardApi';
import { getLectureIcon } from './Dashboard';

function Sidebar({ userId, selectedDate }) {
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const data = await getDashboard(userId, formattedDate);
        if (data.success) {
          const filteredLectures = data.data.filter(lecture => {
            const hasContent = (Array.isArray(lecture.assignmentDtos) && lecture.assignmentDtos.length > 0) ||
                               (Array.isArray(lecture.materialDtos) && lecture.materialDtos.length > 0) ||
                               (Array.isArray(lecture.videoDtos) && lecture.videoDtos.length > 0);
            return hasContent;
          });
          setLectures(filteredLectures);
        }
      } catch (error) {
        console.error("Dashboard API 호출 에러:", error);
      }
    };

    fetchDashboard();
  }, [userId, selectedDate]);

  return (
    <SidebarContainer>
      {lectures.length > 0 ? (
        lectures.map(lecture => {
          const allTasksSubmitted = 
            (lecture.assignmentDtos || []).every(task => task.submissionStatus === 'SUBMITTED') &&
            (lecture.materialDtos || []).every(task => task.submissionStatus === true) &&
            (lecture.videoDtos || []).every(() => true);
          return (
            <MenuItem key={lecture.courseId}>
              {getLectureIcon(allTasksSubmitted ? 'SUBMITTED' : 'NOT_SUBMITTED')}
              {lecture.courseTitle}
            </MenuItem>
          );
        })
      ) : (
        <div></div>
      )}
    </SidebarContainer>
  );
}

Sidebar.propTypes = {
  userId: PropTypes.string.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
};

const SidebarContainer = styled.div`
    min-width: 75px;
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

export default Sidebar;
