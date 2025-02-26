import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getDashboard } from '../../api/dashboardApi';

function Sidebar({ userId, selectedDate }) {
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const formattedDate = selectedDate.toLocaleDateString('en-CA');
        const data = await getDashboard(userId, formattedDate);

        if (data.success) {
          const filteredLectures = data.data.filter(task => {
            const isOwnLecture = String(userId) === String(task.creatorId);

            const hasContent = (Array.isArray(task.assignmentDtos) && task.assignmentDtos.some(assignment => {
              const assignmentEndDate = new Date(assignment.endDate).toLocaleDateString('en-CA');
              return assignmentEndDate === formattedDate && (isOwnLecture || !Object.values(assignment).includes(null));
            })) ||
            (Array.isArray(task.materialDtos) && task.materialDtos.some(material => {
              const materialStartDate = new Date(material.startDate).toLocaleDateString('en-CA');
              return materialStartDate === formattedDate && (isOwnLecture || !Object.values(material).includes(null));
            })) ||
            (Array.isArray(task.videoDtos) && task.videoDtos.some(video => {
              const videoStartDate = new Date(video.startDate).toLocaleDateString('en-CA');
              return videoStartDate === formattedDate && (isOwnLecture || !Object.values(video).includes(null));
            }));
            return hasContent;
          });

          setLectures(filteredLectures);
        } else {
          console.log("Data fetch was not successful.");
        }
      } catch (error) {
        console.error("Sidebar API 호출 에러:", error);
      }
    };

    fetchDashboard();
  }, [userId, selectedDate]);

  const getIconType = (isOwnLecture, hasActiveStatus) => {
    if (isOwnLecture) return 'MY_LECTURE';
    return hasActiveStatus ? 'SUBMITTED' : 'NOT_SUBMITTED';
  };

  const getLectureIcon = (iconType) => {
    switch (iconType) {
      case 'MY_LECTURE':
        return <div className="mylectureicon"></div>;
      case 'SUBMITTED':
        return <div className="activeicon"></div>;
      case 'NOT_SUBMITTED':
        return <div className="unactiveicon"></div>;
      default:
        return null;
    }
  };

  return (
    <SidebarContainer>
      {lectures.length > 0 ? (
        lectures.map(lecture => {
          const isOwnLecture = String(userId) === String(lecture.creatorId);

          const hasActiveStatus = 
            (lecture.assignmentDtos || []).some(task => {
              const assignmentEndDate = new Date(task.endDate).toLocaleDateString('en-CA');
              return assignmentEndDate === selectedDate.toLocaleDateString('en-CA') && task.submissionStatus === 'SUBMITTED';
            });

          return (
            <MenuItem key={lecture.courseId}>
              {getLectureIcon(getIconType(isOwnLecture, hasActiveStatus))}
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
    .mylectureicon {
      margin-right: 10px;
      display: inline-block;
      width: 12px;
      height: 12px;
      background: var(--green-color);
      border-radius: 50%;
      text-align: center;
      line-height: 12px;
    }
`;

export default Sidebar;
