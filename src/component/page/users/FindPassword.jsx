import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../ui/TopBar";
import logoImage from "../../img/logo/itda_logo_symbol.svg";
import {
    Container,
    LogoImage,
    LogoText,
    SignUpContainer,
    Form,
    Label,
    LoginInput,
    NextButton,
} from "../../../style/Styles";
import { ModalOverlay} from "../../ui/modal/ModalStyles";
import styled from "styled-components";
import { findpassword } from '../../api/usersApi';

export default function FindPassword() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFindPassword = async (event) => {
    event.preventDefault();
    if (!name || !email) {
      alert('이름과 이메일을 작성해주세요.');
      return;
    }

    try {
      const response = await findpassword(name, email);

      if (response) {
        setIsModalOpen(true);
      } else {
        alert('비밀번호 찾기에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버 오류가 발생했습니다. 나중에 다시 시도해주세요.');
    }
  }

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/login');
  }

  return (
    <>
      <TopBar />
      <Container>
        <LogoImage src={logoImage} alt="logo" />
        <LogoText>비밀번호 찾기</LogoText>
        <SignUpContainer>
          <Form onSubmit={handleFindPassword}>
            <Label>이름</Label>
            <LoginInput
              type="text"
              placeholder="이름을 입력해주세요."
              onChange={(e) => setName(e.target.value)}
            />

            <Label>이메일</Label>
            <LoginInput
              type="text"
              placeholder="이메일을 입력해주세요."
              onChange={(e) => setEmail(e.target.value)}
            />
            <NextButton
              style={{ fontSize: '1rem', marginTop: '2rem' }}
              type="submit"
            >비밀번호 찾기</NextButton>
          </Form>
        </SignUpContainer>
      </Container>
      {isModalOpen && (
        <ModalOverlay>
          <ModalContainer>
            <Message>이메일로 임시 비밀번호를 보냈어요</Message>
            <CloseButton onClick={closeModal}>확인</CloseButton>
          </ModalContainer>
        </ModalOverlay>
      )}
    </>
  );
}

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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