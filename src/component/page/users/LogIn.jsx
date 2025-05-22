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

  function isInAppBrowser() {
    const ua = navigator.userAgent || navigator.vendor;
    return /KAKAOTALK|FBAN|FBAV|Instagram/.test(ua);
  }

  function isAndroid() {
    return /Android/i.test(navigator.userAgent);
  }

  function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  const handleGoogleLogin = () => {
    if (isInAppBrowser()) {
      if (isAndroid()) {
        setAlertMessage(
          "구글 정책으로 인해 해당 앱 내에서는\n" +
          "구글 로그인이 지원되지 않습니다.\n" +
          "우측 하단 ⋮버튼을 눌러 외부 브라우저로 열어주세요."
        );
      } else if (isIOS()) {
        setAlertMessage(
          "구글 정책으로 인해 해당 앱 내에서는\n" +
          "구글 로그인이 지원되지 않습니다.\n" +
          "외부 브라우저(Safari)에서 다시 접속해주세요."
        );
      } else {
        setAlertMessage(
          "구글 정책으로 인해 해당 앱 내에서는\n" +
          "구글 로그인이 지원되지 않습니다.\n" +
          "외부 브라우저에서 다시 접속해주세요."
        );
      }
      setShowAlertModal(true);
      return;
    }
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
            <div className="none-bold-text">{alertMessage}</div>
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
