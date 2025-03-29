import styled from "styled-components";
import PropTypes from "prop-types";
import Assignment from "../../img/icon/curriculum/assignmenticon.svg";
import Material from "../../img/icon/curriculum/materialicon.svg";
import Class from "../../img/icon/curriculum/videoicon.svg";
import SelectedSection from "../../img/class/check/sel_sec.svg";
import UnselectedSection from "../../img/class/check/unsel_sec.svg";
import DoneSection from "../../img/class/check/done_sec.svg";
import Check from "../../img/class/check/check.svg";
import { useState, useEffect, useContext } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { UsersContext } from "../../contexts/usersContext";

const SidebarContainer = styled.aside`
  width: 17%;
  height: 90vh;
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 3.5vh;
  letter-spacing: -0.5px;

  @media (max-width: 1024px) {
    font-size: 13px;
  }

  @media (max-width: 768px) {
  width: 16%;
    padding: 1vh 2vh;
    border-radius: 7px;
  }

  @media (max-width: 480px) {
    width: 20%;
  }
`;

const ListSection = styled.div`
  margin-bottom: -2vh;
  padding: 0.7rem 0rem;
  transition: background-color 0.3s ease;

  @media (max-width: 480px) {
    padding: 1vh 0vh;
  }
`;

const SectionHeader = styled.div`
  font-weight: 700;
  font-size: 1.12rem;
  color: var(--black-color);
  padding: 1.3vh 2vh;
  display: flex;
  align-items: center;
  background-color: ${(props) =>
    props.selected ? "var(--pink-color)" : "#ffffff"};
  margin-bottom: 0rem;
  border-radius: 9px;
  cursor: pointer;

  @media (max-width: 1024px) {
    font-size: 17px;
    padding: 1vh 1vh;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 0.7vh 1vh;
    border-radius: 7px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    font-weight: 650;
    padding: 1vh 1.5vh;
    border-radius: 6px;
  }
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 1.9vh;
  border-radius: 0.5rem;
  font-size: 0.99rem;
  font-weight: 500;
  position: relative;

  @media (max-width: 1024px) {
    font-size: 14.5px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    gap: 0.5vh;
  }

  @media (max-width: 480px) {
    font-size: 8.3px;
  }
`;

const SubsectionContainer = styled.div`
  padding-left: 1.4rem;
  margin-top: 0.3rem;
`;

const SubsectionItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  position: relative;
  font-size: 0.95rem;
  font-weight: semi-bold;

  & > img {
    position: absolute;
    right: 0;
  }
`;

const TruncatedText = styled.span`
  display: inline-block;
  max-width: ${(props) => props.width || "4rem"};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
`;

const SectionIcon = styled.img`
  margin-left: auto;
  width: 2.4vh;

  @media (max-width: 1024px) {
    width: 19px;
  }

  @media (max-width: 768px) {
    width: 1.6vh;
  }

  @media (max-width: 480px) {
    width: 2vh;
  }
`;

const Icon = styled.img`
  width: 1.4rem;
  @media (max-width: 1024px) {
    width: 17px;
  }

  @media (max-width: 768px) {
    width: 15px;
  }

  @media (max-width: 480px) {
    width: 2.2vh;
  }
`;

const CheckIcon = styled.img`
  margin-left: auto;
  margin-right: 2.5vh;

  @media (max-width: 1024px) {
    margin-right: 1.3vh;
  }

  @media (max-width: 768px) {
    margin-right: 1.3vh;
  }

  @media (max-width: 480px) {
    width: 1.3vh;
  }
`;

const getIconByType = (type) => {
  switch (type) {
    case "video":
      return Class;
    case "material":
      return Material;
    case "assignment":
      return Assignment;
    default:
      return Class;
  }
};

const getSubSectionTitle = (subSection) => {
  return subSection.title || "제목 없음";
};

const CurriculumSidebar = ({
  sections = [],
  activeItem,
  setActiveItem,
  edit,
  completedLectures,
}) => {
  const context = useOutletContext();
  const courseData = context?.courseData || {};
  const isCreator = context?.isCreator || false;
  const { courseId } = useParams();
  const { user } = useContext(UsersContext);
  const navigate = useNavigate();

  const handleItemClick = (lectureId) => {
    setActiveItem(lectureId);
    navigate(`/class/${courseId}/curriculum/${lectureId}`);
  };

  return (
    <SidebarContainer>
      {sections.map((section, lectureIndex) => {
        const subSections = [
          ...(section.videos || []).map((v) => ({
            ...v,
            title: v.videoTitle,
            contentType: "video",
            id: v.contentOrderId,
          })),
          ...(section.materials || []).map((m) => ({
            ...m,
            title: m.originalFilename,
            contentType: "material",
            id: m.contentOrderId,
          })),
          ...(section.assignments || []).map((a) => ({
            ...a,
            title: a.assignmentTitle,
            contentType: "assignment",
            id: a.contentOrderId,
          })),
        ].sort(
          (a, b) => (a.contentOrderIndex || 0) - (b.contentOrderIndex || 0)
        );

        // 학생들에게 보일 섹션 / 교육자에게 보일 섹션 필터링
        const filteredSubSections = isCreator
          ? subSections
          : subSections.filter((sub) =>
              Object.values(sub).every((value) => value !== null)
            );

        return (
          <ListSection key={section.lectureId}>
            <SectionHeader
              selected={activeItem === section.lectureId}
              onClick={() => handleItemClick(section.lectureId)}
            >
              {`${section.lectureTitle}`}
              {!edit && !isCreator && (
                <SectionIcon
                  src={
                    completedLectures[section.lectureId]
                      ? DoneSection
                      : activeItem === section.lectureId
                      ? SelectedSection
                      : UnselectedSection
                  }
                />
              )}
            </SectionHeader>
            {activeItem === section.lectureId && (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {filteredSubSections?.map((subSection) => (
                  <div
                    key={subSection.id}
                    style={{ marginLeft: "0", marginBottom: "10px" }}
                  >
                    <ListItem
                      active={activeItem === subSection.id}
                      style={{
                        marginLeft:
                          subSection.contentType === "material" ||
                          subSection.contentType === "assignment"
                            ? "-2px"
                            : "-5px",
                        marginBottom: "10px",
                      }}
                    >
                      <Icon src={getIconByType(subSection.contentType)} />
                      <TruncatedText width="10rem">
                        {getSubSectionTitle(subSection)}
                      </TruncatedText>
                      {!edit && !isCreator && <CheckIcon src={Check} />}
                    </ListItem>
                  </div>
                ))}
              </ul>
            )}
          </ListSection>
        );
      })}
    </SidebarContainer>
  );
};

CurriculumSidebar.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      lectureId: PropTypes.number.isRequired,
      lectureTitle: PropTypes.string.isRequired,
      subSections: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          type: PropTypes.string.isRequired,
          videoTitle: PropTypes.string,
          materialTitle: PropTypes.string,
          assignmentTitle: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
  activeItem: PropTypes.number,
  setActiveItem: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
};

export default CurriculumSidebar;
