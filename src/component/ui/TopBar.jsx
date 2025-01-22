import styled from "styled-components";
import Logo from '../img/itda_logo.svg';

// 배경 색상 변경 로직 
// eslint-disable-next-line react/prop-types
export default function TopBar({ backgroundColor }) {
    return (
        <Wrapper backgroundColor={backgroundColor}>
            <img src={Logo} style={{ width: "126px", height: "33px" }} alt="itda logo" />
            <UserContainer>
            </UserContainer>
        </Wrapper>
    );
}

const Wrapper = styled.div`
  display: flex;
  height: 7vh;
  align-items: center;
  justify-content: space-between;
  padding: 0px 36px;
  background-color: ${({ backgroundColor }) => backgroundColor || '#FFFFFF'};
`;

const UserContainer = styled.div`
  
`;