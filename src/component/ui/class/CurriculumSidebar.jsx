import styled from "styled-components";
import PropTypes from "prop-types";
import { FaRegFilePdf } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { FaCirclePlay } from "react-icons/fa6";


const SidebarContainer = styled.aside`
  width: 15rem;
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
  font-weight: 900;
  font-size: 1.1rem;
  color: var(--black-color);
  padding: 0rem 1rem;
  height: 3rem;
  display: flex;
  align-items: center;
  background-color: ${(props) =>
    props.active ? "white" : "var(--pink-color)"};
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
  padding-left: 1rem;
  margin-top: 0.5rem;
`;

const SubsectionItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  position: relative;
  font-size: 1rem;
  font-weight: 550;

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
                <ListItem
                  active={activeItem === subSection.title}
                  onClick={() => handleItemClick(subSection.title)}
                >
                  <FaCirclePlay style={{width:"1.4rem", height: "1.4rem", color:"var(--main-color)", marginRight: "0.5rem"}} />
                  <TruncatedText width="10rem">
                    {subSection.title}
                  </TruncatedText>
                  <span
                    className="material-symbols-outlined"
                    style={{ marginLeft: "auto", color: "var(--grey-color)" }}
                  >
                    {"check"}
                  </span>
                </ListItem>

                <SubsectionContainer>
                  <SubsectionItem>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <FaRegFilePdf style={{width:"1.7rem", height: "1.7rem", color:"var(--main-color)"}}/>
                      <TruncatedText
                        width="10rem"
                        style={{ marginLeft: "0.5rem" }}
                      >
                        {subSection.material.name}
                      </TruncatedText>
                    </div>
                    <span
                      className="material-symbols-outlined"
                      style={{ marginLeft: "auto", color: "var(--grey-color)" }}
                    >
                      {"check"}
                    </span>
                  </SubsectionItem>

                  <SubsectionItem
                    style={{ marginTop: "-0.3rem", marginBottom: "1rem" }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <FiFileText style={{width:"1.7rem", height: "1.7rem", color:"var(--main-color)"}}/>
                      <TruncatedText
                        width="11rem"
                        style={{ marginLeft: "0.5rem" }}
                      >
                        {subSection.assignment.name}
                      </TruncatedText>
                    </div>
                    <span
                      className="material-symbols-outlined"
                      style={{ marginLeft: "auto", color: "var(--grey-color)" }}
                    >
                      {"check"}
                    </span>
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
