import styled, { keyframes, css } from "styled-components";

// 막대기 애니메이션 정의
const lineGradientAnimation = keyframes`
  from {
    background-image: linear-gradient(to right, #C3C3C3, #C3C3C3);
  }
  to {
    background-image: linear-gradient(to right, #474747, #C3C3C3);
  }
`;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background-color: #FFFFFF;
    width: 100%;
    height: calc(100vh - 59px);
    padding-top: 8rem;
`;

export const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const LogoImage = styled.img`
    width: 50px;
    margin-bottom: 1rem;
`;

export const LogoText = styled.div`
    font-size: 2rem;
    margin-bottom: 2rem;
`;

export const Form = styled.div`
    width: 500px;
    display: flex;
    flex-direction: column;
`;

export const Label = styled.label`
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-size: 1rem;
`;

export const LoginInput = styled.input`
    padding: 0.8rem;
    margin-bottom: 1rem;
    border: 1px solid #CDCDCD;
    border-radius: 10px;
    font-size: 1rem;

    &::placeholder {
        color: #CDCDCD;
    }
`;

export const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
`;

export const CustomCheckboxSquare = (checked) => {
  if (checked) {
    return (
      <span
        className="material-icons"
        style={{ color: "#CDCDCD", fontSize: "24px" }}
      >
        check_box
      </span>
    );
  }
  return (
    <span
      className="material-icons"
      style={{ color: "#C3C3C3", fontSize: "24px" }}
    >
      check_box_outline_blank
    </span>
  );
};

export const CustomCheckboxCircle = (checked) => {
  if (checked) {
    return (
      <span
        className="material-icons"
        style={{ color: "#FF4747", fontSize: "30px" }}
      >
        check_circle
      </span>
    );
  }
  return (
    <span
      className="material-icons"
      style={{ color: "#C3C3C3", fontSize: "30px" }}
    >
      check_circle
    </span>
  );
};

export const CustomCheckboxTransparent = (checked) => {
  if (checked) {
    return (
      <span
        className="material-icons"
        style={{ color: "rgb(0, 0, 0)", fontSize: "24px" }}
      >
        check
      </span>
    );
  }
  return (
    <span
      className="material-icons"
      style={{ color: "#C3C3C3", fontSize: "24px" }}
    >
      check
    </span>
  );
};

export const Checkbox = styled.input`
    accent-color: #CDCDCD;
    width: 20px;
    height: 20px;
    margin-right: 0.5rem;
`;

export const SignUpInput = styled.input`
    padding: 0.8rem;
    margin-bottom: 1rem;
    border: 1px solid #CDCDCD;
    border-radius: 10px;
    font-size: 1rem;

    &::placeholder {
        color: #CDCDCD;
    }
`;

export const LoginButton = styled.button`
    padding: 0.8rem;
    background-color: #FF4747;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-bottom: 1rem;
`;

export const SignUpLink = styled.div`
    font-size: 0.9rem;
    color: #CDCDCD;
    text-align: center;

    a {
        margin-left: 0.5rem;
        color: #FF4747;
        text-decoration: underline;
    }
`;

export const SignUpContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const Progress = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  position: relative;
  width: 100%;
`;

export const Step = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #FFFFFF;
  color: ${props => (props.active || props.completed ? 'black' : '#C3C3C3')};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 50px;
  border: 2px solid ${props => (props.active || props.completed ? '#474747' : '#C3C3C3')};
  font-weight: bold;
  position: relative;
  z-index: 2;

  &:after {
    content: '${props => props.label}';
    position: absolute;
    top: 40px;
    font-size: 0.8rem;
    color: ${props => (props.active || props.completed ? '#474747' : '#C3C3C3')};
    width: max-content;
    left: 50%;
    transform: translateX(-50%);
  }

  &:not(:last-child):before {
    content: '';
    position: absolute;
    top: 15px;
    left: 32px;
    width: 100px;
    height: 2px;
    background-color: #C3C3C3;
    z-index: 1;
    ${props => props.completed && css`
      animation: ${lineGradientAnimation} 0.5s ease-in-out forwards;
    `}
  }
`;

export const Terms = styled.div`  text-align: left;
  margin: 20px auto;
  width: 35%;
  padding: 20px;
  border: 1px solid #CDCDCD;
  border-radius: 10px;
  background-color: #FFFFFF;
`;

export const Term = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  border-radius: 50px;
  &:last-child {
    border-bottom: none;
  }
`;

export const NextButton = styled.button`
  width: 36%;
  display: block;
  background-color: #FF4747;
  color: white;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 10px;
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

export const CheckButton = styled.button`
  background-color: transparent;
  color: black;
  border: none;
  padding: 10px;
  margin-left: 10px;
  cursor: pointer;
`;

export const ErrorMessage = styled.div`
  color: #FF4747;
  font-size: 12px;
  margin-bottom: 10px;
`;

export const WelcomeMessage = styled.div`
  width: 100%;
  margin: 20px auto;
  padding: 50px 70px;
  border: 1px solid #ddd;
  border-radius: 30px;
  max-width: 300px;
  background-color: #FFFFFF;
`;
