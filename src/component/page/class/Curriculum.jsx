import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import LogoSymbol from "../../img/logo/itda_logo_symbol.svg";
import CurriculumSidebar from "../../ui/class/CurriculumSidebar";
import ClassThumbnail from "../../img/class/class_thumbnail.svg";
import DoneIcon from "../../img/class/check/done_icon.svg";
import UndoneIcon from "../../img/class/check/undone_icon.svg";
import Assignment from "../../img/icon/docs.svg";
import Material from "../../img/icon/pdf.svg";
import PlayIcon from "../../img/class/play_icon.svg";
import SelectedSection from "../../img/class/check/sel_sec.svg";
import UnselectedSection from "../../img/class/check/sel_sec.svg";
import DoneSection from "../../img/class/check/done_sec.svg";
import EditButton from "../../ui/class/EditButton";
import Close from '@mui/icons-material/Close';

const Section = styled.div`
  display: flex;
  padding: 1.3rem 1.5rem;
  border-radius: 14px;
  margin: 1.15rem 0rem;
  background-color: #ffffff;
`;

const CurriculumTitle = styled.h3`
  font-size: 1.65rem;
  font-weight: 900;
  margin-bottom: -0.3rem;
  margin-top: 0.5rem;
  letter-spacing: -1px;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 14.5rem;
  border-radius: 8px;
`;

const VideoThumbnail = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const MaterialSection = styled.div`
  display: flex;
  background-color: var(--lightgrey-color);
  width: 100%;
  padding: 1.2rem 1.5rem;
  border-radius: 8px;
  font-size: 1.07rem;
`;

const Icon = styled.img`
  width: 1.4rem;
  height: 1.4rem;
`;

const SectionIcon = styled.img`
  margin-left: auto;
`;

const Curriculum = () => {
  const navigate = useNavigate();
  const { courseData, isCreator } = useOutletContext();
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();
  const entrycode = location.state?.entrycode || null;
  const [isEntryCodeModalOpen, setIsEntryCodeModalOpen] = useState(false);

  useEffect(() => {
    if(entrycode) setIsEntryCodeModalOpen(true);
  }, []);

  const curriculumData = [
    {
      title: "1. 기초를 준비해요",
      selected: true, // 선택 여부
      done: true, // 완료 여부

      subSections: [
        {
          title: "1. 꾸미고 싶은 타입을 정해서 다이어리를 골라봅시다",
          done: true,
          thumbnail: null, // 썸네일 기본값
          author: "김잇다",
          period: "2025-01-06 10:00 ~ 2025-01-12 23:59",
          material: {
            name: "오늘의 다이어리",
            size: "3.1MB",
            downloaded: true, // 다운로드 완료 여부
          },
          assignment: {
            name: "1/6(월) 과제 제출",
            deadline: "2025.01.06 15:00:00 - 2025.01.12 23:59",
            submitted: false, // 제출 여부
          },
        },
        {
          title: "2. 필기구 소개",
          done: false,
          thumbnail: null,
          author: "김잇다",
          period: "2025-01-06 10:00 ~ 2025-01-12 23:59",
          material: {
            name: "오늘의 다이어리",
            size: "3.1MB",
            downloaded: true,
          },
          assignment: {
            name: "1/6(월) 과제 제출",
            deadline: "2025.01.06 15:00:00 - 2025.01.12 23:59",
            submitted: false,
          },
        },
      ],
    },
    {
      title: "2. 한 달을 기록해요",
      selected: false, // 선택 여부
      done: false, // 완료 여부

      subSections: [],
    },
    {
      title: "3. 한 주를 기록해요",
      subSections: [],
    },
    {
      title: "4. 하루를 꾸며요",
      subSections: [],
    },
  ];
  const { courseId } = useParams();

  const [activeItem, setActiveItem] = useState(curriculumData[0]?.title);
  const activeSection = curriculumData.find(
    (section) => section.title === activeItem
  );

  return (
        <div style={{ display: "flex", marginTop: "1rem" }}>
          <CurriculumSidebar
            sections={curriculumData}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            routes={{}}
          />
          <main
            style={{
              flex: 1,
              padding: "2rem",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <h1
                style={{
                  fontSize: "2.3rem",
                  fontWeight: "bold",
                  color: "var(--main-color)",
                  margin: "0",
                  marginBottom: "-0.2rem",
                }}
              >
                1주차 학습
              </h1>

              <p
                style={{
                  color: "#969696",
                  fontSize: "1.2rem",
                  marginLeft: "1rem",
                  fontWeight: "540",
                  margin: "0 1rem",
                }}
              >
                [1월 6일 ~ 1월 12일]
              </p>
            </div>

            <Section
              style={{
                backgroundColor: "var(--pink-color)",
                padding: "0.15rem 1.5rem",
              }}
            >
              <h1 style={{ fontSize: "1.6rem", fontWeight: "bolder" }}>
                {activeSection.title}
              </h1>
              <SectionIcon
                src={
                  !activeSection.selected
                    ? UnselectedSection
                    : activeSection.done
                    ? DoneSection
                    : SelectedSection
                }
                style={{
                  marginLeft: "auto",
                  marginRight: "1.35rem",
                  width: "1.8rem",
                }}
              />
            </Section>

            {activeSection.subSections.map((subSection, subIndex) => (
              <div key={subIndex}>
                <div>
                  <Section style={{ display: "flex" }}>
                    <VideoContainer>
                      <VideoThumbnail
                        src={subSection.thumbnail || ClassThumbnail}
                      />
                      <Icon
                        src={PlayIcon}
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "1.8rem",
                          height: "auto",
                          cursor: "pointer",
                        }}
                      />
                    </VideoContainer>
                    <div
                      style={{
                        marginLeft: "2rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                      }}
                    >
                      <CurriculumTitle>{subSection.title}</CurriculumTitle>
                      <p
                        style={{
                          fontSize: "1.08rem",
                          color: "#909090",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span>{subSection.author}</span>
                        <span
                          style={{
                            borderLeft: "1.5px solid #909090",
                            height: "1rem",
                          }}
                        ></span>
                        <span>{subSection.period}</span>
                      </p>
                    </div>
                    <img
                      src={subSection.done ? DoneIcon : UndoneIcon}
                      style={{
                        marginLeft: "auto",
                        marginRight: "1.6rem",
                        width: "1.2rem",
                      }}
                    />
                  </Section>

                  <Section
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <img
                      src={Material}
                      style={{
                        width: "2.4rem",
                        height: "50%",
                        marginLeft: "1rem",
                        marginRight: "1rem",
                      }}
                    />
                    <MaterialSection>
                      <span style={{ marginRight: "0.6rem" }}>
                        {subSection.material.name}
                      </span>
                      <span
                        style={{
                          color: "var(--main-color)",
                          fontSize: "0.9rem",
                        }}
                      >
                        {subSection.material.size}
                      </span>
                      <img
                        src={
                          subSection.material.downloaded ? DoneIcon : UndoneIcon
                        }
                        alt="download status"
                        style={{ marginLeft: "auto", width: "1.2rem" }}
                      />
                    </MaterialSection>
                  </Section>

                  <Section
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "2rem",
                    }}
                  >
                    <img
                      src={Assignment}
                      alt="assignment icon"
                      style={{
                        width: "2.4rem",
                        height: "50%",
                        marginLeft: "1rem",
                        marginRight: "1rem",
                      }}
                    />
                    <MaterialSection>
                      <span style={{ marginRight: "0.8rem" }}>
                        {subSection.assignment.name}
                      </span>
                      <span
                        style={{
                          color: "var(--main-color)",
                        }}
                      >
                        {subSection.assignment.deadline}
                      </span>
                      <img
                        src={
                          subSection.assignment.submitted
                            ? DoneIcon
                            : UndoneIcon
                        }
                        alt="submission status"
                        style={{ marginLeft: "auto", width: "1.2rem" }}
                      />
                    </MaterialSection>
                  </Section>
                </div>
              </div>
            ))}
          </main>
      {isCreator && (
        <EditButton to={`/class/${courseId}/curriculum/edit`} edit={true} />
      )}

      {isEntryCodeModalOpen && <Modal entrycode={entrycode} onClose={() => setIsEntryCodeModalOpen(false)} />}
    </div>
  );
};

function Modal({ entrycode, onClose }) {
  return (
      <ModalBackdrop>
          <ModalWrapper>
              <Close onClick={onClose} style={{ alignSelf: 'flex-end', cursor: 'pointer' }}/>
              <ModalContent>
                  <img src={LogoSymbol} alt="LogoSymbol" width="60" height="60"/>
                  <ModalText style={{marginTop: '10px'}}>강의실이 개설되었습니다!</ModalText>
                  <ModalSmallText>내 강의실 코드</ModalSmallText>
                  <ModalText>{entrycode}</ModalText>
                  <CloseButton onClick={onClose}>수강생 초대하기</CloseButton>
              </ModalContent>
          </ModalWrapper>
      </ModalBackdrop>  
  );
}
const ModalBackdrop = styled.div`
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, 0.5);
display: flex;
align-items: center;
justify-content: center;
`;

const ModalWrapper = styled.div`
background: white;
padding: 20px;
border-radius: 20px;
text-align: center;
width: 494px;
height: 283px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: flex-start;
box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

const ModalContent = styled.div`
`

const ModalText = styled.div`
  font-size: 25px;
  font-weight: bold;
`;

const ModalSmallText = styled.div`
  font-size: 10px;
  margin-top: 20px;
`

const CloseButton = styled.button`
background: #ff4747;
color: white;
border: none;
border-radius: 10px;
padding: 10px 25px;
cursor: pointer;
font-size: 13px;
margin-top: 20px;
`;

export default Curriculum;
