import { useState, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import styled from "styled-components";
import Logo from '../img/logo/itda_logo.svg';
import userIcon from "../img/icon/usericon.svg";
import { UsersContext } from "../contexts/usersContext";
import { logout } from "../api/usersApi";

export default function TopBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);
    const { isUser, setIsUser } = useContext(UsersContext);

    const handleUserIconClick = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            const response = await logout();

            if (response.status === 200) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                setIsUser(false);
                navigate('/');
            }


        } catch (error) {
            console.error('로그아웃 중 오류 발생:', error);
        }
    };



    return (
        <Wrapper>
            <img src={Logo} style={{ width: "126px", height: "33px" }} alt="itda logo" onClick={isUser ? () => navigate('/class') : () => navigate('/')}/>
            <Header>
                <div className="header-right">
                    {isUser ? (
                        <UserContainer>
                            {location.pathname === '/dashboard' ? (
                                <button className="navigate-button" onClick={() => navigate('/class')}>강의실 입장하기</button>
                            ) : (
                                <button className="navigate-button" onClick={() => navigate('/dashboard')}>대시보드로 가기</button>
                            )}
                            <UserIcon src={userIcon} alt="user icon" onClick={handleUserIconClick} />
                            {showDropdown && (
                                <Dropdown>
                                    <UserInfo>
                                        <img src={userIcon} alt="user icon" className="user-info-profile" />
                                        {/* 유저 이름으로 변경해야함 */}
                                        <p className="user-info-name">itdakim0101</p>
                                        <button className="user-info-logout-button" onClick={handleLogout}>로그아웃하기</button>
                                    </UserInfo>
                                </Dropdown>
                            )}
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
    position: relative;
    padding: 10px;
    border-radius: 8px;
`;

const UserIcon = styled.img`
    width: 40px;
    height: 40px;
    margin-right: 10px;
    cursor: pointer;
`;

const UserText = styled.p`
    color: #AAAAAA;
    font-size: 14px;
    margin: 0;
`;

// 유저 아이콘 누르면 출력 드롭 다운
const Dropdown = styled.div`
    position: absolute;
    top: 8vh;
    right: 0;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 2px 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
`;

const UserInfo = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    width: 100%;

    .user-info-profile {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
    }

    .user-info-name {
        font-size: 14px;
        font-weight: 500;
        margin-right: 10px;
    }

    .user-info-logout-button {
        font-size: 12px;
        font-weight: 500;
        background-color: transparent;
        border: 1px solid #000;
        margin-right: 10px;
        padding: 5px 10px;
        border-radius: 60px;
        cursor: pointer;
        white-space: nowrap;
    }
`;