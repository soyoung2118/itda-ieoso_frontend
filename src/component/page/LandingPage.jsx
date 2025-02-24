import styled from 'styled-components';
import TopBar from "../ui/TopBar";
import logoImage from "../img/logo/itda_logo_symbol.svg";
import logoName from "../img/logo/itda_logo_name.svg";
import studentIcon from "../img/landing/student_icon.svg";
import pencilIcon from "../img/landing/pencil_icon.svg";
import levelIcon from "../img/landing/level_icon.svg";
import explain1 from "../img/landing/explain1.svg";
import explain2 from "../img/landing/explain2.svg";
import arrowIcon from "../img/landing/arrow_icon.svg";
import itdalogoRed from "../img/landing/itda_icon_red.svg";
import googlePlay from "../img/landing/googleplay.svg";
import appStore from "../img/landing/appstore.svg";

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import TermsModal from './users/TermsModal';

const MainContainer = styled.div`
    text-align: center;
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

const ExplainBottomContainer = styled.div`
    justify-content: center;
    align-items: center;
    margin-top: 70px;
    padding: 3vh 2vw;
    background-color: #FFFFFF;
`;

const ActionButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    margin-top: 10px;
`;

const ActionButton = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    min-height: 50px;
    height: 85px;
    padding: 10px;
    margin: 10px;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    box-sizing: border-box;
    position: relative;
`;

const ButtonText = styled.span`
    position: absolute;
    top: 20px;
    left: 15px;
    font-size: 1rem;
    font-weight: 500;
`;

const ArrowIcon = styled.img`
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 20px;
    height: 20px;
`;

const AppDownloadContainer = styled.div`
    display: flex;
    align-items: center;
    margin-left: 20px;
    gap: 20px;
    margin-top: 20px;
`;

const AppDownloadLinks = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 15px;
`;

const AppDownloadLink = styled.a`
    display: flex;
    align-items: center;
    text-decoration: none;
    color: black;
    background-color: #F6F7F9;
    padding: 10px 20px;
    border-radius: 50px;
`;

const AppLogo = styled.img`
    width: 100px;
    margin-right: 20px;
`;

const AppDescription = styled.div`
    font-size: 1rem;
    font-weight: 700;
    color: #333;
`;

const Footer = styled.footer`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0 30px 80px ;
`;

const FooterLinks = styled.div`
    display: flex;
    align-items: center;
`;

const FooterSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

const FooterInfoContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

const FooterLink = styled.a`
    margin: 0 10px;
    text-decoration: none;
    color: black;
    font-size: 0.9rem;
    font-weight: 500;
`;

const FooterInfo = styled.p`
    font-size: 0.8rem;
    margin: 10px 0;
    color: #AAAAAA;
`;

function renderActionButtons(navigate) {
    const buttons = [
        { text: "강의실 바로가기", src: arrowIcon, path: "/class/list" },
        { text: "내 대시보드 바로가기", src: arrowIcon, path: "/dashboard" },
        { text: "내 강의실 생성하기", src: arrowIcon, path: "/class/create" },
    ];

    return (
        <ActionButtonContainer>
            {buttons.map((button, index) => (
                <ActionButton key={index} onClick={() => navigate(button.path)}>
                    <ButtonText>{button.text}</ButtonText>
                    <ArrowIcon src={button.src} alt="arrow icon" />
                </ActionButton>
            ))}
        </ActionButtonContainer>
    );
}

export default function LandingPage() {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', content: '' });

    const handleOpenModal = (type) => {
        let content;
        switch (type) {
            case 'service':
                content = {
                    title: '서비스 이용약관',
                    content: '회원의 의무: 회원은 서비스 신청 시 허위 정보를 제공하거나 타인의 정보를 도용해서는 안 됩니다.\n\n또한, 사이트에 게시된 정보를 허가 없이 변경하거나, 회사 및 제3자의 저작권 등 지식재산권을 침해하는 행위를 금지합니다.\n\n게시물 관리: 회원이 작성한 게시물의 권리와 책임은 작성자에게 있으며, 회사는 비방, 명예훼손, 저작권 침해 등의 문제가 있는 게시물을 사전 통지 없이 삭제할 수 있습니다.\n\n서비스 제공 및 변경: 회사는 상품 등의 품절 또는 기술적 사양의 변경 등의 사유로 제공할 상품 등의 내용을 변경할 수 있으며, 이 경우 변경 사항을 즉시 공지합니다.'
                };
                break;
            case 'privacy':
                content = {
                    title: '개인정보 처리방침',
                    content: '수집 및 이용 목적: 회원 관리, 서비스 제공 및 개선, 고객 상담, 마케팅 및 광고에의 활용 등을 위해 개인정보를 수집합니다.\n\n 수집 항목: 이름, 이메일 주소, 전화번호, 생년월일, 성별, 서비스 이용 기록, 결제 정보 등이 포함됩니다. \n\n보유 및 이용 기간: 회원 탈퇴 시까지 또는 관련 법령에 따라 일정 기간 동안 보유합니다. 예를 들어, 회원 탈퇴 시 서비스 제공을 위해 수집한 정보는 소비자 불만 및 분쟁 해결 목적으로 탈퇴일로부터 30일간 보관 후 삭제됩니다.\n\n제3자 제공 및 위탁: 회사는 원칙적으로 회원의 동의 없이 개인정보를 외부에 제공하지 않으며, 서비스 운영을 위해 필요한 경우에 한해 수탁자에게 업무를 위탁할 수 있습니다. 예를 들어, 결제를 위한 업체나 배송을 위한 업체 등이 해당됩니다.등이 해당됩니다.'
                };
                break;
            default:
                content = { title: '', content: '' };
        }
        setModalContent(content);
        setModalOpen(true);
    };
  
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const explain = {
        question: {
            title: "3 STEP\n 쉬운 강의실 개설",
            description: "오직 3단계로 쉽게 나만의 강의실을\n개설하여 수업을 시작해보세요.",
            img: studentIcon,
        },
        ai: {
            title: "한 눈에 보이는\n 학습 상황",
            description: "학습자의 학습 상황을 클릭 한 번으로\n한눈에 확인해볼 수 있어요.",
            img: pencilIcon,
        },
        curriculum: {
            title: "주 단위\n커리큘럼 운영",
            description: "주 단위의 체계적 커리큘럼을 통해\n목표와 한걸음 가까워지세요.",
            img: levelIcon,
        },
    };

    return (
      <>
        <TopBar />
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
          <ExplainBottomContainer>
          <img src={explain1} alt="itda logo" style={{ width: "100%", margin: "20px 0px" }} />
          <img src={explain2} alt="itda logo" style={{ width: "100%" }} />
            {renderActionButtons(navigate)}
            <AppDownloadContainer>
            <AppLogo src={itdalogoRed} alt="itda logo" />
            <div>
              <AppDescription>
                학습자와 교육자 모두가 선택하는 최상의 교육플랫폼, <Highlight>itda</Highlight>
              </AppDescription>
              <AppDownloadLinks>
                <AppDownloadLink href="#">
                  <img src={googlePlay} alt="Google Play" style={{ width: "20px", marginRight: "10px" }} />
                  Google Play
                </AppDownloadLink>
                <AppDownloadLink href="#">
                  <img src={appStore} alt="App Store" style={{ width: "20px", marginRight: "10px" }} />
                  App Store
                </AppDownloadLink>
              </AppDownloadLinks>
            </div>
            </AppDownloadContainer>
          <hr style={{ width: "100%", margin: "40px 0px", border: "1px solid #CDCDC" }} />
          <Footer>
            <FooterLinks>
              <FooterLink href="#">Instagram</FooterLink>
              <FooterLink href="#">Youtube</FooterLink>
            </FooterLinks>
            <FooterSection>
              <div>
              <FooterLink href="#" onClick={() => handleOpenModal('service')}>이용약관</FooterLink>
              <FooterLink href="#" onClick={() => handleOpenModal('privacy')}>개인정보처리방침</FooterLink>
              </div>
              <FooterInfoContainer>
                <FooterInfo>CEO: 김효정</FooterInfo>
                <FooterInfo>문의: 010-2856-2048</FooterInfo>
              </FooterInfoContainer>
            </FooterSection>
            </Footer>
             </ExplainBottomContainer>
        </MainContainer>
        {modalOpen && (
          <TermsModal 
            title={modalContent.title} 
            content={modalContent.content} 
            onClose={handleCloseModal}
          />
        )}
      </>
    );
}