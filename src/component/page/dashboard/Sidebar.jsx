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
        const formattedDate = selectedDate.toLocaleDateString('en-CA');
        const data = await getDashboard(userId, formattedDate);

        if (data.success) {
          const filteredLectures = data.data.filter(task => {
            const hasContent = (Array.isArray(task.assignmentDtos) && task.assignmentDtos.some(assignment => {
              const assignmentEndDate = new Date(assignment.endDate).toLocaleDateString('en-CA');
              return assignmentEndDate === formattedDate;
            })) ||
            (Array.isArray(task.materialDtos) && task.materialDtos.some(material => {
              const materialStartDate = new Date(material.startDate).toLocaleDateString('en-CA');
              return materialStartDate === formattedDate;
            })) ||
            (Array.isArray(task.videoDtos) && task.videoDtos.some(video => {
              const videoStartDate = new Date(video.startDate).toLocaleDateString('en-CA');
              return videoStartDate === formattedDate;
            }));
            return hasContent;
          });
          setLectures(filteredLectures);
        }
      } catch (error) {
        console.error("Sidebar API 호출 에러:", error);
      }
    };

    fetchDashboard();
  }, [userId, selectedDate]);

  return (
    <SidebarContainer>
      {lectures.length > 0 ? (
        lectures.map(lecture => {
          const hasActiveStatus = 
            (lecture.assignmentDtos || []).some(task => task.submissionStatus === 'SUBMITTED') ||
            (lecture.materialDtos || []).some(task => task.materialHistoryStatus === true) ||
            (lecture.videoDtos || []).length > 0;

          const hasNotSubmitted = 
            (lecture.assignmentDtos || []).some(task => task.submissionStatus === 'NOT_SUBMITTED');

          return (
            <MenuItem key={lecture.courseId}>
              {getLectureIcon(hasActiveStatus && !hasNotSubmitted ? 'SUBMITTED' : 'NOT_SUBMITTED')}
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
