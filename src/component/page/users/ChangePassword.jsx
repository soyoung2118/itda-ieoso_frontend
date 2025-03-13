import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../ui/TopBar";
import logoImage from "../../img/logo/itda_logo_symbol.svg";
import userIcon from "../../img/icon/usericon.svg";
import {
    LogoImage,
    LogoText,
    Form,
    Label,
    ValidateMessage,
    NextButton,
} from "../../../style/Styles";
import { ModalOverlay } from "../../ui/modal/ModalStyles";
import { UsersContext } from "../../contexts/usersContext";
import styled from "styled-components";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const [checknewpassword, setCheckNewPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(UsersContext);

  const handleFindPassword = (event) => {
    event.preventDefault();
    if (!password) {
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
    setIsModalOpen(true);
  }

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
          <div style={{ minWidth: '300px', width: '100%', margin: '0 auto' }}>
            <ChangePasswordInputContainer>
            <UserInfo>
              <img src={userIcon} alt="user icon" className="user-info-profile" />
              <UserText>
                <div className="user-info-name">{user.name}</div>
                <div className="user-info-email">{user.email}</div>
              </UserText>
            </UserInfo>
              <Form onSubmit={handleFindPassword}>
                <Label>기존 비밀번호</Label>
                <ChangeInput
                  type="text"
                  placeholder="비밀번호를 설정해주세요."
                  onChange={(e) => setPassword(e.target.value)}
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
                  style={{ fontSize: '1rem', marginTop: '1rem', backgroundColor: '#FF4747', cursor: 'pointer' }}
                  type="submit"
                >비밀번호 변경 </NextButton>
              </Form>
            </ChangePasswordInputContainer>
          </div>
        </Container>
      </ChangePasswordContainer>
      {isModalOpen && (
        <ModalOverlay>
          <ModalContainer>
            <Message>비밀번호 변경을 완료했어요</Message>
            <CloseButton onClick={closeModal}>확인</CloseButton>
          </ModalContainer>
        </ModalOverlay>
      )}
    </>
  );
}

const ChangePasswordContainer = styled.div`
  background-color: #FFFFFF;
  min-width: 300px;
  width: 100%;
  margin: 0 auto;
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
    height: calc(100vh - 7vh);
    min-width: 300px;
    width: 100%;
    max-width: 500px;
`;

const UserInfo = styled.div`
  display: flex;
  justify-content: flext-start;
  margin-bottom: 12px;

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
  padding: 0 20px;
`;

const ChangeInput = styled.input`
    padding: 0.7rem;
    border: 1px solid #CDCDCD;
    border-radius: 15px;
    font-size: 1rem;
    margin-bottom: 0.5rem;

    &::placeholder {
        color: #CDCDCD;
    }
`;


const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 40px 80px;
  border-radius: 8px;
  text-align: center;
  width: 50%;
  max-width: 300px;
  font-size: 1rem;
  position: relative;
`;

const Message = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: red;
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  right: 30px;
  bottom: 20px;
`;