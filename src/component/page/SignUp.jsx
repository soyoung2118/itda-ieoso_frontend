import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from "../ui/TopBar";
import logoImage from "../img/logo.svg";
import { Checkbox, FormControlLabel, IconButton } from '@mui/material';
import {
    Container,
    LogoImage,
    LogoText,
    LoginButton,
    SignUpContainer,
    Progress,
    Label,
    Step,
    Terms,
    Term,
    SignUpInput,
    CustomCheckboxCircle,
    CustomCheckboxTransparent,
    NextButton,
    InputContainer,
    WelcomeMessage
} from "../../style/Styles";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PropTypes from 'prop-types';

const TERMS = {
  service: '[필수] itda 서비스 이용약관에 동의합니다.',
  privacy: '[필수] itda 개인정보 수집 및 이용약관에 동의합니다.',
  marketing: '[선택] itda의 마케팅 정보 수신에 동의합니다.'
};

function TermsAgreement({ isChecked, termsChecked, handleCheckAll, handleIndividualCheck, handleDocumentOpen }) {
  return (
    <Terms>
      <Term>
        <FormControlLabel
          control={
            <Checkbox
              icon={CustomCheckboxCircle(false)}
              checkedIcon={CustomCheckboxCircle(true)}
              checked={isChecked}
              onChange={handleCheckAll}
            />
          }
          label="전체 동의"
        />
      </Term>
      <div style={{borderBottom: '1px solid #CDCDCD', margin: '10px 0' }}></div>
      <Term>
        <FormControlLabel
          control={
            <Checkbox
              icon={CustomCheckboxTransparent(false)}
              checkedIcon={CustomCheckboxTransparent(true)}
              checked={termsChecked.service}
              onChange={() => handleIndividualCheck('service')}
            />
          }
          label={TERMS.service}
        />
        <IconButton onClick={() => handleDocumentOpen('service')}>
          <ArrowForwardIosIcon style={{ fontSize: '16px' }} />
        </IconButton>
      </Term>
      <Term>
        <FormControlLabel
          control={
            <Checkbox
              icon={CustomCheckboxTransparent(false)}
              checkedIcon={CustomCheckboxTransparent(true)}
              checked={termsChecked.privacy}
              onChange={() => handleIndividualCheck('privacy')}
            />
          }
          label={TERMS.privacy}
        />
        <IconButton onClick={() => handleDocumentOpen('privacy')}>
          <ArrowForwardIosIcon style={{ fontSize: '16px' }} />
        </IconButton>
      </Term>
      <Term>
        <FormControlLabel
          control={
            <Checkbox
              icon={CustomCheckboxTransparent(false)}
              checkedIcon={CustomCheckboxTransparent(true)}
              checked={termsChecked.marketing}
              onChange={() => handleIndividualCheck('marketing')}
            />
          }
          label={TERMS.marketing}
        />
        <IconButton onClick={() => handleDocumentOpen('marketing')}>
          <ArrowForwardIosIcon style={{ fontSize: '16px' }} />
        </IconButton>
      </Term>
    </Terms>
  );
}

TermsAgreement.propTypes = {
  isChecked: PropTypes.bool.isRequired,
  termsChecked: PropTypes.shape({
    service: PropTypes.bool.isRequired,
    privacy: PropTypes.bool.isRequired,
    marketing: PropTypes.bool.isRequired,
  }).isRequired,
  handleCheckAll: PropTypes.func.isRequired,
  handleIndividualCheck: PropTypes.func.isRequired,
  handleDocumentOpen: PropTypes.func.isRequired,
};

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState({
    service: false,
    privacy: false,
    marketing: false,
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/login');
    }
  };

  const handleCheckAll = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    setTermsChecked(() => ({
      service: newCheckedState,
      privacy: newCheckedState,
      marketing: newCheckedState,
    }));
  };

  const handleIndividualCheck = (term) => {
    const updatedTermsChecked = {
      ...termsChecked,
      [term]: !termsChecked[term],
    };
    setTermsChecked(updatedTermsChecked);
    const allChecked = Object.values(updatedTermsChecked).every(value => value);
    setIsChecked(allChecked);
  };

  const handleDocumentOpen = (term) => {
    console.log(`${term} 문서 출력`);
  };

  return (
    <>
      <TopBar />
      <Container>
      <LogoImage src={logoImage} alt="logo" />
      <LogoText>회원가입</LogoText>
        <Progress>
          <Step active={step === 1} completed={step > 1} label="약관동의">1</Step>
          <Step active={step === 2} completed={step > 2} label="아이디 설정">2</Step>
          <Step active={step === 3} completed={step > 3} label="비밀번호 설정">3</Step>
        </Progress>
      <SignUpContainer>
        {step === 1 && (
            <>
              <p>※ itda 계정을 만들기 위해 약관에 동의해주세요.</p>
              <div style={{minWidth: '400px', width: '100%', margin: '0 auto' }}>
              <TermsAgreement
                isChecked={isChecked}
                termsChecked={termsChecked}
                handleCheckAll={handleCheckAll}
                handleIndividualCheck={handleIndividualCheck}
                handleDocumentOpen={handleDocumentOpen}
              />
              </div>
              <NextButton onClick={handleNext}>
                다음
              </NextButton>
          </>
        )}
        {step === 2 && (
            <>
            <div style={{ minWidth: '400px', maxWidth:'600px',width: '100%', margin: '0 auto' }}>
              <Label style={{ textAlign: 'left', width: '100%' }}>아이디</Label>
              <InputContainer>  
                <SignUpInput placeholder="아이디를 설정해주세요." style={{ width: '65%' }}/>
                  <LoginButton style={{
                    width: '35%',
                    marginLeft: '1rem',
                  }}>아이디 확인</LoginButton>
              </InputContainer>
              <Label style={{ textAlign: 'left',marginBottom: '1rem' }}>비밀번호</Label>
              <InputContainer >
                  <SignUpInput
                  type="password"
                  placeholder="비밀번호를 설정해주세요."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%' }}
                  />
                </InputContainer>
                <div style={{ fontSize: '0.8rem', color: '#000000', width: '100%', margin: '-1rem 0 2rem 0' }}>영문 대/소문자, 숫자, 특수문자를 조합하여 8자 이상 입력해주세요.</div>
              <Label style={{ textAlign: 'left', margin: '1rem 0' }}>비밀번호 확인</Label>
              <InputContainer>
                <SignUpInput
                  type="password"
                  placeholder="설정하신 비밀번호를 입력해주세요."
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  style={{ width: '100%' }}
                />
              </InputContainer>
              {step === 2 && password !== confirmPassword && (
                <div style={{ fontSize: '0.8rem', color: '#FF4747', width: '100%', margin: '-1rem 0 2rem 0' }}>
                  비밀번호가 일치하지 않습니다. 다시 확인해주세요.
                </div>
              )}
            </div>
            <NextButton onClick={handleNext}>
              다음
            </NextButton>
            </>
        )}
          {step === 3 && (
            <div style={{ minWidth: '400px',width: '100%', margin: '0 auto' }}>
              <WelcomeMessage>
                <h2>itda에 오신 것을 환영합니다!</h2>
                <p>첫 로그인하시겠어요?</p>
              </WelcomeMessage>
              <NextButton onClick={handleNext}>
                로그인하러 가기
              </NextButton>
            </div>

          )}
        </SignUpContainer>
      </Container>
    </>
  );
}
