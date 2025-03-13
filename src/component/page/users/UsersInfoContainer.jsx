import { useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import userIcon from "../../img/icon/usericon.svg";
import { logout } from "../../api/usersApi";
import { UsersContext } from "../../contexts/usersContext";
import PropTypes from 'prop-types';

export function UsersInfoContainer({ setShowUsersInfoContainer }) {

    const { user, setUser, setIsUser } = useContext(UsersContext);
    const navigate = useNavigate();

    // 드롭다운 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setShowUsersInfoContainer(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setShowUsersInfoContainer]);

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const response = await logout();
            if (response.status === 200) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setIsUser(false);
                setUser(null);
                navigate('/');
            }
        } catch (error) {
            console.error('로그아웃 중 오류 발생:', error);
        }
    };

    const handleChangePassword = () => {
        navigate('/change-password');
    }

    return (
        <Dropdown className="dropdown-container">
            <DropdownContainer>
                <UserInfo>
                    <img src={userIcon} alt="user icon" className="user-info-profile" />
                    <UserText>
                        <div className="user-info-name">{user.name}</div>
                        <div className="user-info-email">{user.email}</div>
                    </UserText>
                </UserInfo>
                <div className="button-container">
                    <button className="user-button" onClick={handleChangePassword}>비밀번호 변경</button>
                    <button className="user-button" onClick={handleLogout}>로그아웃 하기</button>
                </div>
            </DropdownContainer>
        </Dropdown>
    );
}

// 스타일링 유지
const Dropdown = styled.div`
    position: absolute;
    top: 8vh;
    right: 0;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
`;

const DropdownContainer = styled.div`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    width: 100%;

    .button-container {
        display: flex;
        margin-top: 12px;
    }

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
        white-space: nowrap;
    }

    .user-info-email {
        margin-top: 4px;
        font-size: 12px;
        font-weight: 200;
    }

    .user-button {
        font-size: 12px;
        font-weight: 300;
        background-color: transparent;
        border: 1px solid #000000;
        margin: 0 5px;
        padding: 5px 10px;
        border-radius: 60px;
        cursor: pointer;
        white-space: nowrap;
    }
`;

const UserInfo = styled.div`
  display: flex;  
`;

const UserText = styled.div`
    margin-left: 10px;
`;

// PropTypes 설정
UsersInfoContainer.propTypes = {
    setShowUsersInfoContainer: PropTypes.func.isRequired,
};