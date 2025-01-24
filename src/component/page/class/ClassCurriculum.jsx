import { useState } from "react";
import styled from "styled-components";
import TopBar from "../../ui/TopBar";
import CurriculumSidebar from "../../ui/class/CurriculumSidebar";
import ClassTopbar from "../../ui/class/ClassTopbar";
import { PageLayout, Section } from "../../ui/class/ClassLayout";
import ClassThumbnail from "../../img/class/class_thumbnail.svg";
import DoneIcon from "../../img/class/done_icon.svg"; // 완료 아이콘
import UndoneIcon from "../../img/class/undone_icon.svg"; // 미완료 아이콘
import Assignment from "../../img/class/assignment_icon.svg";
import Material from "../../img/class/material_icon.svg";
import PlayIcon from "../../img/class/play_icon.svg";

const CurriculumItem = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ContentHeader = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
`;

const CurriculumHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CurriculumTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.7rem;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 30rem;
  height: auto;
  border-radius: 8px;
`;

const VideoThumbnail = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const MaterialSection = styled.div`
  background-color: var(--lightgrey-color);
  padding: 0.4rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0rem;
  font-weight: normal;

  span:nth-child(3) {
    font-size: 0.9rem;
    color: var(--main-color);
  }

  span:last-child {
    font-size: 1.3rem;
    margin-left: auto;
  }
`;

const Icon = styled.img`
  width: 1.4rem;
  height: 1.4rem;
`;

const SubmitSection = styled(MaterialSection)`
  color: black;
  span:nth-child(3) {
    font-size: 1rem;
    color: var(--main-color);
  }
`;

const Curriculum = () => {
  const curriculumData = [
    {
      title: "1. 기초를 준비해요",
      subSections: [
        {
          title: "1. 꾸미고 싶은 타입을 정해서 다이어리를 골라봅시다",
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
  const activeSection = curriculumData.find(
    (section) => section.title === activeItem
  );

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
            routes={{}}
          />
          <main
            style={{
              flex: 1,
              padding: "2rem",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "var(--main-color)",
                }}
              >
                1주차 학습
              </h1>

              <p
                style={{
                  color: "var(--midgrey-color)",
                  fontSize: "1.1rem",
                  marginLeft: "1.3rem",
                  fontWeight: "550",
                  marginBottom: "0",
                }}
              >
                [1월 6일 ~ 1월 12일]
              </p>
            </div>
            <Section style={{ padding: "0.7rem 1.6rem", margin: "3rem 0rem" }}>
              <h1 style={{ fontSize: "1.6rem", fontWeight: "bolder" }}>
                1. 기초를 준비해요.
                <Icon
                  src={DoneIcon}
                  style={{
                    width: "2rem",
                    height: "2rem",
                    float: "right",
                  }}
                />
              </h1>
            </Section>
            {activeSection?.subSections.map((subSection, index) => (
              <CurriculumItem key={index}>
                <ContentHeader>
                  <VideoContainer>
                    <VideoThumbnail
                      src={subSection.thumbnail || ClassThumbnail}
                    />
                    <Icon
                      src={PlayIcon}
                      style={{
                        position: "absolute",
                        top: "41%",
                        left: "45%",
                        width: "3.5rem",
                        height: "20%",
                        cursor: "pointer",
                      }}
                    />
                  </VideoContainer>
                  <CurriculumHeader>
                    <CurriculumTitle>{subSection.title}</CurriculumTitle>
                    <span
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        color: "var(--midgrey-color)",
                        marginTop: "0.6rem",
                      }}
                    >
                      <span>{subSection.author}</span>
                      <span>{subSection.period}</span>
                    </span>
                  </CurriculumHeader>
                </ContentHeader>

                <div>
                  <h2>강의 자료</h2>
                  <MaterialSection>
                    <Icon
                      src={Material}
                      style={{ width: "2rem", height: "50%" }}
                    />
                    <span>{subSection.material.name}</span>
                    <span>{subSection.material.size}</span>
                    <Icon
                      src={
                        subSection.material.downloaded ? DoneIcon : UndoneIcon
                      }
                      style={{
                        marginLeft: "auto",
                      }}
                    />
                  </MaterialSection>
                  <h2 style={{ marginTop: "2rem" }}>과제 제출란</h2>
                  <SubmitSection>
                    <Icon
                      src={Assignment}
                      style={{ width: "2.4rem", height: "50%" }}
                    />
                    <span>{subSection.assignment.name}</span>
                    <span>{subSection.assignment.deadline}</span>
                    <Icon
                      src={
                        subSection.assignment.submitted ? DoneIcon : UndoneIcon
                      }
                      style={{
                        marginLeft: "auto",
                      }}
                    />
                  </SubmitSection>
                </div>
              </CurriculumItem>
            ))}
          </main>
        </div>
      </PageLayout>
    </div>
  );
};

export default Curriculum;
