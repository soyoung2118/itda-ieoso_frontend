import api from "./api";

export const logout = async () => {
  try {
    const response = await api.post("/logout");
    window.location.href = "/";

    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("sessionExpiration");
    localStorage.removeItem("user");
    return response;
  } catch (error) {
    console.error("로그아웃 중 오류 발생:", error);
    throw error;
  }
};

export const getUsersInfo = async () => {
  const response = await api.get("/users/user-info");
  return response.data;
};

// 리프레쉬 토큰
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  console.log(refreshToken);
  if (!refreshToken) throw new Error("Refresh token 없음");

  console.log("서버에 전달할 refreshToken:", refreshToken);

  const response = await api.post("/oauth/reissuetoken", {
    refreshToken: refreshToken,
  });

  console.log("서버로부터 받은 새 accessToken:", response.data?.jwtToken);

  return response.data.jwtToken;
};
