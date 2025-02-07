import styled from "styled-components";
import PropTypes from "prop-types";
import Assignment from "../../img/icon/docs.svg";
import Material from "../../img/icon/pdf.svg";
import Class from "../../img/class/class.svg";
import SelectedSection from "../../img/class/check/sel_sec.svg";
import UnselectedSection from "../../img/class/check/unsel_sec.svg";
import DoneSection from "../../img/class/check/done_sec.svg";
import Check from "../../img/class/check/check.svg";

const SidebarContainer = styled.aside`
  width: 15rem;
  height: 45rem;
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  margin-top:2rem;
  letter-spacing: -0.5px;
`;

const ListSection = styled.div`
  margin-bottom: -1.5rem;
  padding: 0.7rem 0rem;
  transition: background-color 0.3s ease;
`;

const SectionHeader = styled.div`
  font-weight: 900;
  font-size: 1.1rem;
  color: var(--black-color);
  padding: 0rem 1rem;
  height: 3rem;
  display: flex;
  align-items: center;
  background-color: ${(props) =>
    props.selected ? "var(--pink-color)" : "#ffffff"};
  margin-bottom: 0rem;
  border-radius: 9px;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: semi-bold;
  position: relative;
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
`;

const Icon = styled.img`
  width: 1.23rem;
`;



const CurriculumSidebar = ({ sections, activeItem, setActiveItem, edit }) => {
  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <SidebarContainer>
      {sections.map((section, sectionIndex) => (
        <ListSection key={sectionIndex}>
          <SectionHeader selected={section.selected}>
            {section.title}
            {!edit && (
              <SectionIcon
                src={
                  !section.selected
                    ? UnselectedSection
                    : section.done
                    ? DoneSection
                    : SelectedSection
                }
                style={{
                  width: "1.5rem",
                }}
              />
            )}
          </SectionHeader>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {section.subSections.map((subSection, subIndex) => (
              <div
                key={subIndex}
                style={{
                  marginLeft: "0",
                }}
              >
                <ListItem
                  active={activeItem === subSection.title}
                  onClick={() => handleItemClick(subSection.title)}
                >
                  <Icon src={Class} style={{ width: "1.4rem" }} />
                  <TruncatedText width="10rem">
                    {subSection.title}
                  </TruncatedText>
                  {!edit && (
                    <img src={Check} style={{marginLeft:"auto", marginRight:"1.3rem"}}/>
                  )}
                </ListItem>

                <SubsectionContainer>
                  <SubsectionItem>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Icon
                        src={Material}
                        style={{
                          marginLeft: "0",
                        }}
                      />
                      <TruncatedText
                        width="10rem"
                        style={{ marginLeft: "0.7rem" }}
                      >
                        {subSection.material.name}
                      </TruncatedText>
                    </div>
                    {!edit && (
                      <img src={Check} style={{marginLeft:"auto", marginRight:"1.3rem"}}/>
                    )}
                  </SubsectionItem>

                  <SubsectionItem
                    style={{ marginTop: "-0.3rem", marginBottom: "1rem" }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Icon src={Assignment} style={{
                          marginLeft:"0",
                        }}
                        />
                      <TruncatedText
                        width="11rem"
                        style={{ marginLeft: "0.7rem" }}
                      >
                        {subSection.assignment.name}
                      </TruncatedText>
                    </div>
                    {!edit && (
                      <img src={Check} style={{marginLeft:"auto", marginRight:"1.3rem"}}/>
                    )}
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
