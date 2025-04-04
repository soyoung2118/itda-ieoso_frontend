import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background-color: #FFFFFF;
    height: calc(100vh - 7vh);
    width: 100%;
    padding-top: 6vh;

    /* 모바일 세로 (해상도 ~ 479px)*/ 
    @media all and (max-width:479px) {
      padding-top: 3.5vh;
    }
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
    font-size: 1.7rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
`;

export const Form = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

export const Label = styled.div`
    margin-top: 0.7rem;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
`;

export const LoginInput = styled.input`
    width: 100%;
    padding: 0.7rem;
    border: 1px solid #CDCDCD;
    border-radius: 15px;
    font-size: 1rem;
    box-sizing: border-box;

    &::placeholder {
        color: #CDCDCD;
    }
`;

export const ResponsiveLabel = styled.span`
  font-size: 0.9rem;

  @media all and (min-width: 768px) {
    font-size: 1rem;
  }

  /* 모바일 세로 (해상도 ~ 479px)*/ 
  @media all and (max-width:479px) {
    font-size: 14px;
  }
`;

export const CheckboxContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    line-height: 1.5;

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

export const SignUpContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 70%;
  max-width: 550px;
  margin: 0 auto;
`;

export const SignUpInput = styled.input`
    width: 100%;
    padding: 0.7rem;
    border: 1px solid #CDCDCD;
    border-radius: 15px;
    font-size: 0.9rem;
    box-sizing: border-box;

    &::placeholder {
        color: #CDCDCD;
    }
`;

export const SignUpLink = styled.div`
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: var(--guide-gray-color);
    text-align: center;

    a {
        margin-left: 0.5rem;
        color: var(--main-color);
        text-decoration: underline;
    }
`;

export const LoginButton = styled.button`
    padding: 0.8rem;
    background-color: #FF4747;
    color: white;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    margin-bottom: 1rem;
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
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #FFFFFF;
  color: ${props => (props.active || props.completed ? 'black' : '#C3C3C3')};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 50px;
  border: 2px solid ${props => (props.active || props.completed ? '#474747' : '#C3C3C3')};
  position: relative;
  transition: color 0.3s ease, border-image 0.5s ease;

    /* 모바일 세로 (해상도 ~ 479px)*/ 
    @media all and (max-width:479px) {
        margin: 0 30px;
    }

  &:after {
    content: '${props => props.label}';
    position: absolute;
    top: 52px;
    font-size: 0.8rem;
    color: ${props => (props.active || props.completed ? '#474747' : '#C3C3C3')};
    width: max-content;
  }

  &:not(:last-child):before {
    content: '';
    position: absolute;
    top: 20px;
    left: 35px;
    width: 103px;
    height: 2px;
    background: ${props => (props.completed ? '#474747' : '#C3C3C3')};
    transition: background 0.5s ease;

    /* 모바일 세로 (해상도 ~ 479px)*/ 
    @media all and (max-width:479px) {
        width: 65px;
    }
  }
`;

export const Terms = styled.div`
  text-align: left;
  margin: 20px auto;
  width: 100%;
  max-width: 600px;
  border: 1px solid #CDCDCD;
  border-radius: 10px;
  background-color: #FFFFFF;
  padding: 20px;
  box-sizing: border-box;
`;

export const Term = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  &:last-child {
    border-bottom: none;
  }
`;

export const InputContainer = styled.div`
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-bottom: 8px;
`;

export const InputEmailContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const EmailCheckButton = styled.button`
  padding: 0.8rem;
  width: 30%;
  margin-left: 1rem;
  color: white;
  background-color: var(--main-color);
  border: none;
  border-radius: 15px;
  cursor: pointer;
`;

export const ValidateMessage = styled.div`
  font-size: 0.8rem;
  margin-left: 0.4rem;
  width: 100%;
  margin-bottom: 10px;
  min-height: 15px;

  /* 모바일 세로 (해상도 ~ 479px)*/ 
  @media all and (max-width:479px) {
    font-size: 11px;
  }
`;

export const WelcomeMessage = styled.div`
  min-width: 400px;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 50px auto;
  padding: 45px 0;
  border: 1px solid #ddd;
  border-radius: 30px;
  background-color: #FFFFFF;

  /* 모바일 세로 (해상도 ~ 479px)*/ 
  @media all and (max-width:479px) {
    min-width: 50px;
    width: 100%;
    font-size: 14px;
    margin: 40px 0;
  }
`;

export const NextButton = styled.button`
  width: 100%;
  display: block;
  background-color: #FF4747;
  color: white;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 15px;
  margin: 10px auto;
`;

export const Divider = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0;
    color: #909090;
    font-size: 0.9rem;
    width: 100%;
    justify-content: center;

    span {
        padding: 0 20px;
        font-size: 12px;
        white-space: nowrap;
    }
`;

export const Line = styled.hr`
    width: 30%;
    border: 1px solid #CDCDCD;
    margin: 0;
    max-width: 240px;
`;

export const SocialLoginButton = styled.div`
  width: 70%;
  max-width: 550px;
  margin-bottom: 1rem;
`;

export const GoogleButton = styled.button`
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #909090;
  border-radius: 15px;
  padding: 0.75rem;
  font-size: 15px;
  cursor: pointer;
  margin: 10px auto;
  background-color: #FFFFFF;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const GoogleIcon = styled.img`
  display: block;
  width: 52px;
  height: 40px;
  position: absolute;
  left: 10px;
  margin-right: 0;
`;


