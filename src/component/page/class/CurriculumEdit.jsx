import { useState } from "react";
import styled from "styled-components";
import TopBar from "../../ui/TopBar";
import CurriculumSidebar from "../../ui/class/CurriculumSidebar";
import ClassTopbar from "../../ui/class/ClassTopbar";
import { PageLayout } from "../../ui/class/ClassLayout";
import ClassThumbnail from "../../img/class/class_thumbnail.svg";
import Assignment from "../../img/icon/docs.svg";
import Material from "../../img/icon/pdf.svg";
import PlayIcon from "../../img/class/play_icon.svg";
import EditContainer from "../../ui/class/EditContainer";
import EditButton from "../../ui/class/EditButton";


const Section = styled.div`
  display: flex;
  padding: 1.3rem 1.5rem;
  border-radius: 12px;
  margin: 1rem 0rem;
  background-color: #ffffff;
  cursor: pointer;
  position: relative;
`;

const CurriculumTitle = styled.h3`
  font-size: 1.63rem;
  font-weight: 900;
  margin-bottom: -0.3rem;
  margin-top: 0.5rem;
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


const Curriculum = () => {
  const curriculumData = [
    {
      title: "1. 기초를 준비해요",
      selected: true,
      done: false,
      subSections: [
        {
          title: "1. 꾸미고 싶은 타입을 정해서 다이어리를 골라봅시다",
          done: true,
          thumbnail: null,
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

  const [activeItem, setActiveItem] = useState(curriculumData[0]?.title);
  const [editTarget, setEditTarget] = useState(null);

  const activeSection = curriculumData.find(
    (section) => section.title === activeItem
  );

  const handleSectionClick = (index, type) => {
    setEditTarget((prev) =>
      prev && prev.index === index && prev.type === type
        ? null
        : { index, type }
    );
  };

  const handleIconClick = (action) => {
    console.log(`Icon clicked: ${action}`);
  };

  return (
    <div>
      <TopBar />
      <PageLayout>
        <ClassTopbar activeTab="curriculum" />
        <div style={{ display: "flex", marginTop: "1rem" }}>
          <CurriculumSidebar
            sections={curriculumData}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            edit={true}
          />
          <main
            style={{
              flex: 1,
              padding: "2rem",
              borderRadius: "8px",
            }}
          >
            <Section
              style={{
                display: "flex",
                alignItems: "flex-end",
                backgroundColor: "var(--main-color)",
                padding: "1rem 1.5rem",
              }}
            >
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "900",
                  color: "var(--white-color)",
                  margin: "0",
                }}
              >
                1주차 학습
              </h1>

              <p
                style={{
                  color: "var(--white-color)",
                  fontSize: "1.2rem",
                  marginLeft: "1rem",
                  fontWeight: "540",
                  margin: "0.2rem 1rem",
                }}
              >
                [학습기간 설정하기]
              </p>
            </Section>

            <Section
              style={{
                backgroundColor: "var(--grey-color)",
                padding: "0.15rem 1.5rem",
              }}
            >
              <h1
                style={{
                  fontSize: "1.555rem",
                  fontWeight: "bolder",
                  letterSpacing: "-1px",
                }}
              >
                {activeSection.title}
              </h1>
            </Section>

            {activeSection.subSections.map((subSection, index) => (
              <div key={index}>
                <div>
                  <Section onClick={() => handleSectionClick(index, "title")}>
                    {editTarget?.index === index &&
                      editTarget?.type === "title" && (
                        <EditContainer onIconClick={handleIconClick} />
                      )}
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
                      <CurriculumTitle style={{ letterSpacing: "-1px" }}>
                        {subSection.title}
                      </CurriculumTitle>
                      <p
                        style={{
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
                  </Section>

                  {/* 자료 */}
                  <Section
                    onClick={() => handleSectionClick(index, "material")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    {editTarget?.index === index &&
                      editTarget?.type === "material" && (
                        <EditContainer onIconClick={handleIconClick} />
                      )}
                    <img
                      src={Material}
                      style={{
                        width: "2.4rem",
                        height: "50%",
                        marginLeft: "1rem",
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
                    </MaterialSection>
                  </Section>

                  {/* 과제 */}
                  <Section
                    onClick={() => handleSectionClick(index, "assignment")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "2rem",
                    }}
                  >
                    {editTarget?.index === index &&
                      editTarget?.type === "assignment" && (
                        <EditContainer onIconClick={handleIconClick} />
                      )}
                    <img
                      src={Assignment}
                      alt="assignment icon"
                      style={{
                        width: "2.4rem",
                        height: "50%",
                        marginLeft: "1rem",
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
                    </MaterialSection>
                  </Section>
                </div>
              </div>
            ))}
          </main>
        </div>
      </PageLayout>
      <EditButton to="/curriculum" edit={false} />
    </div>
  );
};

export default Curriculum;
