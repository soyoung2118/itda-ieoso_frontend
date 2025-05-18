import api from "./api";

// 토큰 갱신 중인지 확인하는 플래그
let isRefreshing = false;
// 토큰 갱신 대기 중인 요청들을 저장하는 배열
let refreshSubscribers = [];

// 상수 정의
const TOKEN_EXPIRATION_TIME = 3600000; // 1시간
//const SESSION_EXPIRATION_TIME = 1209600000; // 2주 (14일)
const SESSION_EXPIRATION_TIME = 300000; // 5분

// 토큰 갱신이 완료되면 대기 중인 요청들을 처리
const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// 토큰 갱신을 기다리는 요청을 등록
const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// 토큰 에러 이벤트 발생
const dispatchTokenError = (errorMessage) => {
  const event = new CustomEvent("tokenError", {
    detail: {
      type: "token_error",
      message: errorMessage,
    },
  });
  window.dispatchEvent(event);
};

// 세션 만료 시간 설정
export const setSessionExpiration = () => {
  const expirationTime = new Date().getTime() + SESSION_EXPIRATION_TIME;
  localStorage.setItem("sessionExpiration", expirationTime);
};

// 세션이 만료되었는지 확인
export const isSessionExpired = () => {
  const sessionExpiration = localStorage.getItem("sessionExpiration");
  if (!sessionExpiration) return true;
  return new Date().getTime() > parseInt(sessionExpiration);
};

// 로그아웃 처리
export const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("tokenExpiration");
  localStorage.removeItem("sessionExpiration");
  localStorage.removeItem("user");
  window.location.href = "/";
};

// 토큰 갱신 함수
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      dispatchTokenError("Refresh token not found");
      throw new Error("Refresh token not found");
    }

    // 세션이 만료되었으면 로그아웃
    if (isSessionExpired()) {
      handleLogout();
      throw new Error("Session expired");
    }

    const response = await api.post("/oauth/reissuetoken", {
      refreshToken: refreshToken,
    });

    const newAccessToken = response.data.jwtToken;
    if (!newAccessToken) {
      dispatchTokenError("New access token not received");
      throw new Error("New access token not received");
    }

    // 새 토큰 저장
    localStorage.setItem("token", newAccessToken);

    // 토큰 만료 시간 설정 (1시간)
    const expirationTime = new Date().getTime() + TOKEN_EXPIRATION_TIME;
    localStorage.setItem("tokenExpiration", expirationTime);

    return newAccessToken;
  } catch (error) {
    if (error.message !== "Session expired") {
      dispatchTokenError(error.message);
    }
    handleLogout();
    throw error;
  }
};

// 자동 토큰 갱신 타이머 설정
export const startTokenRefreshTimer = () => {
  // 이전 타이머가 있다면 제거
  if (window.tokenRefreshTimer) {
    clearInterval(window.tokenRefreshTimer);
  }

  // 1시간마다 토큰 갱신
  window.tokenRefreshTimer = setInterval(async () => {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        onRefreshed(newToken);
      } catch (error) {
        console.error("Token refresh failed:", error);
      } finally {
        isRefreshing = false;
      }
    }
  }, TOKEN_EXPIRATION_TIME); // 1시간마다 체크
};

// 토큰 갱신 요청 처리
export const handleTokenRefresh = async () => {
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const newToken = await refreshAccessToken();
      onRefreshed(newToken);
      return newToken;
    } catch (error) {
      refreshSubscribers = [];
      throw error;
    } finally {
      isRefreshing = false;
    }
  }

  // 토큰 갱신이 진행 중이면 새로운 토큰을 기다림
  return new Promise((resolve) => {
    addRefreshSubscriber((token) => {
      resolve(token);
    });
  });
};
