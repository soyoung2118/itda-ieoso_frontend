import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../ui/TopBar";
import logoImage from "../../img/logo/itda_logo_symbol.svg";
import { Checkbox, FormControlLabel } from "@mui/material";
import googleIcon from "../../img/icon/google.svg";

import {
  Container,
  LogoImage,
  LogoText,
  SignUpContainer,
  Form,
  Label,
  LoginInput,
  CheckboxContainer,
  CustomCheckboxSquare,
  LoginButton,
  SignUpLink,
  Divider,
  Line,
  SocialLoginButton,
  GoogleButton,
  GoogleIcon,
} from "../../../style/Styles";
import { ModalOverlay, AlertModalContainer } from "../../ui/modal/ModalStyles";
import { login, getUsersInfo } from "../../api/usersApi";
import { UsersContext } from "../../contexts/usersContext";

export default function LogIn() {
  const { setUser, setIsUser } = useContext(UsersContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      const token = response.headers?.authorization?.replace("Bearer ", "");

      if (!token) {
        throw new Error("Authorization 헤더가 존재하지 않습니다.");
      }

      localStorage.setItem("token", token);
      setIsUser(true);

      const userInfo = await getUsersInfo();
      setUser(userInfo.data);
      localStorage.setItem("user", JSON.stringify(userInfo.data));

      window.location.href = "/class/list";
    } catch (error) {
      console.error("로그인 실패:", error);

      if (error.config && error.config.url.includes("/login")) {
        if (error.response?.status === 401) {
          setAlertMessage("이메일 또는 비밀번호가 잘못되었습니다.");
          setShowAlertModal(true);
        } else {
          setAlertMessage(
            error.response?.data?.message || "로그인 중 오류가 발생했습니다.",
          );
          setShowAlertModal(true);
        }
      } else {
        setAlertMessage(
          "다른 API 호출 중 오류가 발생했습니다. 메인 페이지로 이동합니다.",
        );
        setShowAlertModal(true);
      }
    }
  };

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
        <Divider>
          <Line />
          <span>또는</span>
          <Line />
        </Divider>
        <SignUpContainer>
          <Form onSubmit={handleLogin}>
            <Label>이메일</Label>
            <LoginInput
              type="text"
              placeholder="이메일을 입력해주세요."
              onChange={(e) => setEmail(e.target.value)}
            />

            <Label>비밀번호</Label>
            <LoginInput
              type="password"
              placeholder="비밀번호를 입력해주세요."
              onChange={(e) => setPassword(e.target.value)}
            />
            <CheckboxContainer
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "end",
              }}
            >
              {/*
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        icon={CustomCheckboxSquare(false)}
                                        checkedIcon={CustomCheckboxSquare(true)}
                                        checked={isChecked}
                                        onChange={() => setIsChecked(!isChecked)}
                                    />
                                }
                                label="자동 로그인"
                                style={{ margin: 0 }}  // 여백 제거로 높이 일치
                            />
                            */}
              <span
                onClick={() => navigate("/find-password")}
                style={{
                  marginTop: "5px",
                  marginRight: "10px",
                  textDecoration: "none",
                  color: "#909090",
                  fontSize: "0.9rem",
                  lineHeight: "1.5",
                  cursor: "pointer",
                }}
              >
                비밀번호 찾기
              </span>
            </CheckboxContainer>
            <LoginButton
              style={{ fontSize: "1rem", marginTop: "15px" }}
              type="submit"
            >
              로그인
            </LoginButton>

            {/* <SignUpLink>
                            계정이 없으신가요? <a href="/signup">회원가입하기</a>
                        </SignUpLink> */}
          </Form>
        </SignUpContainer>
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
