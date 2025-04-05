import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../ui/TopBar";
import logoImage from "../../img/logo/itda_logo_symbol.svg";
import userIcon from "../../img/icon/usericon.svg";
import {
    LogoImage,
    LogoText,
    Label,
    ValidateMessage,
} from "../../../style/Styles";
import { ModalOverlay, AlertModalContainer } from "../../ui/modal/ModalStyles";
import { UsersContext } from "../../contexts/usersContext";
import styled from "styled-components";
import api from "../../api/api"

export default function ChangePassword() {
  const navigate = useNavigate();
  const [currentpassword, setCurrentPassword] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const [checknewpassword, setCheckNewPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(UsersContext);

  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (!currentpassword) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (!newpassword) {
      alert('새 비밀번호를 입력해주세요.');
      return;
    }

    if (!checknewpassword) {
      alert('새 비밀번호를 확인해주세요.');
      return;
    }

    if (newpassword !== checknewpassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await api.post(`/users/change/password?currentPassword=${encodeURIComponent(currentpassword)}&newPassword=${encodeURIComponent(newpassword)}`);

      if (response.status === 200) {
        setIsModalOpen(true);
      }
    } catch {
      alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

    //비밀번호 조건 검사
  const validatePassword = (password) => {
    const regex = /^.{8,}$/;  // 8자 이상만 체크
    //const regex = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; 소문자+글자 수
    //const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; 대문자도 필수일 때
    return regex.test(password);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/class/list');
  }

  return (
    <>
      <TopBar />
      <ChangePasswordContainer>
        <Container>
        <LogoContainer>
          <LogoImage src={logoImage} alt="logo" />
          <LogoText>비밀번호 변경</LogoText>
        </LogoContainer>
            <ChangePasswordInputContainer>
            <UserInfo>
              <img src={userIcon} alt="user icon" className="user-info-profile" />
              <UserText>
                <div className="user-info-name">{user ? user.name : '이름 없음'}</div>
                <div className="user-info-email">{user ? user.email : '이메일 없음'}</div>
              </UserText>
            </UserInfo>
              <Form onSubmit={handleChangePassword}>
                <Label>기존 비밀번호</Label>
                <ChangeInput
                  type="text"
                  placeholder="비밀번호를 설정해주세요."
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Label>새 비밀번호</Label>
                <ChangeInput
                  type="text"
                  placeholder="비밀번호를 설정해주세요."
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <ValidateMessage style={{
                  color: newpassword.length > 0 && !validatePassword(newpassword) ? 'var(--guide-red-color)' : 'var(--guide-gray-color)',
                }}>
                  {newpassword.length === 0 
                    ? '영문 대/소문자, 숫자, 특수문자를 조합하여 8자 이상 입력해주세요.' 
                    : (!validatePassword(newpassword) 
                        ? '영문 대/소문자, 숫자, 특수문자를 조합하여 8자 이상 입력해주세요.' 
                        : '영문 대/소문자, 숫자, 특수문자를 조합하여 8자 이상 입력해주세요.')}
                </ValidateMessage>
                <Label>새 비밀번호 확인</Label>
                <ChangeInput
                  type="text"
                  placeholder="설정하신 비밀번호를 입력해주세요."
                  onChange={(e) => setCheckNewPassword(e.target.value)}
                />
                <ValidateMessage style={{
                  color: checknewpassword.length > 0 && newpassword !== checknewpassword ? 'var(--guide-red-color)' : 'var(--guide-gray-color)',
                }}>
                  {checknewpassword.length === 0 
                    ? '' 
                    : (newpassword !== checknewpassword 
                        ? '비밀번호가 일치하지 않아요.' 
                        : '')}
                </ValidateMessage>
                <NextButton
                  type="submit"
                >비밀번호 변경 </NextButton>
              </Form>
            </ChangePasswordInputContainer>
        </Container>
      </ChangePasswordContainer>
      {isModalOpen && (
        <ModalOverlay>
          <AlertModalContainer>
            <div className="text" style={{ whiteSpace: 'pre-line' }}>비밀번호 변경을 완료했어요</div>
            <div className="close-button" onClick={closeModal}>확인</div>
          </AlertModalContainer>
        </ModalOverlay>
      )}
    </>
  );
}

const ChangePasswordContainer = styled.div`
  background-color: #FFFFFF;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding-top: 2vh;
`;

const LogoContainer = styled.div`
  text-align: center;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #FFFFFF;
  min-width: 300px;
  width: 100%;
  max-width: 500px;
  height: calc(100vh - 7vh);

  @media all and (max-width:479px) {
    max-width: 300px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  justify-content: flext-start;
  margin-bottom: 24px;

  .button-container {
        margin-top: 12px;
    }

    .user-info-profile {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
    }

    .user-info-name {
        font-size: 14px;
        font-weight: 500;
        margin-right: 10px;
        white-space: nowrap;
    }

    .user-info-email {
        margin-top: 4px;
        font-size: 12px;
        font-weight: 200;
    }
`;

const UserText = styled.div`
    margin-left: 10px;
`;

const ChangePasswordInputContainer = styled.div`
  text-align: left;
  width: 100%;
  max-width: 700px;
  box-sizing: border-box;
  /* padding: 0 20px; */
  
  /* 모바일 세로 (해상도 ~ 479px)*/ 
  @media all and (max-width:479px) {
    padding: 0;
  }
`;

const Form = styled.div`
  font-size: 10px;
`;

const ChangeInput = styled.input`
    width: 100%;
    padding: 0.7rem;
    border: 1px solid #CDCDCD;
    border-radius: 15px;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    box-sizing: border-box;

    &::placeholder {
        color: #CDCDCD;
    }
    /* 모바일 세로 (해상도 ~ 479px)*/ 
    @media all and (max-width:479px) {
        width: 100%;
    }
`;

const NextButton = styled.button`
  width: 100%;
  background-color: #FF4747;
  color: white;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 15px;
  margin: 10px 0;
  background-color: #FF4747;
  cursor: pointer;
  box-sizing: border-box;
`;