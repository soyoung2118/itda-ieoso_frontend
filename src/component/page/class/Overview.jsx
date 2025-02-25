import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useOutletContext, useLocation } from "react-router-dom";
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
import EntryCodeModal from "../../ui/class/EntryCodeModal";

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
    font-size: 15px;
    font-weight: 500;
  }
`;

const Content = styled.div`
  width: 100%;
  border-radius: ${({ isEditing }) => (isEditing ? "0px" : "12px")};
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

const StyledButton = styled.a`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.8rem;
  cursor: pointer;
  border: none;
  background-color: transparent;
`;

const ImageContainer = styled.div`
  position: relative;
  text-align: center;
  margin-bottom: 0rem;

  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    cursor: pointer;
  }

  .camera-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: rgba(255, 255, 255, 0.7);
    display: ${({ isEditing }) => (isEditing ? "block" : "none")};
    pointer-events: none;
  }
`;

const Title = styled.div`
  font-size: 26px;
  font-weight: 800;
  text-align: left;
`

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

  const location = useLocation();
  const entrycode = location.state?.entrycode || null;
  const [isEntryCodeModalOpen, setIsEntryCodeModalOpen] = useState(false);

  const [sectionContent, setSectionContent] = useState(courseData.courseDescription || "");
  const [isEditing, setIsEditing] = useState(false);
  const [courseThumbnail, setCourseThumbnail] = useState(courseData.courseThumbnail || ClassThumbnail);
  const [newThumbnail, setNewThumbnail] = useState(null);
  const [files, setFiles] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (entrycode) setIsEntryCodeModalOpen(true);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // FileReader 사용 예시: 파일의 Base64 데이터를 콘솔에 출력
      const reader = new FileReader();
      reader.onload = () => {
        console.log("Base64 인코딩된 파일 데이터:", reader.result);
      };
      reader.readAsDataURL(file);

      // Blob URL 생성하여 미리보기 이미지로 사용
      const imageUrl = URL.createObjectURL(file);
      setNewThumbnail(imageUrl);
      setFiles([file]);
    } else {
      // 파일이 선택되지 않았을 경우 기본 썸네일로 설정
      setNewThumbnail(null);
    }
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleSaveClick = async () => {
    if (!user) return;

    const formData = new FormData();
    formData.append('textContent', sectionContent);

    // 파일 객체가 있을 경우 FormData에 첨부
    if (files && files.length > 0) {
      formData.append('courseThumbnail', files[0]);
    }

    // FormData 내용을 콘솔에 확인
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await api.put(
        `/courses/${courseId}/${user.userId}/overview?description=${encodeURIComponent(sectionContent)}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // 파일이 첨부된 경우 화면 업데이트
      if (files && files.length > 0) {
        const imageUrl = URL.createObjectURL(files[0]);
        setCourseThumbnail(imageUrl);
        setNewThumbnail(null);
        setFiles([]);
      }
      setIsEditing(false);

      if (response.status === 200) {
        console.log("수정 사항이 저장되었습니다.");
        window.location.reload(); //일단 이렇게 해둠 사용자 경험 때문에 수정 필요
      } else {
        console.log("수정 사항 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("수정 후 저장 요청 중 오류 발생:", error);
    }
  };

  if (!courseData) {
    return <div>로딩 중...</div>;
  }

  const changeDifficultly = (difficulty) => {
    if(difficulty === 'HARD') return '상'
    if(difficulty === 'MEDIUM') return '중'
    if(difficulty === 'EASY') return '하'
    return null
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
        <ImageContainer isEditing={isEditing} onClick={handleImageClick}>
          <img src={newThumbnail || courseThumbnail} alt="Class Thumbnail" />
          <span className="material-symbols-outlined camera-icon">camera_alt</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </ImageContainer>
        <Section style={{ marginTop: "2rem" }}>
          <Title>{courseData.courseTitle}</Title>
          <IconRow style={{ marginTop: "2rem" }}>
            <span className="material-symbols-outlined">event</span>
            <span>
              {courseData.startDate ? courseData.startDate : "시작 날짜 미정"}
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
          <IconRow style={{gap: '0rem'}}>
            <span className="material-symbols-outlined">star</span>
            <span style={{margin: '0rem 0.3rem 0rem 1rem'}}>강의 난이도</span>
            <span style={{marginLeft: 0, fontWeight: 800}}>{changeDifficultly(courseData.difficultyLevel)}</span>
          </IconRow>
        </Section>

        <Title style={{margin: '10px 5px'}}>강의 소개</Title>
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

      {isEntryCodeModalOpen && <EntryCodeModal entrycode={entrycode} onClose={() => setIsEntryCodeModalOpen(false)} />}
    </div>
  );
};

export default ClassOverview;
