import styled from "styled-components";
import TopBar from "../ui/TopBar";
import logoImage from "../img/logo/itda_logo_symbol.svg";
import userIcon from "../img/mainpage/usericon.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Participate() {
  const navigate = useNavigate();
  const userName = "홍길동";
  const [code, setCode] = useState("");

  function validateLoginInput() {
    if (code.trim() === '') {
        alert('강의실 입장코드를 입력해 주세요.');
        return false;
    }
    return true;
  }

  return (
    <>
      <Header>
        <TopBar backgroundColor="#F6F7F9" />
        <div className="header-right">
          <UserIcon src={userIcon} alt="user icon" />
          <UserName>{userName}님</UserName>
        </div>
      </Header>
      <Container marginTop="100px">
        <LogoImage src={logoImage} alt="logo" />
        <LogoText>Start your itda</LogoText>
        <Explain>공유 받은 강의 공간 입장 코드를 입력해주세요.</Explain>
        <div style={{ width: '40%', margin: '0 auto' }}>
          <Form>
            <Label>강의실 입장코드</Label>
            <LoginInput 
              type="text" 
              placeholder="코드를 입력해주세요."
              onChange={(e) => setCode(e.target.value)}
              value={code} 
            />
            
            <LoginButton style={{ fontSize: '1rem' }} onClick={() => {
              if (validateLoginInput()) {
                navigate('/class');
              }
            }}>강의실 입장하기</LoginButton>
          </Form>
        </div>
      </Container>
    </>
  );
}

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .godashboard{
      background-color: transparent;
      color: #000;
      border: 1px solid #000;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 60px;
    }
`;

const UserIcon = styled.img`
    width: 40px;
    height: 40px;
`;

const UserName = styled.div`
    font-size: 14px;
    margin-right: 20px;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background-color: #FFFFFF;
    height: calc(100vh - 7vh);
    width: 100%;
    padding-top: 8rem;
`;

export const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const LogoImage = styled.img`
    width: 70px;
    margin-bottom: 1rem;
`;

const LogoText = styled.div`
    font-size: 2rem;
    font-weight: 900;    margin-bottom: 10px;
`;

const Explain = styled.div`
    font-size: 1rem;
    font-weight: 400;
    color: #989898;
    margin-bottom: 20px;
`;

const Form = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    font-weight: 900;
`;

const LoginInput = styled.input`
    padding: 0.8rem;
    margin-bottom: 1rem;
    border: 1px solid #CDCDCD;
    border-radius: 10px;
    font-size: 1rem;

    &::placeholder {
        color: #CDCDCD;
    }
`;

const LoginButton = styled.button`
    padding: 0.8rem;
    background-color: #FF4747;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 600;
`;