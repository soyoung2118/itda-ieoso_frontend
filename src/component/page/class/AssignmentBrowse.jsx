import { useState } from "react";
import styled from "styled-components";

const AssignmentBrowse = () => {
  return (
    <Container>
      <ContentWrapper>
        <Title>다른 수강생 과제 둘러보기</Title>
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
`;

const ContentWrapper = styled.div`
  padding: 32px;
  
  @media (max-width: 1023px) {
    padding: 24px 16px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #222;
  margin: 0;
  
  @media (max-width: 1023px) {
    font-size: 20px;
  }
`;

export default AssignmentBrowse;
