import styled from "styled-components";

export default function TopBar(){
    return(
        <Wrapper>
            <MainTitle>
                Itda
            </MainTitle>

        </Wrapper>
    )
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #FFFFFF;
`

const MainTitle = styled.div`
  color: var(--red-color);
`