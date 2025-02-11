import { useState } from "react";
import styled from "styled-components";
import TopBar from "../../ui/TopBar";
import ClassTopbar from "../../ui/class/ClassTopbar";
import { PageLayout } from "../../ui/class/ClassLayout";
import Container from "../../ui/Container";
import ClassSidebar from "../../ui/class/ClassSidebar";
import api from "../../api/api";

const NoticeTitle = styled.h3`
  font-size: 2.3rem;
  font-weight: 700;
  color: var(--black-color);
  margin-bottom: 1rem;
  margin-left: 1rem;
  letter-spacing: -2px;
  margin-top:1rem;
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

  // 미정 - courseId와 userId를 가져오는 방식에 따라 수정
  const courseId = localStorage.getItem("courseId");
  const userId = localStorage.getItem("userId");
  //

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(`/announcements/${courseId}/${userId}`, {
        title,
        content,
      });


      if (response.data.success) {
        alert("공지사항이 게시되었습니다.");
        setTitle("");
        setContent("");
      } else {
        alert(`공지 생성 실패: ${response.data.message}`);
      }
    } catch (error) {
      console.error("공지 생성 오류:", error);
      alert("공지사항을 생성하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <TopBar />
      <PageLayout>
        <ClassTopbar activeTab="overview" />
        <div style={{ display: "flex", marginTop: "1rem" }}>
          <ClassSidebar style={{ marginRight: "2rem" }} />
          <main style={{ display: "flex", flexDirection: "column", width:"80.8%"}}>
            <NoticeTitle>공지사항 작성</NoticeTitle>
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
          </main>
        </div>
      </PageLayout>
    </div>
  );
};

export default NoticeCreateForm;
