import { NavLink, useParams } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import Delete from "../../img/icon/bin.svg";
import Share from "../../img/icon/share.svg";

const Container = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 900;
  color: var(--black-color);
  margin-bottom: 1rem;
`;

const NavbarContent = styled.div`
  background-color: var(--white-color);
  padding: 0.8rem 1rem;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow-x: auto;
  min-width: min-content;
  gap: 2rem;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabContainer = styled.nav`
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
`;

const TabLink = styled(NavLink)`
  width: 120px;
  text-align: center;
  padding: 5px 10px;
  text-decoration: none;
  color: #5f6368;
  font-weight: 550;
  font-size: 18px;
  position: relative;
  white-space: nowrap;

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

const IconContainer = styled.nav`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-shrink: 0; // 너비가 줄어들 때 압축되지 않도록
  margin-left: auto; // 오른쪽 끝으로 정렬
`;

const Icon = styled.img`
  width: 33px;
  height: 33px;
  cursor: pointer;

  &.delete-icon {
    height: 37px;
  }
`;

const AdminTopBar = ({ activeTab }) => {
  const { courseId } = useParams();

  return (
    <Container>
      <Title>강의실 관리</Title>
      <NavbarContent>
        <TabContainer>
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
        </TabContainer>

        <IconContainer>
          <Icon 
            className="delete-icon material-icons" 
            src={Delete} 
            alt="delete icon" 
          />
          <Icon 
            className="material-icons" 
            src={Share} 
            alt="share icon" 
          />
        </IconContainer>
      </NavbarContent>
    </Container>
  );
};

AdminTopBar.propTypes = {
  activeTab: PropTypes.string.isRequired,
};

export default AdminTopBar;