import { useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { UsersContext } from "../contexts/usersContext";
import styled from "styled-components";
import Logo from '../img/logo/itda_logo.svg';
import userIcon from "../img/mainpage/usericon.png";


export default function TopBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const { isUser } = useContext(UsersContext);

    return (
        <Wrapper>
            <img src={Logo} style={{ width: "126px", height: "33px" }} alt="itda logo" onClick={() => navigate('/class')}/>
            <Header>
                <div className="header-right">
                    {isUser ? (
                        <UserContainer>
                            {location.pathname === '/dashboard' ? (
                                <button className="navigate-button" onClick={() => navigate('/class')}>강의실 입장하기</button>
                            ) : (
                                <button className="navigate-button" onClick={() => navigate('/dashboard')}>대시보드로 가기</button>
                            )}
                            <UserIcon src={userIcon} alt="user icon" />
                        </UserContainer>
                    ) : (
                        <>
                            <button className="signup" onClick={() => navigate('/signup')}>회원가입</button>
                            <button className="login" onClick={() => navigate('/login')}>로그인</button>
                            <UserContainer>
                                <UserIcon src={userIcon} alt="user icon" />
                                <UserText>로그인하세요</UserText>
                            </UserContainer>
                        </>
                    )}
                </div>
            </Header>
        </Wrapper>
    );
}

const Wrapper = styled.div`
  display: flex;
  height: 7vh;
  align-items: center;
  justify-content: space-between;
  padding: 1px 10px 1px 36px;
  background-color: #FFFFFF;
`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 1vw;

    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .signup {
      background-color: transparent;
      color: #000000;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
    }

    .login {
      background-color: #FF4747;
      color: rgb(255, 255, 255);
      border: none;
      padding: 10px 20px;
      border-radius: 50px;
      cursor: pointer;
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

`;

const UserContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 8px;
`;

const UserIcon = styled.img`
    width: 40px;
    height: 40px;
    margin-right: 10px;
`;

const UserText = styled.p`
    color: #AAAAAA;
    font-size: 14px;
    margin: 0;
`;