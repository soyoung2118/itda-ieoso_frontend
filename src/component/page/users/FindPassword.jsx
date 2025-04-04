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
import { ModalOverlay, AlertModalContainer } from "../../ui/modal/ModalStyles";
import { findpassword } from "../../api/usersApi";

export default function FindPassword() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleFindPassword = async (event) => {
    event.preventDefault();
    if (!name || !email) {
      setModalMessage("이름과 이메일을 작성해주세요.");
      return;
    }

    setIsLoading(true);
    setModalMessage("전송 중...");
    setIsModalOpen(true);
    setIsError(false);

    try {
      const response = await findpassword(name, email);

      if (response) {
        setModalMessage("이메일로 임시 비밀번호를 보냈어요");
      } else {
        setModalMessage("비밀번호 찾기에 실패했습니다. 다시 시도해주세요.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setModalMessage("서버 오류가 발생했습니다. 다시 시도해주세요.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (!isError) {
      navigate("/login");
    }
  };

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
              style={{ fontSize: "1rem", marginTop: "2rem" }}
              type="submit"
            >
              비밀번호 찾기
            </NextButton>
          </Form>
        </SignUpContainer>
      </Container>
      {isModalOpen && (
        <ModalOverlay>
          <AlertModalContainer>
            <div className="text">{modalMessage}</div>
            <div className="close-button" onClick={closeModal}>
              확인
            </div>
          </AlertModalContainer>
        </ModalOverlay>
      )}
    </>
  );
}
