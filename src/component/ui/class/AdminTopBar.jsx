import { NavLink, useParams } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";

const Navbar = styled.div`
  background-color: var(--white-color);
  padding: 0.8rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 15px;
  font-size: 1.4rem;
  margin-bottom: 0.4rem;
`;

const TabLink = styled(NavLink)`
  width: 10rem;
  text-align: center;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #5f6368;
  font-weight: 550;
  font-size: 1.25rem;
  position: relative;

  &.active {
    &::after {
      content: "";
      position: absolute;
      bottom: -0.8rem;
      left: 0;
      width: 100%;
      height: 0.2rem; 
      background-color: var(--main-color); 
      border-radius: 5px; 
    }
  }
`;

const AdminTopBar = ({ activeTab }) => {
  const { courseId } = useParams();
  return (
    <div>
      <h1
        style={{
          fontSize: "2.4rem",
          fontWeight: "900",
          color: "var(--black-color)",
        }}
      >
        강의실 관리
      </h1>
      <Navbar>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <TabLink
            to={`/class/${courseId}/admin/summary`}
            className={activeTab === "summary" ? "active" : ""}
          >
            요약
          </TabLink>
          <TabLink
            to={`/class/${courseId}/admin/students`}
            className={activeTab === "students" ? "active" : ""}
          >
            학생별 보기
          </TabLink>
          <TabLink
            to={`/class/${courseId}/admin/setting`}
            className={activeTab === "setting" ? "active" : ""}
          >
            설정
          </TabLink>
        </nav>
      </Navbar>
    </div>
  );
};

// PropTypes 정의
AdminTopBar.propTypes = {
  activeTab: PropTypes.string.isRequired,
};

export default AdminTopBar;
