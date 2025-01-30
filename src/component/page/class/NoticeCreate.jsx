import { useState } from "react";
import styled from "styled-components";
import TopBar from "../../ui/TopBar";
import ClassTopbar from "../../ui/class/ClassTopbar";
import { PageLayout } from "../../ui/class/ClassLayout";
import Container from "../../ui/Container";

const NoticeTitle = styled.h3`
  font-size: 2.3rem;
  font-weight: 700;
  color: var(--black-color);
  margin-bottom: 1rem;
  margin-left: 1rem;
  letter-spacing: -2px;
`;

const StyledInput = styled.input`
  width: 100%;
  border: 2px solid var(--neutralgrey-color);
  border-radius: 10px;
  padding: 12px 15px;
  font-size: 1.35rem;
  margin-bottom: 2rem;
  margin-top: 0.7rem;
  font-family: Pretendard, sans-serif;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  border: 2px solid var(--neutralgrey-color);
  border-radius: 10px;
  padding: 12px 15px;
  font-size: 1.35rem;
  margin-bottom: 1rem;
  margin-top: 0.7rem;
  font-family: Pretendard, sans-serif;
  resize: none;
`;

const StyledButton = styled.button`
  background-color: var(--main-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 13px 30px;
  font-size: 1.35rem;
  font-weight: bold;
  cursor: pointer;
  margin-left: auto;
  display: block;
  margin-right: -2.1rem;
  margin-bottom: 1rem;
`;

const NoticeCreateForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, content });
    alert("공지사항이 게시되었습니다.");
    setTitle("");
    setContent("");
  };
  return (
    <div>
      <TopBar />
      <PageLayout>
        <ClassTopbar activeTab="overview" />
        <NoticeTitle>강의 공지 작성</NoticeTitle>
        <Container style={{ padding: "2rem", paddingRight: "4.3rem" }}>
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="title"
              style={{ fontSize: "1.5rem", fontWeight: "600" }}
            >
              제목
            </label>
            <StyledInput
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <label
              htmlFor="content"
              style={{ fontSize: "1.5rem", fontWeight: "600" }}
            >
              내용
            </label>
            <StyledTextarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="15"
              required
            ></StyledTextarea>
            <StyledButton type="submit">게시하기</StyledButton>
          </form>
        </Container>
      </PageLayout>
    </div>
  );
};

export default NoticeCreateForm;
