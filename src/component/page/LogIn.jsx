import { useState } from "react";
import TopBar from "../ui/TopBar";
import logoImage from "../img/logo.svg";
import { Checkbox, FormControlLabel } from '@mui/material';
import {
    Container,
    LogoImage,
    LogoText,
    Form,
    Label,
    LoginInput,
    CheckboxContainer,
    CustomCheckboxSquare,
    LoginButton,
    SignUpLink,
} from "../../style/Styles";

export default function LogIn() {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <>
            <TopBar />
            <Container>
                <LogoImage src={logoImage} alt="logo" />
                <LogoText>로그인</LogoText>
                <div style={{ width: '40%', margin: '0 auto' }}>
                <Form>
                    <Label>아이디</Label>
                    <LoginInput type="text" placeholder="아이디를 입력해주세요." />
                    
                    <Label>비밀번호</Label>
                    <LoginInput type="password" placeholder="비밀번호를 입력해주세요." />
                    
                    <CheckboxContainer>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    icon={CustomCheckboxSquare(false)}
                                    checkedIcon={CustomCheckboxSquare(true)}
                                    checked={isChecked}
                                    onChange={() => setIsChecked(!isChecked)}
                                />
                            }
                            label="자동 로그인"
                        />
                    </CheckboxContainer>
                    <LoginButton style={{ fontSize: '1rem' }}>로그인</LoginButton>
                    <SignUpLink>
                        계정이 없으신가요? <a href="/signup">회원가입하기</a>
                    </SignUpLink>
                </Form>
                </div>
            </Container>
        </>
    );
}