import styled from "styled-components";
import PropTypes from "prop-types";
import ClassThumbnail from "../../img/class/class_thumbnail.svg";
import PlayIcon from "../../img/class/play_icon.svg";
import Material from "../../img/icon/curriculum/materialicon.svg";
import Assignment from "../../img/icon/curriculum/assignmenticon.svg";
import EditContainer from "../../ui/curriculum/EditContainer";
import EditableSection from "./EditableSection";
import { getYouTubeThumbnail } from "./EditableSection";
import { formatDate } from "../../page/class/Curriculum";

const Section = styled.div`
  display: flex;
  padding: 2.1vh 2.6vh;
  border-radius: 12px;
  margin: 1rem 0rem;
  background-color: #ffffff;
  position: relative;
  cursor: pointer;
  width: 100%;

  @media (max-width: 1024px) {
    padding: 1.5vh 1.8vh;
  }

  @media (max-width: 768px) {
    border-radius: 10px;
    margin: 0.6vh 0vh;
  }
  @media (max-width: 480px) {
    border-radius: 6px;
    margin: 0.6vh 0vh;
  }
`;

const CurriculumTitle = styled.h3`
  font-size: 1.63rem;
  font-weight: 700;
  margin-bottom: -0.3rem;
  margin-top: 0.5rem;

  @media (max-width: 1024px) {
    font-size: 22px;
  }

  @media (max-width: 768px) {
    font-size: 17px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
    
  @media (max-width: 376px) {
    font-size: 9.4px;
  }
`;

const VideoContainer = styled.div`
  position: relative;
  width: 22%;
  aspect-ratio: 4 / 2.6;
  border-radius: 8px;

  @media (max-width: 1024px) {
    width: 30%;
  }

  @media (max-width: 768px) {
    width: 27%;
  }
  @media (max-width: 480px) {
    border-radius: 4px;
  }
`;

const VideoContents = styled.div`
  margin-left: 2rem;

  @media (max-width: 768px) {
    margin-left: 1.8vh;
  }
`;

const VideoThumbnail = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;

const EmptyVideoThumbnail = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: solid 1.5px #c3c3c3;

  @media (max-width: 768px) {
    border-radius: 6px;
    border: solid 1.3px #c3c3c3;
  }
`;

const Play = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1.8rem;
  height: auto;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 2vh;
  }

  @media (max-width: 480px) {
    width: 2.5vh;
  }
`;

const VideoDetails = styled.p`
  font-size: 16.5px;
  color: var(--black-color);
  display: flex;
  align-items: center;
  gap: 1vh;

  @media (max-width: 1024px) {
    gap: 0.5vh;
    font-size: 11.5px;
  }

  @media (max-width: 768px) {
    font-size: 9px;
  }

  @media (max-width: 480px) {
    font-size: 7px;
  }
`;

const BlackLine = styled.span`
  border-left: 1.5px solid black;
  height: 1rem;
  margin-left: 1vh;

  @media (max-width: 1024px) {
    margin-left: 0.5vh;
  }
  @media (max-width: 768px) {
    border-left: 1px solid black;
  }

  @media (max-width: 480px) {
    border-left: 0.5px solid black;
  }
`;

const MaterialSection = styled.div`
  display: flex;
  background-color: var(--lightgrey-color);
  width: 100%;
  padding: 2.2vh 2.6vh;
  border-radius: 8px;
  font-size: 1.07rem;

  @media (max-width: 1024px) {
    padding: 1vh 1vh;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    padding: 1vh 1vh;
    font-size: 10.5px;
  }

  @media (max-width: 480px) {
    border-radius: 5px;
    padding: 1.5vh 2vh;
    font-size: 7px;
  }
`;

const MaterialIcon = styled.img`
  width: 2.4rem;
  margin-left: 1rem;
  margin-right: 3rem;

  @media (max-width: 1024px) {
    width: 2.4vh;
    margin-left: 0vh;
    margin-right: 1.5vh;
  }

  @media (max-width: 480px) {
    margin-left: 1vh;
    margin-right: 1.5vh;
  }
`;

const AssignmentTitle = styled.span`
  flex-shrink: 1;
  overflow: hidden;
  margin-right: 0.8rem;
`;

const AssignmentDate = styled.span`
  color: var(--main-color);
  whitespace: nowrap;
  flexshrink: 0;
  margin-left: 1vh;

  @media (max-width: 1024px) {
    font-size: 12px;
    margin-left: 0.6vh;
  }
  @media (max-width: 768px) {
    font-size: 9.5px;
    margin-left: 0.3vh;
  }
  @media (max-width: 480px) {
    font-size: 6px;
    margin-left: 0vh;
  }
`;

const formatPeriod = (startDate, endDate) => {
  return startDate && endDate ? `${startDate} ~ ${endDate}` : "기간 미정";
};

const CurriculumSection = ({
  lecture,
  subSection,
  index,
  handleAdd,
  handleDelete,
  handleSectionClick,
  onDateChange,
  editTarget,
  updateSection,
}) => {
  const isEditing = subSection.isEditing;

  const truncatedText = (text) => {
    if (!text) return "";

    const width = window.innerWidth;

    let maxLength = 10;
    if (width >= 1024) maxLength = 20;
    else if (width >= 768) maxLength = 15;
    else if (width >= 480) maxLength = 9;

    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const materialTruncatedText = (text) => {
    if (!text) return "";

    const width = window.innerWidth;

    let maxLength = 10;
    if (width >= 1024) maxLength = 30;
    else if (width >= 768) maxLength = 20;
    else if (width >= 480) maxLength = 15;

    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <Section onClick={(event) => handleSectionClick(index, event)}>
      {isEditing ? (
        <div style={{ display: "flex", width: "100%", position: "relative" }}>
          <EditContainer handleAdd={handleAdd} index={index} />

          <EditableSection
            subSection={subSection}
            index={index}
            handleDelete={handleDelete}
            className="editable-section"
            onDateChange={onDateChange}
          />
        </div>
      ) : (
        <>
          {subSection.contentType === "video" && (
            <>
              <VideoContainer>
                {subSection.videoUrl ? (
                  <VideoThumbnail
                    src={getYouTubeThumbnail(subSection.videoUrl)}
                    alt="Video Thumbnail"
                  />
                ) : (
                  <EmptyVideoThumbnail />
                )}
                <Play src={PlayIcon} alt="Play Icon" />
              </VideoContainer>
              <VideoContents>
                <CurriculumTitle>
                  {subSection.title ?? "영상 제목 없음"}
                </CurriculumTitle>

                <VideoDetails>
                  <div style={{ whiteSpace: "nowrap" }}>
                    <span>{lecture.instructorName}</span>
                    <BlackLine />
                  </div>

                  <span
                    style={
                      {
                        // whiteSpace: "nowrap",
                      }
                    }
                  >
                    {formatDate(subSection?.startDate)} ~{" "}
                    {formatDate(subSection?.endDate)}
                  </span>
                </VideoDetails>
              </VideoContents>
            </>
          )}

          {subSection.contentType === "material" && (
            <>
              <MaterialIcon src={Material} />
              <MaterialSection>
                <span style={{ marginRight: "0.6rem" }}>
                  {materialTruncatedText(subSection.originalFilename) ??
                    "자료 없음"}
                </span>
                <span
                  style={{
                    color: "var(--main-color)",
                  }}
                >
                  {subSection.fileSize ?? " "}
                </span>
              </MaterialSection>
            </>
          )}

          {subSection.contentType === "assignment" && (
            <>
              <MaterialIcon src={Assignment} alt="assignment icon" />
              <MaterialSection>
                <AssignmentTitle>
                  {truncatedText(subSection.assignmentTitle) ?? "과제 없음"}
                </AssignmentTitle>
                <AssignmentDate>
                  {formatDate(subSection?.startDate)} ~{" "}
                  {formatDate(subSection?.endDate)}
                </AssignmentDate>
              </MaterialSection>
            </>
          )}
        </>
      )}
    </Section>
  );
};

export default CurriculumSection;
