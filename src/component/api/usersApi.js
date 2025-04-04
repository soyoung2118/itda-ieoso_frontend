import { useEffect } from "react";
import api from "./api";

export const login = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    // 응답 헤더에서 토큰 추출
    const token = response.headers["authorization"];
    if (token) {
      localStorage.setItem("token", token);

      const expirationTime = new Date().getTime() + 36000000; // 10시간
      localStorage.setItem("tokenExpiration", expirationTime);
      startLogoutTimer();
    }
    return response;
  } catch (error) {
    console.error("로그인 API 호출 실패:", error);
    throw error;
  }
};

export const findpassword = async (name, email) => {
  const response = await api.post(
    `/users/reset/password?email=${email}&name=${name}`,
  );
  return response.data;
};

export const signup = async (credentials) => {
  const response = await api.post("/users/sign-up", credentials);
  return response.data;
};

export const checkEmail = async (email) => {
  const response = await api.get(`/users/check-email?email=${email}`);
  return response.data;
};

export const logout = async () => {
  try {
    const response = await api.post("/logout");
    window.location.href = "/";

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return response;
  } catch (error) {
    console.error("로그아웃 중 오류 발생:", error);
    throw error;
  }
};

// 자동 로그아웃 타이머 설정 함수
const startLogoutTimer = () => {
  if (window.autoLogoutTimer) {
    clearTimeout(window.autoLogoutTimer);
  }

  const expirationTime = localStorage.getItem("tokenExpiration");
  if (expirationTime) {
    const timeLeft = expirationTime - new Date().getTime();
    if (timeLeft > 0) {
      window.autoLogoutTimer = setTimeout(() => {
        logout();
      }, timeLeft);
    } else {
      logout(); // 시간이 이미 지났다면 즉시 로그아웃
    }
  }
};

// 앱이 실행될 때 자동 로그아웃 타이머를 설정 훅
export const useAutoLogout = () => {
  useEffect(() => {
    startLogoutTimer();
  }, []);
};

export const getUsersInfo = async () => {
  const response = await api.get("/users/user-info");
  return response.data;
};
