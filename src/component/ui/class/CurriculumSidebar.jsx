import styled from "styled-components";
import PropTypes from "prop-types";
import MaterialIcon from "../../img/class/material_icon.svg";
import AssignmentIcon from "../../img/class/assignment_icon.svg";
import DoneIconImage from "../../img/class/done_icon.svg";
import UndoneIconImage from "../../img/class/undone_icon.svg";

const SidebarContainer = styled.aside`
  width: 16rem;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const ListSection = styled.div`
  margin-bottom: 1rem;
  padding: 0.7rem 0rem;
  transition: background-color 0.3s ease;
`;

const SectionHeader = styled.div`
  font-weight: bold;
  font-size: 1.2rem;
  color: black;
  padding: 0rem 1rem;
  height: 3rem;
  display:flex;
  align-items: center;
  background-color: ${(props) => (props.active ? "white" : "var(--pink-color)")};
  margin-bottom: 1rem;
  border-radius: 0.5rem;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  padding-left: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  background-color: ${(props) =>
    props.active ? "var(--main-color)" : "white"};
  color: ${(props) => (props.active ? "white" : "black")};
  font-size: 1rem;
  font-weight: 550;
  position: relative;


  & > img {
    position: absolute;
    right: 1rem;
  }
`;

const SubsectionContainer = styled.div`
  padding-left: 1.5rem;
  margin-top: 0.5rem;
`;

const SubsectionItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  position: relative;
  font-size: 0.9rem;
  font-weight: 550;

  & > img {
    position: absolute;
    right: 0;
  }
`;

const Icon = styled.img`
  width: 1.2rem;
  height: 1.2rem;
`;

const TruncatedText = styled.span`
  display: inline-block;
  max-width: ${(props) => props.width || "4rem"};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
`;

const CurriculumSidebar = ({ sections, activeItem, setActiveItem }) => {

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <SidebarContainer>
      {sections.map((section, sectionIndex) => (
        <ListSection key={sectionIndex}>
          <SectionHeader>{section.title}</SectionHeader>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {section.subSections.map((subSection, subIndex) => (
              <div key={subIndex}>
                {/* Subsection Title */}
                <ListItem
                  active={activeItem === subSection.title}
                  onClick={() => handleItemClick(subSection.title)}
                >
                  <TruncatedText width="12rem">
                    {subSection.title}
                  </TruncatedText>
                  <img
                    src={DoneIconImage}
                    style={{width: "1.35rem",
                      position: "absolute", // 아이콘을 절대 위치로 설정
                      right: "0rem", // 오른쪽 여백 설정
                      top: "50%", // 세로 중앙 정렬
                      transform: "translateY(-50%)"}}
                  />
                </ListItem>

                <SubsectionContainer>
                  <SubsectionItem>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Icon src={MaterialIcon} alt="Material Icon" style={{width:"1.8rem", height:"20%"}}/>
                      <TruncatedText
                        width="11rem"
                        style={{ marginLeft: "0.5rem" }}
                      >
                        {subSection.material.name}
                      </TruncatedText>
                    </div>
                    <img
                      src={
                        subSection.material.downloaded
                          ? DoneIconImage
                          : UndoneIconImage
                      }
                      style={{width:"1.3rem"}}
                    />
                  </SubsectionItem>

                  <SubsectionItem style={{marginTop: "-0.5rem", marginBottom:"1rem"}}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Icon src={AssignmentIcon} alt="Assignment Icon" style={{width:"1.9rem", height:"20%"}}/>
                      <TruncatedText
                        width="11rem"
                        style={{ marginLeft: "0.5rem" }}
                      >
                        {subSection.assignment.name}
                      </TruncatedText>
                    </div>
                    <img
                      src={
                        subSection.assignment.submitted
                          ? DoneIconImage
                          : UndoneIconImage
                      }
                      style={{width:"1.3rem"}}
                    />
                  </SubsectionItem>
                </SubsectionContainer>
              </div>
            ))}
          </ul>
        </ListSection>
      ))}
    </SidebarContainer>
  );
};

CurriculumSidebar.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      subSections: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          material: PropTypes.shape({
            name: PropTypes.string.isRequired,
            downloaded: PropTypes.bool.isRequired,
          }).isRequired,
          assignment: PropTypes.shape({
            name: PropTypes.string.isRequired,
            submitted: PropTypes.bool.isRequired,
          }).isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  activeItem: PropTypes.string.isRequired,
  setActiveItem: PropTypes.func.isRequired,
};

export default CurriculumSidebar;
