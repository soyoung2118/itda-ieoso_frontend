import styled from 'styled-components';
import TopBar from "../ui/TopBar";
import logoImage from "../img/logo/itda_logo_symbol.svg";
import logoName from "../img/logo/itda_logo_name.svg";
import questImage from "../img/mainpage/question.png";
import aiAssistantImage from "../img/mainpage/ai.png";
import curriculumImage from "../img/mainpage/curriculum.png";
import userIcon from "../img/mainpage/usericon.png";
import { useNavigate } from 'react-router-dom';

const MainContainer = styled.div`
    text-align: center;
`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 2vw;
    background-color: #F6F7F9;

    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .signup {
      background-color: transparent;
      color: #000000;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
    }

    .login {
      background-color: #FF4747;
      color: rgb(255, 255, 255);
      border: none;
      padding: 10px 20px;
      border-radius: 50px;
      cursor: pointer;
    }
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    background-color: #F6F7F9;
    padding: 10px;
    border-radius: 8px;
`;

const UserIcon = styled.img`
    width: 40px;
    height: 40px;
    margin-right: 10px;
`;

const UserText = styled.p`
    color: #AAAAAA;
    font-size: 14px;
    margin: 0;
`;

//itda 설명 컨테이너
const ExplainContainer = styled.header`
    text-align: center;
    background-color: #ffffff;
    padding: 15vh 0 10vh 0;
`;

const Logo = styled.img`

    width: 125px;
`;

const Highlight = styled.span`
    color: red;
`;

const StartButton = styled.button`
    text-align: center;
    margin-top: 20px;
    padding: 10px 30px;
    color: #000000;
    font-size: 16px;
    border: 1px solid rgb(0, 0, 0);
    border-radius: 50px;
    background-color: transparent;
    cursor: pointer;
`;

const Features = styled.section`
    display: flex;
    justify-content: space-around;
    margin-top: 40px;
    gap: 20px;
    padding: 0 10vw;
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        padding: 0 15vw;
    }
`;

const FeatureCard = styled.div`
    display: flex;
    flex-direction: column;
    width: 250px;
    height: 300px;
    background-color: #FFFFFF;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: left;
    position: relative;
    margin-bottom: 25px;
    @media (max-width: 768px) {
        width: 70%;
    }
`;

const FeatureTitle = styled.h2`
    font-size: 1.3em;
    font-weight: bold;
    margin-bottom: 5px;
    white-space: pre-line;
`;

const FeatureDescription = styled.p`
    color: #AAAAAA;
    font-size: 1rem;
    margin-top: 5px;
    margin-bottom: 20px;
    white-space: pre-line;
`;

const FeatureImage = styled.img`
    width: 120px;
    height: 120px;
    position: absolute;
    bottom: 20px;
    right: 20px;
    object-fit: contain;
`;

export default function MainPage() {
    const navigate = useNavigate();
    const explain = {
        question: {
            title: "퀘스트를 통한\n재미있는 교육과 학습",
            description: "퀘스트를 수행하고, 경험치와 포인트\n보상을 받아보세요.",
            img: questImage,
        },
        ai: {
            title: "목표 달성을 위한\nAI 비서",
            description: "목표 달성을 위한 로드맵을 제시하고,\n퀘스트를 생성해줍니다.",
            img: aiAssistantImage,
        },
        curriculum: {
            title: "레벨업\n커리큘럼",
            description: "전문가가 만든 커리큘럼을 통해\n목표와 완성을 가속화하세요.",
            img: curriculumImage,
        },
    };

    return (
      <>
        <Header>
          <TopBar backgroundColor="#F6F7F9" />
          <div className="header-right">
          <button className="signup" onClick={() => navigate('/signup')}>회원가입</button>
          <button className="login" onClick={() => navigate('/login')}>로그인</button>
          <UserInfo>
              <UserIcon src={userIcon} alt="user icon" />
              <UserText>로그인하세요</UserText>
          </UserInfo>
          </div>
        </Header>
        <MainContainer>
          <ExplainContainer>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Logo src={logoImage} alt="itda logo" style={{ width: "50px", marginTop: "-60px" }} />
              <Logo src={logoName} alt="itda logo" style={{ width: "125px", height: "auto" }} />
            </div>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", marginTop: "20px" }}>
                계속하고 싶은 학습의 비밀
                <br />
                지금 <Highlight>‘이어서’</Highlight> 하세요!
              </h2>
              <StartButton onClick={() => navigate('/login')}>시작하기</StartButton>
          </ExplainContainer>
          <Features>
            {Object.values(explain).map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
                <FeatureImage src={feature.img} alt={feature.title} />
              </FeatureCard>
            ))}
          </Features>
        </MainContainer>
      </>
    );
}