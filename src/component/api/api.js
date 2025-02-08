import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//Axios 인스턴스 생성
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 요청 전에 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 응답 후 에러 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const navigate = useNavigate();
    if (error.response) {
      // 401 에러 (인증 실패 시 루트 페이지로 리다이렉트)
      if (error.response.status === 401) {
        alert('로그인이 필요합니다.');
        localStorage.removeItem('token'); // 토큰 삭제
        navigate('/'); // 루트 경로로 이동
      }

      // 기타 에러 처리
      console.error(`에러 발생: ${error.response.status}`, error.response.data);
    } else {
      console.error('서버 응답 없음', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
