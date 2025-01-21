import ClassTopbar from "../../ui/class/ClassTopbar";
import ClassSidebar from "../../ui/class/ClassSidebar";
import { useState } from "react";
import ClassThumbnail from "../../img/class/class_thumbnail.svg";
import userIcon from "../../img/mainpage/usericon.png";
import TopBar from "../../ui/TopBar";
import styled from "styled-components";
import { PageLayout, Section } from "../../ui/class/ClassLayout";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #FFFFFF;
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
    margin-right: 15px;
`;

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
  padding: ${({ isEditing }) => isEditing ? "0px" : "45px"};
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
        ...style,
      }}
    />
  ) : (
    <span style={style}>{value}</span>
  );
};

const StyledQuill = styled(ReactQuill)`
  width: 100%;
  .ql-toolbar {
    order: 2;
  }
  .ql-container {
    order: 1;
    border: none;
    font-size: 1rem;
    box-sizing: border-box;
  }
  .ql-editor {
    font-size: 1rem; /* ReactQuill과 동일한 크기 */
    line-height: 2.2; /* ReactQuill 기본 줄 간격 */
    padding: 12px 40px; /* ReactQuill 내부 여백 */
    white-space: pre-wrap; /* 줄바꿈 처리 */
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
    ],
  };

  return isEditing ? (
    <StyledQuill
      value={content}
      onChange={onChange}
      modules={modules}
      bounds=".quill-editor"
    />
  ) : (
    <div className="quill-editor" dangerouslySetInnerHTML={{ __html: content }} />
  );
};

const ClassOverview = () => {
  const navigate = useNavigate();
  const items = ["강의 개요", "강의 공지"];
  const [activeItem, setActiveItem] = useState("강의 개요");
  const routes = ["/overview/info", "/overview/notice"];
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("bod 다이어리 1000% 활용하기");
  const [sectionContent, setSectionContent] = useState(`
    <h2>저와 함께 인생의 센스를 길러보아요</h2>
    <p>다이어리를 잘 활용한다면 우리의 일상을 알차고 의미있게 보낼 수 있어요.</p>
    <p>스티커를 붙이고, 적절하게 그날의 제목을 표시하고, 납비를 기록하기도 하고, 해야할 일을 정리하기도 하는 소중한 다이어리!</p>
    <p>저와 함께 나만의 다이어리 한 권 꼭 채우기에 도전해보아요.</p>
  `);
  const [thumbnailSrc, setThumbnailSrc] = useState(ClassThumbnail);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    console.log("저장된 내용:", sectionContent);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Header>
        <TopBar />
        <div className="header-right">
          <button className="godashboard" onClick={() => navigate('/dashboard')}>대시보드로 가기</button>
          <UserIcon src={userIcon} alt="user icon" />
        </div>
      </Header>
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
                style={{ width: "100%", height: "100%", maxWidth: "950px", maxHeight: "600px", borderRadius: "8px", cursor: isEditing ? "pointer" : "default" }}
                alt="Class Thumbnail"
                onClick={isEditing ? () => document.getElementById('fileInput').click() : undefined}
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
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
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
