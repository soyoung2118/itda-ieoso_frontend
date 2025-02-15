import { useState, useContext, useEffect } from "react";
import { NavLink, useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import Container from "../Container";
//import StarIcon from "@mui/icons-material/Star";
import { getMyCoursesTitles } from "../../api/classApi";
import { UsersContext } from "../../contexts/usersContext";

const Navbar = styled.div`
  background-color: var(--white-color);
  padding: 0.6rem 1.3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 15px;
  font-size: 1.4rem;
`;

const VerticalLine = styled.div`
  width: 1px;
  height: 3.4rem;
  background-color: #cdcdcd;
  margin: 0rem;
`;

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
  font-weight: bold;

  &:hover > div {
    display: block;
  }
`;

const DropdownButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0rem;
  cursor: pointer;
  background-color: var(--white-color);
  border-radius: 8px;
  font-weight: bold;
  color: var(--black-color);
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 175%;
  left: 0;
  background-color: var(--white-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 10;
  width: 23rem; /* 메뉴의 너비 */
  padding: 1rem 0;
  display: ${(props) => (props.isOpen ? "block" : "none")};

  ${Dropdown}:hover & {
    display: block; /* Hover 시 드롭다운 메뉴 보이기 */
  }
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
  background-color: ${(props) =>
    props.selected ? "#F7F7F7" : "var(--white-color)"};
  color: ${(props) => (props.selected ? "var(--black-color)" : "#474747")};

  &:hover {
    background-color: #F7F7F7;
  }

  .star-icon {
    color: ${(props) =>
      props.selected ? "var(--highlight-color)" : "var(--darkgrey-color)"};
    font-size: 1rem;
  }
`;

const TabLink = styled(NavLink)`
  width: 10rem;
  text-align: center;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: var(--darkgrey-color);
  font-weight: bold;
  font-size: 1.45rem;

  &.active {
    color: var(--black-color);
    border-bottom: 3px solid var(--black-color);
    margin-bottom: -1rem;
  }
`;

const ClassTopbar = ({ onCourseChange, isCreator }) => {
  const { user } = useContext(UsersContext);
  const { courseId } = useParams();
  const location = useLocation();
  const [classOptions, setClassOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 열림 상태

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user?.userId) return;
      const courses = await getMyCoursesTitles(user.userId);
      console.log("불러온 강의 목록",courses);
      setClassOptions(courses);
    };

    fetchClasses();
  }, [user?.userId]);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getActiveTab = () => {
    if (location.pathname.includes("/overview/notice")) return "overview";
    if (location.pathname.includes("/curriculum")) return "curriculum";
    if (location.pathname.includes("/admin")) return "admin";
    return ""; // 기본값
  };

  return (
    <Navbar>
      <Container style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "2.15rem" }}
        >
          home
        </span>
        <VerticalLine />
        <Dropdown>
          <DropdownButton onClick={handleDropdownToggle}>
              {classOptions.find((course) => course.courseId === courseId)?.courseTitle || "강의실 선택"} 
              <span style={{ marginLeft: "1rem" }}>▼</span>
            </DropdownButton>
          <DropdownMenu isOpen={isDropdownOpen}>
            <MenuTitle>강의실 목록</MenuTitle>
            {classOptions.map((course) => {
              console.log("🔍 현재 선택된 강의실 ID:", courseId, "비교 대상:", course.courseId);

              return (
                <MenuItem
                  key={course.courseId}
                  selected={Number(courseId) === course.courseId}
                  onClick={() => {
                    onCourseChange(course.courseId);
                    setIsDropdownOpen(false);
                  }}
                >
                  <div>{course.courseTitle}</div>
                  {/* {option.isManageable && <StarIcon className="star-icon" />} */}
                </MenuItem>
              )
            })}
          </DropdownMenu>
        </Dropdown>
      </Container>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <TabLink
          to={`/class/${courseId}/overview/info`}
          className={getActiveTab() === "overview" ? "active" : ""}
        >
          개요
        </TabLink>
        <TabLink
          to={`/class/${courseId}/curriculum`}
          className={getActiveTab() === "curriculum" ? "active" : ""}
        >
          커리큘럼
        </TabLink>
        {isCreator && (
          <TabLink
            to={`/class/${courseId}/admin/summary`}
            className={getActiveTab() === "admin" ? "active" : ""}
          >
            관리
          </TabLink>
        )}
      </nav>
    </Navbar>
  );
};

ClassTopbar.propTypes = {
  onCourseChange: PropTypes.func.isRequired,
  isCreator: PropTypes.bool.isRequired,
};

export default ClassTopbar;
