import { useState, useContext } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import ClassSidebar from "../../ui/class/ClassSidebar";
import ClassThumbnail from "../../img/class/class_thumbnail.svg";
import EditBtn from "../../img/class/edit_btn.svg";
import EditedBtn from "../../img/class/edited_btn.svg";
import { Section } from "../../ui/class/ClassLayout";
import ReactQuill from "react-quill-new"; 
import "react-quill-new/dist/quill.snow.css";
import api from "../../api/api";
import { UsersContext } from "../../contexts/usersContext";

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
    font-size: 1.2rem;
    font-weight: 500;
  }
`;

const Content = styled.div`
  width: 100%;
  min-height: 50vh;
  height: auto;
  background-color: #FFFFFF;
  box-sizing: border-box;
  padding: ${({ isEditing }) => (isEditing ? "0px" : "42px 0px")};
  box-shadow: ${({ isEditing }) => (isEditing ? "-4px 0 0 #FF4747" : "none")};
`;

const StyledQuill = styled(ReactQuill)`
  width: 100%;
  max-width: 1200px;
  
  .ql-toolbar {
    order: 2;
  }

  .ql-container {
    order: 1;
    border: none;
    box-sizing: border-box;
  }

  .ql-editor {
    font-size: 1rem;
    font-family: 'Pretendard', sans-serif !important;
    padding: 10px 33px !important;
    line-height: 2.2 !important;
  }
`;

const StyledButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.8rem;
  cursor: pointer;
  border: none;
  background-color: transparent;
`;

const EditableSectionContent = ({ content, onChange, isEditing }) => {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [{ indent: "-1" }, { indent: "+1" }],
    ],
  };

  const modulesToUse = isEditing ? modules : { toolbar: false };

  return (
    <StyledQuill
      key={isEditing ? "editing" : "readOnly"}
      value={content}
      onChange={isEditing ? onChange : () => {}}
      readOnly={!isEditing}
      modules={modulesToUse}
      theme="snow"
    />
  );
};

const ClassOverview = () => {
  const context = useOutletContext();
  const courseData = context?.courseData || {};
  const isCreator = context?.isCreator || false;
  const { courseId } = useParams();
  const { user } = useContext(UsersContext);

  const [sectionContent, setSectionContent] = useState(
    courseData.courseDescription || ""
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveClick = async () => {
    try {
      await api.put(
        `/courses/${courseId}/${user.userId}/overview?description=${sectionContent}`,
        {
          courseDescription: sectionContent,
        }
      );
      setIsEditing(false);
    } catch (error) {
      console.error(
        "수정 후 저장 요청 중 오류 발생:",
        error.response ? error.response.data : error.message
      );
    }
  };

  if (!courseData) {
    return <div>로딩 중...</div>;
  }

  return (
        <div style={{ display: "flex", marginTop: "1rem" }}>
          <ClassSidebar style={{ marginRight: "2rem" }} />
          <main
            style={{
              flex: 1,
              backgroundColor: "#f9f9f9",
              padding: "0rem",
              borderRadius: "8px",
              marginTop: "0.5rem",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "0rem" }}>
              <img
                src={courseData.courseThumbnail || ClassThumbnail}
                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                alt="Class Thumbnail"
              />
            </div>
            <Section style={{ marginTop: "2rem" }}>
              <span
                style={{
                  fontSize: "2rem",
                  fontWeight: "900",
                }}
              >
                {courseData.courseTitle}
              </span>
              <IconRow style={{ marginTop: "2rem" }}>
                <span className="material-symbols-outlined">event</span>
                <span>
                  {" "}
                  {courseData.startDate
                    ? courseData.startDate
                    : "시작 날짜 미정"}
                </span>
              </IconRow>
              <IconRow>
                <span className="material-symbols-outlined">video_library</span>
                <span>
                  {courseData.durationWeeks > 0
                    ? `${courseData.durationWeeks}주 커리큘럼`
                    : "기간 미정"}
                </span>
              </IconRow>
              <IconRow>
                <span className="material-symbols-outlined">person</span>
                <span>{courseData.instructorName}</span>
              </IconRow>
            </Section>

            <h1
              style={{
                fontSize: "1.8rem",
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
      {isCreator && (
        <StyledButton
          onClick={() => {
            if (isEditing) {
              handleSaveClick();
            } else {
              setIsEditing(true);
            }
          }}
        >
          <img
            src={isEditing ? EditedBtn : EditBtn}
            alt="Edit Button"
            style={{ width: "100%" }}
          />
        </StyledButton>
      )}
    </div>
  );
};

export default ClassOverview;
