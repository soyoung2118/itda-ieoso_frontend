import { useState } from "react";
import TopBar from "../../ui/TopBar";
import logoImage from "../../img/logo/itda_logo_symbol.svg";
import googleIcon from "../../img/icon/google.svg";

import {
  Container,
  LogoImage,
  LogoText,
  SocialLoginButton,
  GoogleButton,
  GoogleIcon,
} from "../../../style/Styles";
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
      <Container>
        <LogoImage src={logoImage} alt="logo" />
        <LogoText>로그인</LogoText>
        <SocialLoginButton>
          <GoogleButton onClick={handleGoogleLogin} disabled={isLoading}>
            <GoogleIcon src={googleIcon} alt="logo" />
            {isLoading ? "처리 중..." : "Google로 계속하기"}
          </GoogleButton>
        </SocialLoginButton>
      </Container>
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
