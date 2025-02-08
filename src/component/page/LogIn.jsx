import { useState, useContext } from "react";
import TopBar from "../ui/TopBar";
import logoImage from "../img/logo/itda_logo_symbol.svg";
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
import { login } from "../api/usersApi";
import { UsersContext } from "../contexts/usersContext";

export default function LogIn() {
    const { setUser, setIsUser } = useContext(UsersContext);
    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ email, password });

            // 토큰 저장 (로컬 스토리지)
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            setUser(response.user);
            setIsUser(true);
            // 로그인 성공 시 대시보드로 이동
            window.location.href = '/class';
        } catch (error) {
            alert('로그인 실패:', error);
            setError(error.response?.data?.message || '로그인 중 오류가 발생했습니다.');
        }
    };

    return (
        <>
            <TopBar />
            <Container>
                <LogoImage src={logoImage} alt="logo" />
                <LogoText>로그인</LogoText>
                <div style={{ width: '40%', margin: '0 auto' }}>
                    <Form>
                        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                    <Label>아이디</Label>
                        <LoginInput
                            type="text"
                            placeholder="아이디를 입력해주세요."
                            onChange={(e) => setEmail(e.target.value)}
                        />

                    <Label>비밀번호</Label>
                    <LoginInput
                        type="password"
                        placeholder="비밀번호를 입력해주세요."
                        onChange={(e) => setPassword(e.target.value)}
                    />

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
                        <LoginButton
                            style={{ fontSize: '1rem' }}
                            onClick={handleLogin}
                        >로그인</LoginButton>
                    <SignUpLink>
                        계정이 없으신가요? <a href="/signup">회원가입하기</a>
                    </SignUpLink>
                </Form>
                </div>
            </Container>
        </>
    );
}