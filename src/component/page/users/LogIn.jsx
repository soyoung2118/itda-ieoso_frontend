import { useState } from "react";
import TopBar from "../../ui/TopBar";
import logoImage from "../../img/logo/itda_logo_symbol.svg";
import googleIcon from "../../img/icon/google.svg";
import styled from "styled-components";
import { ModalOverlay, AlertModalContainer } from "../../ui/modal/ModalStyles";

export default function LogIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleGoogleLogin = () => {
    setIsLoading(true);
    const redirectUri = encodeURIComponent(
      `${window.location.origin}/oauth/callback`,
    );
    const googleLoginUrl = `${import.meta.env.VITE_API_URL}/oauth/google/login?redirect_uri=${redirectUri}`;
    window.location.href = googleLoginUrl;
  };

  return (
    <>
      <TopBar />  
      <LoginPageLayout>
        <Container>
          <LogoImage src={logoImage} alt="logo" />
          <LogoText>로그인</LogoText>
            <GoogleButton onClick={handleGoogleLogin} disabled={isLoading}>
            <GoogleIcon src={googleIcon} alt="logo" />
            {isLoading ? "처리 중..." : "Google로 계속하기"}
            </GoogleButton>
        </Container>
      </LoginPageLayout>
      {showAlertModal && (
        <ModalOverlay>
          <AlertModalContainer>
            <div className="text">{alertMessage}</div>
            <div className="button-container">
              <button
                className="close-button"
                onClick={() => setShowAlertModal(false)}
              >
                확인
              </button>
            </div>
          </AlertModalContainer>
        </ModalOverlay>
      )}
    </>
  );
}

const LoginPageLayout = styled.div`
  padding: 20vh 10vw;
  max-width: 650px;
  margin: 0 auto;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  width: 100%;
  padding: 3.5rem 2rem;
  box-sizing: border-box;
`;

const LogoImage = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: 1.5rem;
`;

const LogoText = styled.div`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 3vh;
`;

const GoogleButton = styled.button`
  width: 100%;
  max-width: 500px;
  height: 48px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  background-color: #ffffff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #f8f8f8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const GoogleIcon = styled.img`
  width: 20px;
  height: 20px;
  position: absolute;
  left: 35px;

  @media (max-width: 768px) {
    width: 15px;
    height: 15px;
    left: 20px;
  }
`;
