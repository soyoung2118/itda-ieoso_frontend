import ClassTopbar from "../../ui/class/ClassTopbar";
import ClassSidebar from "../../ui/class/ClassSidebar";
import { useState, useEffect } from "react";
import ClassThumbnail from "../../img/class/class_thumbnail.svg";
import TopBar from "../../ui/TopBar";
import styled from "styled-components";
import { PageLayout, Section } from "../../ui/class/ClassLayout";
import ReactQuill from 'react-quill-new';  // 'react-quill' -> 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css';  // 'react-quill' -> 'react-quill-new'

const IconRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  color: var(--darkgrey-color);

  .material-symbols-outlined {
    font-size: 1.5rem;
    vertical-align: middle;
  }

  span {
    font-size: 0.95rem;
    font-weight: 500;
  }
`;

const Content = styled.div`
  width: 100%;
  min-height: 50vh;
  height: auto;
  background-color: #FFFFFF;
  gap: 1.5rem;
  box-sizing: border-box;
  padding: ${({ isEditing }) => isEditing ? "0px" : "33px 0px"};
  box-shadow: ${({ isEditing }) => isEditing ? "-4px 0 0 #FF4747" : "none"};
`;

// eslint-disable-next-line react/prop-types
const EditableText = ({ value, onChange, isEditing, style }) => {
  return isEditing ? (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width:"600px",
        border: "none",
        borderBottom: "2px solid #FF4747",
        outline: "none",
        fontFamily: 'Pretendard',
        ...style,
      }}
    />
  ) : (
    <span style={style}>{value}</span>
  );
};

const StyledQuill = styled(ReactQuill)`
  width: 100%;
  max-width: 1200px;
  
  .ql-toolbar {
    order: 2;
  }

  .ql-container {
    order: 1;
    border: none;
    font-size: 1rem;
    box-sizing: border-box;
    line-height: 2.2 !important; 
  }

  .ql-editor {
    font-size: 1rem;
    font-family: 'Pretendard', sans-serif !important;
    padding: 10px 33px !important;
    line-height: 2.2 !important; 
  }

  .ql-editor ol, .ql-editor ul {
    line-height: 1.5 !important;
    margin: 0;
    padding-left: 1.5em !important; 
  }

  .ql-editor ol li, .ql-editor ul li {
    line-height: 1.5 !important; 
    margin: 0 !important;
  }
  
  .ql-editor p {
    margin: 0 !important;
    padding: 0 !important;
  }

  .ql-editor br {
    display: block;
    line-height: 1.5 !important;
  }

  .ql-editor ul {
    list-style-type: disc !important;
  }

  .ql-editor ol {
    list-style-type: decimal !important;
  }
`;

// eslint-disable-next-line react/prop-types
const EditableSectionContent = ({ content, onChange, isEditing }) => {
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],        // 볼드체, 이텔릭체, 언더라인
      [{ 'list': 'ordered'}, { 'list': 'bullet' }], // 리스트
      ['link'],                               // 링크
      [{ 'indent': '-1'}, { 'indent': '+1' }], // 들여쓰기
      ['image'],                             // 이미지 삽입 버튼 추가
    ],
  };

  return isEditing ? (
    <StyledQuill
      value={content}
      onChange={onChange}
      modules={modules}
      bounds=".quill-editor"
      theme="snow"  // 테마 설정
    />
  ) : (
    <div className="quill-editor" style={{ padding: '10px 33px' }} dangerouslySetInnerHTML={{ __html: content }} />
  );
};

const ClassOverview = () => {
  const items = ["강의 개요", "강의 공지"];
  const [activeItem, setActiveItem] = useState("강의 개요");
  const routes = ["/overview/info/edit", "/overview/notice"];
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("bod 다이어리 1000% 활용하기");
  const [sectionContent, setSectionContent] = useState('');

  const [thumbnailSrc, setThumbnailSrc] = useState(ClassThumbnail);
  
  // 썸네일 이미지 로드 api
  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        const response = await fetch('https://api.example.com/thumbnail'); // API 엔드포인트
        const data = await response.json();
        if (response.ok) {
          setThumbnailSrc(data.imageUrl); // API에서 반환된 이미지 URL로 업데이트
        } else {
          console.error('이미지 로드 실패:', data.message);
        }
      } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
      }
    };

    fetchThumbnail();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    console.log("저장된 내용:", sectionContent);
  };

  return (
    <div>
      <TopBar />
      <PageLayout>
        <ClassTopbar activeTab="overview" />
        <div style={{ display: "flex", marginTop: "1rem" }}>
          <ClassSidebar
            items={items}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            routes={routes}
            style={{ marginRight: "2rem" }}
          />
          <main
            style={{
              flex: 1,
              backgroundColor: "#f9f9f9",
              padding: "0rem",
              borderRadius: "8px",
            }}
          >
            <div style={{ position: "relative", textAlign: "center", marginBottom: "0rem" }}>
              <img
                src={thumbnailSrc}
                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                alt="Class Thumbnail"
              />
              {isEditing && (
                <span className="material-icons" style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  fontSize: "56px",
                  pointerEvents: "none"
                }}>
                  camera_alt
                </span>
              )}
            </div>
            <Section
              style={{
                width: "100%",
                marginTop: "2rem",
                boxShadow: isEditing ? "-4px 0 0 #FF4747" : "none",
                boxSizing: "border-box",
              }}
            >
              <EditableText
                value={title}
                onChange={setTitle}
                isEditing={isEditing}
                style={{ fontSize: "1.7rem", fontWeight: "bolder", width: "100%" }}
              />
              <IconRow style={{ marginTop: "2rem" }}>
                <span className="material-symbols-outlined">event</span>
                <span>2025년 1월 2일 시작</span>
              </IconRow>
              <IconRow>
                <span className="material-symbols-outlined">video_library</span>
                <span>4주 커리큘럼</span>
              </IconRow>
              <IconRow>
                <span className="material-symbols-outlined">person</span>
                <span>김잇다</span>
              </IconRow>
            </Section>
            <div style={{ 
              textAlign: "right", 
              padding: "0 2rem", 
              display: "flex", 
              justifyContent: "flex-end" 
            }}>
              <button
                onClick={handleEditClick}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "#f44336",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button
                onClick={handleSaveClick}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "#9e9e9e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  marginLeft: "1rem",
                }}
              >
                <span className="material-symbols-outlined">check</span>
              </button>
            </div>

            <h1
              style={{
                fontSize: "1.7rem",
                fontWeight: "bold",
                margin: "2rem 1rem",
                textAlign: "left",
              }}
            >
              강의 소개
            </h1>
            <Content isEditing={isEditing}>
              <EditableSectionContent
                content={sectionContent}
                onChange={setSectionContent}
                isEditing={isEditing}
              />
            </Content>
          </main>
        </div>
      </PageLayout>
    </div>
  );
};

export default ClassOverview;
