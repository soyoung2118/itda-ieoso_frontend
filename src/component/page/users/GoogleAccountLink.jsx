import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/api';
import { getUsersInfo } from '../../api/usersApi';
import { UsersContext } from '../../contexts/usersContext';
import { useContext } from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: white;
`;

const LoadingSpinner = styled.div`
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 18px;
  color: #333;
  margin-top: 20px;
`;

const ErrorText = styled.p`
  font-size: 16px;
  color: #e74c3c;
  margin-top: 20px;
  text-align: center;
  max-width: 80%;
`;

export default function GoogleAccountLink() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(UsersContext);
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const processAccountLinking = async () => {
      try {
        console.log('구글 계정 연동 처리 시작');
        const currentToken = localStorage.getItem('token');
        console.log('현재 로그인 토큰:', currentToken ? currentToken.substring(0, 20) + '...' : 'null');

        if (!currentToken) {
          throw new Error('로그인 상태가 아닙니다. 먼저 로그인해주세요.');
        }
        
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        
        if (code && currentToken) {
          console.log('==== 구글 계정 연동 콜백 처리 ====');
          console.log('로컬 스토리지 토큰:', currentToken.substring(0, 20) + '...');
          console.log('인증 코드 추출 성공:', code.substring(0, 10) + '...');
          
          try {
            console.log('요청에 사용되는 토큰:', currentToken ? `${currentToken.substring(0, 20)}...` : '토큰 없음');
            
            // 요청 헤더 전체를 로깅
            console.log('요청 헤더:', {
              "Content-Type": "application/json",
              "Authorization": currentToken ? `Bearer ${currentToken}` : '토큰 없음',
              // 기타 헤더들...
            });

            const response = await api.get(`/oauth/return/uri/temp?code=${code}`);
            
            console.log('API 응답 받음:', response.status);
            console.log('응답 헤더:', response.headers);
            console.log('응답 데이터:', response.data);
            
            if (!response.data) {
              throw new Error('응답 데이터가 없습니다');
            }
            
            console.log('구글 계정 연동 성공');

            // 응답에서 JWT 토큰 추출 (대소문자 구분 없이 확인)
            const newToken = response.headers?.authorization || 
                            response.headers?.Authorization || 
                            response.data?.jwtToken;
                            
            console.log('추출된 새 토큰:', newToken ? '있음' : '없음');
            
            if (newToken && newToken !== currentToken) {
              const finalToken = newToken.startsWith('Bearer ') ? newToken.replace('Bearer ', '') : newToken;
              console.log('JWT 토큰이 갱신되었습니다.');
              localStorage.setItem('token', finalToken);
              api.defaults.headers.common['Authorization'] = `Bearer ${finalToken}`;
              
              // 토큰 만료 시간 재설정 (10시간)
              const expirationTime = new Date().getTime() + 36000000;
              localStorage.setItem('tokenExpiration', expirationTime);
            } else {
              console.log('JWT 토큰이 갱신되지 않았습니다.');
            }
            
            // 사용자 정보 업데이트
            const userInfo = await getUsersInfo();
            setUser(userInfo.data);
            localStorage.setItem('user', JSON.stringify(userInfo.data));
            
            setStatus('success');
            
            // 성공 시 강의실 목록으로 리디렉션
            setTimeout(() => {
              window.location.href = '/class/list';
            }, 2000);
            
            return;
          } catch (error) {
            console.error('API 호출 중 오류 발생:', error);
            setStatus('error');
            setErrorMessage('구글 계정 연동 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message));
            setTimeout(() => navigate('/class/list'), 3000);
            return;
          }
        }
        
        console.error('URL에서 code 파라미터를 찾을 수 없습니다');
        setStatus('error');
        setErrorMessage('인증 정보를 찾을 수 없습니다.');
        setTimeout(() => navigate('/class/list'), 3000);
      } catch (error) {
        console.error('계정 연동 처리 중 오류 발생:', error);
        setStatus('error');
        setErrorMessage('계정 연동 처리 중 오류가 발생했습니다: ' + error.message);
        setTimeout(() => navigate('/class/list'), 3000);
      }
    };
    
    processAccountLinking();
  }, [location, navigate, setUser]);
  
  return (
    <LoadingContainer>
      {status === 'loading' && (
        <>
          <LoadingSpinner />
          <LoadingText>구글 계정 연동 중입니다...</LoadingText>
        </>
      )}
      
      {status === 'success' && (
        <>
          <LoadingSpinner />
          <LoadingText>구글 계정 연동 성공! 강의실 페이지로 이동합니다...</LoadingText>
        </>
      )}
      
      {status === 'error' && (
        <>
          <ErrorText>{errorMessage}</ErrorText>
          <LoadingText>잠시 후 강의실 페이지로 이동합니다...</LoadingText>
        </>
      )}
    </LoadingContainer>
  );
}