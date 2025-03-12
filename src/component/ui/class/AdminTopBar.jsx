import { useState, useEffect, useContext } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import Delete from "../../img/icon/bin.svg";
import Share from "../../img/icon/share.svg";
import { ModalOverlay, ModalContent } from "../../ui/modal/ModalStyles";
import api from "../../api/api";
import { UsersContext } from "../../contexts/usersContext";
import { getCourseNameandEntryCode } from "../../api/classApi";

const Container = styled.div`
  width: 100%;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: bold;
  color: var(--black-color);
  margin-top: 2rem;
  margin-bottom: 1.8vh;
  margin-left:2.5vh;


  @media (max-width: 768px) {
    font-size: 24px;
  }
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

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const TabContainer = styled.nav`
  display: flex;
  gap: 1rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
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

  @media (max-width: 768px) {
    width: 70px;
    font-size: 16px;
  }
`;

const IconContainer = styled.nav`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;

  @media (max-width: 768px) {
    justify-content: center;
    margin-left: 0;
  }
`;

const Icon = styled.img`
  width: 33px;
  height: 33px;
  cursor: pointer;

  &.delete-icon {
    height: 37px;
  }
`;

const ShareDropdownContainer = styled.div`
  position: absolute;
  top: 340px;
  right: 110px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  width: 250px;

  div {
    display: flex;
    justify-content: space-between;
    margin: 8px 0 12px;
    background-color: #EDEDED;
    border-radius: 10px;
  }

  text{
    height: 100%;
    font-weight: 700;
  }

  .shareinfo{
    margin-bottom: 12px;
  }

  span {
    padding: 6px 10px 6px;
  }

  button {
    background-color: #F7F7F7;
    color: var(--black-color);
    border: none;
    border-radius: 0 15px 15px 0;
    padding: 7px 15px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .invite-button{
    width: 100%;
    font-weight: 600;
    background-color: var(--pink-color);
    padding: 10px 0;
    margin-top: 5px;
    border-radius: 15px;
  }
`;


const AdminTopBar = ({ activeTab }) => {
  const { courseId } = useParams();
  const { user } = useContext(UsersContext);
  const navigate = useNavigate();
  // 모달 관련 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [entryCode, setEntryCode] = useState("");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const details = await getCourseNameandEntryCode(courseId);
      if (details) {
        setCourseName(details.courseTitle);
        setEntryCode(details.entryCode);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleDeleteLecture = async (courseId) => {
    console.log('Deleting course with ID:', courseId);
    try {
        await api.delete(`/courses/${courseId}?userId=${user.userId}`);
        navigate("/class/list");
    } catch (error) {
        console.error('강의실 삭제 중 오류 발생:', error);
    }
  };
  
  const handleShare = () => {
    const inviteText = `[${courseName}] 강의실에 초대합니다!\n\n🔗 강의실 링크: https://eduitda.com\n📌 강의실 코드: ${entryCode}\n\n1. itda 로그인\n2. + 버튼 클릭 > 강의실 입장하기\n3. 강의실 코드 입력\n\n지금 바로 참여하고 함께 배워요! 😊`;
    navigator.clipboard.writeText(inviteText)
      .then(() => alert('초대 메시지가 복사되었습니다!'))
      .catch(err => console.error('복사 실패:', err));
  };

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
            과제 보기
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
            className="material-icons" 
            src={Delete} 
            alt="delete icon" 
            onClick={() => {
              setShowDeleteModal(true);
            }}
          />
          <Icon 
            className="material-icons" 
            src={Share} 
            alt="share icon" 
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <ShareDropdownContainer>
              <text>강의실 링크</text>
              <div className="shareinfo">
                <span>www.eduitda.com</span>
                <button onClick={() => navigator.clipboard.writeText('www.eduitda.com')}>URL 복사</button>
              </div>
              <text>강의실 코드</text>
              <div className="shareinfo">
                <span>{entryCode}</span>
                <button onClick={() => navigator.clipboard.writeText(entryCode)}>코드 복사</button>
              </div>
              <button className="invite-button" onClick={handleShare}>강의실 초대하기</button>
            </ShareDropdownContainer>
          )}
        </IconContainer>
      </NavbarContent>
      {showDeleteModal && (
        <ModalOverlay>
          <ModalContent>
            <h2>강의실 삭제</h2>
            <span>강의실을 삭제할까요?</span>
            <div className="button-container">
              <button className="close-button" onClick={() => setShowDeleteModal(false)}>취소</button>
              <button className="delete-button" onClick={() => handleDeleteLecture(courseId)}>삭제하기</button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

AdminTopBar.propTypes = {
  activeTab: PropTypes.string.isRequired,
};

export default AdminTopBar;