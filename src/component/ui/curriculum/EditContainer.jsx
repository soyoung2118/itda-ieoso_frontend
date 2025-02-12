import styled from "styled-components";
import PropTypes from "prop-types";
import VideoIcon from "../../img/class/edit/video.svg";
import AssignmentIcon from "../../img/icon/docs.svg";
import MaterialIcon from "../../img/icon/pdf.svg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: -4.8rem;
  top: 50%;
  transform: translateY(-50%);
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  z-index: 10;

  & img {
    width: 1.8rem;
    cursor: pointer;
    margin: 0.8rem 0;
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

const HighlightLine = styled.div`
  position: absolute;
  left: 0;
  top: 0%;
  bottom: 0;
  width: 0.35rem;
  height: 100%;
  background-color: var(--main-color);
`;

const EditContainer = ({ onIconClick }) => {
  // 아이콘 데이터 배열
  const icons = [
    { src: VideoIcon, alt: "Video", action: () => onIconClick("video") },
    { src: MaterialIcon, alt: "Material", action: () => onIconClick("material") },
    { src: AssignmentIcon, alt: "Assignment", action: () => onIconClick("assignment") },
  ];

  return (
    <>
      <HighlightLine />
      <Container>
        {icons.map((icon, index) => (
          <img
            key={index}
            src={icon.src}
            alt={icon.alt}
            onClick={icon.action}
          />
        ))}
      </Container>
    </>
  );
};

EditContainer.propTypes = {
  onIconClick: PropTypes.func.isRequired, // 함수 타입이며 필수 값
};

export default EditContainer;
