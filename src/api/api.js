import axios from "axios";
import { handleTokenRefresh, dispatchTokenError } from "./tokenManager.js";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰이 만료되었는지 확인
const isTokenExpired = () => {
  const expirationTime = localStorage.getItem("tokenExpiration");
  if (!expirationTime) return true;
  return new Date().getTime() > parseInt(expirationTime);
};

// 요청 인터셉터: 요청 전에 토큰 체크 및 갱신
api.interceptors.request.use(
  async (config) => {
    // OAuth 관련 요청은 제외
    if (
      config.url?.includes("/oauth/reissuetoken") ||
      config.url?.includes("/oauth/return/uri") ||
      config.url?.includes("/oauth/google/login")
    ) {
      return config;
    }

    // 토큰이 만료되었으면 갱신 시도
    if (isTokenExpired()) {
      try {
        const newToken = await handleTokenRefresh();
        config.headers["Authorization"] = `Bearer ${newToken}`;
      } catch (error) {
        // 토큰 갱신 실패는 response 인터셉터에서 처리
        return Promise.reject(error);
      }
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 응답 후 에러 처리
api.interceptors.response.use(
  (response) => {
    if (!response.data) {
      response.data = { message: "응답 바디 없음" };
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 토큰 재발급 API 실패 시 바로 로그아웃
    if (error.config.url?.includes("/oauth/reissuetoken")) {
      dispatchTokenError("예상치 못한 에러로 로그아웃 합니다");
      return Promise.reject(error);
    }

    // 다른 API 요청에서 401, 403 에러 발생 시 토큰 재발급 시도
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !error.config.url?.includes("/oauth/reissuetoken") // 토큰 재발급 API는 제외
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await handleTokenRefresh();
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        dispatchTokenError("예상치 못한 에러로 로그아웃 합니다");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
