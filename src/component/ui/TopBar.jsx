import { useState, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import styled from "styled-components";
import LogoImage from '../img/logo/itda_logo.svg';
import userIcon from "../img/icon/usericon.svg";
import { UsersContext } from "../contexts/usersContext";
import { UsersInfoContainer } from '../page/users/UsersInfoContainer';

export default function TopBar() {

    const navigate = useNavigate();
    const location = useLocation();
    const { isUser } = useContext(UsersContext);
    
    // 드롭다운 상태 추가
    const [showUsersInfoContainer, setShowUsersInfoContainer] = useState(false);

    const handleUserIconClick = () => {
        setShowUsersInfoContainer(prev => !prev);  // 드롭다운 토글
    };

    return (
        <Wrapper>
            <Logo
                src={LogoImage} 
                alt="itda logo" 
                onClick={isUser ? () => navigate('/class/list') : () => navigate('/')}
            />
            <Header>
                {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !=="/find-password" &&(
                    <div className="header-right">
                        {isUser ? (
                            <UserContainer>
                                {location.pathname === '/dashboard' ? (
                                    <button className="navigate-button" onClick={() => navigate('/class/list')}>강의실 입장하기</button>
                                ) : (
                                    <button className="navigate-button" onClick={() => navigate('/dashboard')}>대시보드로 가기</button>
                                )}
                                <UserIcon src={userIcon} alt="user icon" onClick={handleUserIconClick} />
                                {showUsersInfoContainer && (
                                    <UsersInfoContainer setShowUsersInfoContainer={setShowUsersInfoContainer} />
                                )}
                            </UserContainer>
                        ) : (
                            <>
                                <button className="signup" onClick={() => navigate('/signup')}>회원가입</button>
                                <button className="login" onClick={() => navigate('/login')}>로그인</button>
                                <UserContainer>
                                    <UserIcon src={userIcon} alt="user icon" />
                                </UserContainer>
                            </>
                        )}
                    </div>
                )}
            </Header>
        </Wrapper>
    );
}

const Wrapper = styled.div`
  display: flex;
  min-height: 70px;
  height: 7vh;
  align-items: center;
  justify-content: space-between;
  padding: 1px 10px 1px 20px;
  background-color: #FFFFFF;

    @media all and (max-width:479px) {
        padding: 1px 2px 1px 18px;
    }
`;

const Logo = styled.img`
    width: 126px;
    height: 33px;
    cursor: pointer;
    
    /* 모바일 세로 (해상도 ~ 479px)*/ 
    @media all and (max-width:479px) {
        padding: 0;
        width: 75px;
    }
`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;

          
    /* 모바일 세로 (해상도 ~ 479px)*/ 
    @media all and (max-width:479px) {
        padding: 0px;
    }
    }

    .signup {
      min-width: 90px;
      background-color: transparent;
      color: #000000;
      border: none;
      padding: 10px 20px;
      cursor: pointer;

    /* 모바일 세로 (해상도 ~ 479px)*/ 
    @media all and (max-width:479px) {
        min-width: 50px;
        font-size: 12px;
    }
    }

    .login {
      min-width: 80px;
      background-color: #FF4747;
      color: rgb(255, 255, 255);
      border: none;
      padding: 10px 20px;
      border-radius: 50px;
      cursor: pointer;


    /* 모바일 세로 (해상도 ~ 479px)*/ 
    @media all and (max-width:479px) {
        min-width: 50px;
        font-size: 12px;
    }
    }

    .navigate-button{
      background-color: transparent;
      color: #000;
      border: 1px solid #000;
      margin-right: 10px;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 60px;
          
    }

    @media all and (max-width:479px) {
        min-width: 50px;
        font-size: 12px;
    }
`;

const UserContainer = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    padding: 10px;
    border-radius: 8px;

`;

const UserIcon = styled.img`
    width: 40px;
    height: 40px;
    margin-right: 10px;
    cursor: pointer;

    /* 모바일 세로 (해상도 ~ 479px)*/ 
    @media all and (max-width:479px) {
        margin-right: 0px;
    }
`;
