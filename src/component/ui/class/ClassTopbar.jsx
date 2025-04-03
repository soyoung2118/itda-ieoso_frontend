import { useState, useContext, useEffect, useRef } from "react";
import { NavLink, useParams, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import Container from "../Container";
import StarIcon from "@mui/icons-material/Star";
import { getMyCoursesTitles } from "../../api/classApi";
import { UsersContext } from "../../contexts/usersContext";

const Navbar = styled.div`
  background-color: var(--white-color);
  padding: 0.5rem 1.3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 15px;
  font-size: 1.3rem;
  flex-direction: row;

  @media (max-width: 1024px) {
    font-size: 1.3rem;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }

  @media all and (max-width: 479px) {
    font-size: 20px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const VerticalLine = styled.div`
  width: 1px;
  height: 3.4rem;
  background-color: #cdcdcd;
`;

const ClassTitleContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;

  .course-title {
    font-size: 1.3rem;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 768px) {
        max-width: 13ch;
    }

    @media all and (max-width: 479px){
      max-width: 18ch;
      font-size: 18px;
    }
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 200px;
  left: 125px;
  font-weight: bold;
  min-width: 5rem;
  width: 10rem;
  z-index: 1000;

  @media all and (max-width: 479px) {
    top: 200px;
    left: 50px;
    width: 125px;
  }
`;

const DropdownButton = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0rem;
  cursor: pointer;
  background-color: var(--white-color);
  border-radius: 8px;
  font-weight: bold;
  color: var(--black-color);
  white-space: nowrap;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 155%;
  left: 0;
  background-color: var(--white-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 10;
  width: 225%;
  padding: 1rem 0;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
`;

const MenuTitle = styled.div`
  font-size: 0.87rem;
  font-weight: bold;
  color: #cdcdcd;
  padding: 0.5rem 1rem;
`;

const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1rem;
  margin: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 12px;
  background-color: ${({ selected }) =>
    selected ? "#F7F7F7" : "var(--white-color)"};
  color: ${({ selected }) => (selected ? "var(--black-color)" : "#474747")};

  &:hover {
    background-color: #f7f7f7;
  }

  .star-icon {
    color: ${({ selected }) =>
      selected ? "var(--highlight-color)" : "var(--darkgrey-color)"};
    font-size: 1rem;
  }
`;

const TabLinkContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: clamp(1rem, 2vw, 2rem);
  white-space: nowrap;


  @media all and (max-width: 479px) {
    font-size: 16px;
    gap: 15px;
  }
`;

const TabLink = styled(NavLink)`
  width: clamp(3rem, 7vw, 6rem);
  text-align: center;
  padding: 5px 10px;
  text-decoration: none;
  color: var(--darkgrey-color);
  font-weight: bold;
  position: relative;

 &.active {
    color: var(--black-color);
    border-bottom: 3px solid var(--black-color);
    margin-bottom: -18px;

    @media all and (max-width: 479px) {
      margin-bottom: -5px;
    }
  }

/* 화면이 768px보다 작아지면 고정 너비 해제 + 최소 너비만 지정 */
  @media (max-width: 768px) {
    font-size: 18px;
    &.active {
      margin-bottom: -21px;

      @media all and (max-width: 479px) {
        margin-bottom: -10px;
      }
    }
  }

  @media all and (max-width: 479px) {
    font-size: 16px;
    width: 40%;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RightContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;

  @media all and (max-width: 479px) {
    margin-top: 8px;
    justify-content: center;
  }
`;

const ClassTopbar = ({ onCourseChange, isCreator }) => {
  const { user } = useContext(UsersContext);
  const { courseId, lectureId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [classOptions, setClassOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const tabRef = useRef(null);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user?.userId) return;
      const courses = await getMyCoursesTitles(user.userId);
      setClassOptions(courses);
  
      const foundCourse = courses.find(
        (course) => String(course.courseId) === String(courseId)
      );
      setCurrentCourse(foundCourse || null);
    };
  
    fetchClasses();
  }, [user?.userId, courseId]);  

  useEffect(() => {
    const checkScrollable = () => {
      if (tabRef.current) {
        setIsScrollable(
          tabRef.current.scrollWidth > tabRef.current.clientWidth
        );
      }
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const getActiveTab = () => {
    if (location.pathname.includes("/overview/info")) return "info";
    if (location.pathname.includes("/overview/notice")) return "notice";
    if (location.pathname.includes("/curriculum") || location.pathname.includes("/playing") || location.pathname.includes("/submit")) return "curriculum";
    if (location.pathname.includes("/admin")) return "admin";
    return "";
  };

  return (
    <Navbar>
      <LeftContainer>
        <Container style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "1.8rem", cursor: "pointer" }}
            onClick={() => navigate("/class/list")}
          >
            home
          </span>
          <VerticalLine />
          <ClassTitleContainer onClick={handleDropdownToggle}>
            <span className="course-title">
              {classOptions.find(
                (course) => String(course.courseId) === String(courseId)
              )?.courseTitle || "강의실 선택"}
            </span>
            <DropdownButton>
              <span>▼</span>
            </DropdownButton>
          </ClassTitleContainer>
        </Container>
        {isDropdownOpen && (
          <DropdownContainer>
            <DropdownMenu isOpen={isDropdownOpen}>
              <MenuTitle>강의실 목록</MenuTitle>
              {classOptions.map((course) => (
                <MenuItem
                  key={course.courseId}
                  selected={String(courseId) === String(course.courseId)}
                  onClick={() => {
                    onCourseChange(course.courseId);
                    setIsDropdownOpen(false);
                  }}
                >
                  <div>{course.courseTitle}</div>
                  {course.isCreator && <StarIcon className="star-icon" />}
                </MenuItem>
              ))}
            </DropdownMenu>
          </DropdownContainer>
        )}
      </LeftContainer>
      <RightContainer>
        <TabLinkContainer
          ref={tabRef}
          className={isScrollable ? "scrolling" : ""}
        >
          <TabLink
            to={`/class/${courseId}/overview/info`}
            className={getActiveTab() === "info" ? "active" : ""}
          >
            개요
          </TabLink>
          <TabLink
            to={`/class/${courseId}/overview/notice`}
            className={getActiveTab() === "notice" ? "active" : ""}
          >
            공지
          </TabLink>
          <TabLink
            to={`/class/${courseId}/curriculum/${lectureId || 1}`}
            className={getActiveTab() === "curriculum" ? "active" : ""}
          >
            커리큘럼
          </TabLink>
          {(currentCourse?.isCreator || currentCourse?.isAssignmentPublic) && (
            <TabLink
              to={`/class/${courseId}/admin/summary`}
              className={getActiveTab() === "admin" ? "active" : ""}
            >
              관리
            </TabLink>
          )}
        </TabLinkContainer>
      </RightContainer>
    </Navbar>
  );
};

ClassTopbar.propTypes = {
  onCourseChange: PropTypes.func.isRequired,
  isCreator: PropTypes.bool.isRequired,
};

export default ClassTopbar;
