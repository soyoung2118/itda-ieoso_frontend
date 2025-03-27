import { Link } from "react-router-dom";
import styled from "styled-components";
import EditBtn from "../../img/class/edit_btn.svg";
import EditedBtn from "../../img/class/edited_btn.svg";

const StyledButton = styled(Link)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 6vh;
  cursor: pointer;

  @media (max-width: 1024px) {
    width: 4.5vh;
  }

`;

const EditButton = ({ to, edit }) => {
  return (
    <StyledButton to={to}>
      <img
        src={edit ? EditBtn : EditedBtn}
        alt="Edit Button"
        style={{ width: "100%" }}
      />
    </StyledButton>
  );
};

export default EditButton;
