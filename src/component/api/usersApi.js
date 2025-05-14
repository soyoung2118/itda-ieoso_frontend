import { useEffect } from "react";
import api from "./api";

export const login = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    // 응답 헤더에서 토큰 추출
    const token = response.headers["authorization"];
    // 리프레쉬 토큰 추출
    const refreshToken = response.data.refreshToken;

    if (token && refreshToken) {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);


      const expirationTime = new Date().getTime() + 3600000; // 1시간
      localStorage.setItem("Expiration", expirationTime);
      startLogoutTimer();
    }
    return response;
  } catch (error) {
    console.error("로그인 API 호출 실패:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/logout");
    window.location.href = "/";

    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("user");
    return response;
  } catch (error) {
    console.error("로그아웃 중 오류 발생:", error);
    throw error;
  }
};

// 자동 로그아웃 타이머 설정 함수
export const startLogoutTimer = () => {
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

// 리프레쉬 토큰
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("Refresh token이 없습니다.");

  const response = await api.post("/auth/refresh", {
    refreshToken: refreshToken,
  });

  return response.data.jwtToken; // 새 access token
};
