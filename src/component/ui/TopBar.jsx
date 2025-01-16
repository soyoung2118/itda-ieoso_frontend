import styled from "styled-components";
import Logo from '../img/itda_logo.svg';

export default function TopBar(){
    return(
        <Wrapper>
            <img src={Logo} style={{width: "126px", height: "33px"}}/>
            <UserContainer>
            </UserContainer>
        </Wrapper>
    )
}

const Wrapper = styled.div`
  display: flex;
  height: 7vh;
  align-items: center;
  justify-content: space-between;
  padding: 0px 36px;
  background-color: #FFFFFF;
`

const UserContainer = styled.div`
  
`