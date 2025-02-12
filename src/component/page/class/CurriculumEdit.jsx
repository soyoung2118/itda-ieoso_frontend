import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import TopBar from "../../ui/TopBar";
import CurriculumSidebar from "../../ui/class/CurriculumSidebar";
import ClassTopbar from "../../ui/class/ClassTopbar";
import { PageLayout } from "../../ui/class/ClassLayout";
import EditButton from "../../ui/class/EditButton";
import EditableSection from "../../ui/curriculum/EditableSection";
import CurriculumSection from "../../ui/curriculum/CurriculumSection";
// import api from "../../api/api";
// import Delete from "../../img/class/edit/delete.svg";
// import DateTimeEdit from "../../ui/curriculum/DateTimeEdit";
// import ClassThumbnail from "../../img/class/class_thumbnail.svg";
// import Assignment from "../../img/icon/docs.svg";
// import Material from "../../img/icon/pdf.svg";
// import PlayIcon from "../../img/class/play_icon.svg";
import EditContainer from "../../ui/curriculum/EditContainer";

const SectionWrapper = styled.div`
  display: flex;
  position: relative;
  width: 100%;
`;

const Section = styled.div`
  display: flex;
  padding: 1.3rem 1.5rem;
  border-radius: 12px;
  margin: 1rem 0rem;
  background-color: #ffffff;
  cursor: pointer;
  position: relative;
  ${({ isEditing }) =>
    isEditing &&
    `
    padding-bottom: 8.5rem;
  `}
`;

const Icon = styled.img`
  width: 1.4rem;
  height: 1.4rem;
`;

const DeleteButton = styled.img`
  position: absolute;
  bottom: 2.5rem;
  right: 2.5rem;
  width: 1.15rem;
  cursor: pointer;
`;

// 더미 데이터
const dummyData = [
  {
    title: "1. 기초를 준비해요",
    subSections: [
      {
        type: "video",
        title: "1. 꾸미고 싶은 타입을 정해서 다이어리를 골라봅시다.",
        videoUrl: "https://video.example.com/1",
        startDate: "2025-03-01T23:59:59",
        endDate: "2025-03-07T23:59:59",
      },
      {
        type: "video",
        title: "필기구 소개",
        videoUrl: "https://video.example.com/2",
        startDate: "2025-03-01T23:59:59",
        endDate: "2025-03-07T23:59:59",
      },
      {
        type: "material",
        title: "오늘의 다이어리",
        file: "강의자료.pdf",
      },
      {
        type: "assignment",
        title: "1/6(월) 과제 제출",
        description: "과제 설명입니다.",
        startDate: "2025-03-01T23:59:59",
        endDate: "2025-03-07T23:59:59",
      },
    ],
  },
  {
    title: "2. 한달을 기록해요",
    subSections: [
      {
        type: "video",
        title: "나만의 색연필 차트",
        videoUrl: "https://video.example.com/3",
        startDate: "2025-03-08T23:59:59",
        endDate: "2025-03-14T23:59:59",
      },
      {
        type: "material",
        title: "오늘의 다이어리",
        file: "강의자료2.pdf",
      },
      {
        type: "assignment",
        title: "과제 2",
        description: "챕터 2의 과제 설명입니다.",
        startDate: "2025-03-08T23:59:59",
        endDate: "2025-03-14T23:59:59",
      },
    ],
  },
];

const Curriculum = () => {
  const { courseId } = useParams();
  const [userId, setUserId] = useState(null);
  const [activeItem, setActiveItem] = useState(dummyData[0]?.title || "");
  const [editTarget, setEditTarget] = useState(null);
  const [curriculumData, setCurriculumData] = useState(
    dummyData.map((section) => ({
      ...section,
      subSections: section.subSections.map((subSection) => ({
        ...subSection,
        isEditing: false,
      })),
    }))
  );

  // userid 가져오기
  useEffect(() => {
    const getUserIdFromLocalStorage = () => {
      const userData = localStorage.getItem("user");
      if (!userData) return null;

      try {
        const parsedUser = JSON.parse(userData);
        return parsedUser.userId;
      } catch (error) {
        console.error("로컬 스토리지 데이터 파싱 오류:", error);
        return null;
      }
    };

    const fetchedUserId = getUserIdFromLocalStorage();
    if (fetchedUserId) {
      setUserId(fetchedUserId);
    }
  }, []);

  // 커리큘럼 데이터 없을 경우 초기 섹션 (title/video)
  useEffect(() => {
    if (curriculumData.length === 0) {
      setCurriculumData([
        { title: "1주차 학습", subSections: [], isEditing: true },
      ]);
    }
  }, [curriculumData]);

  useEffect(() => {
    if (curriculumData.length > 0 && !activeItem) {
      setActiveItem(curriculumData[0].title);
    }
  }, [curriculumData, activeItem]);

  const activeSection = curriculumData.find(
    (section) => section.title === activeItem
  ) || { title: "챕터 없음", subSections: [] };

  const handleSectionClick = (index, type) => {
    setCurriculumData((prevData) =>
      prevData.map((section) =>
        section.title === activeItem
          ? {
              ...section,
              subSections: section.subSections.map(
                (subSection, i) =>
                  i === index
                    ? { ...subSection, isEditing: !subSection.isEditing } // ✅ 클릭한 것만 토글
                    : { ...subSection, isEditing: false } // ✅ 나머지는 false
              ),
            }
          : section
      )
    );

    setEditTarget((prev) =>
      prev?.index === index && prev?.type === type ? null : { index, type }
    );

    console.log("Clicked Section:", { index, type });
    console.log(
      "Updated Curriculum Data:",
      curriculumData.map((section) =>
        section.subSections.map((s, i) => ({
          index: i,
          title: s.title,
          type: s.type,
          isEditing: s.isEditing,
        }))
      )
    );
  };

  const handleIconClick = (type, index) => {
    if (!activeSection) return;

    const newSubSection = {
      type,
      title: `${
        type === "video"
          ? "새 영상"
          : type === "material"
          ? "새 자료"
          : "새 과제"
      }`,
      isEditing: true,
    };

    setCurriculumData((prevData) =>
      prevData.map((section) =>
        section.title === activeItem
          ? {
              ...section,
              subSections: section.subSections.map((s, i) => ({
                ...s,
                isEditing: false, // ✅ 기존 섹션은 모두 편집 모드 OFF
              })),
            }
          : section
      )
    );

    setTimeout(() => {
      setCurriculumData((prevData) =>
        prevData.map((section) =>
          section.title === activeItem
            ? {
                ...section,
                subSections: [
                  ...section.subSections.slice(0, index + 1),
                  newSubSection,
                  ...section.subSections.slice(index + 1),
                ],
              }
            : section
        )
      );
    }, 0);
  };

  const handleDelete = async (index, type) => {
    const subSection = activeSection.subSections[index];
    let url = "";

    if (type === "video") {
      url = `/videos/${courseId}/${subSection.videoId}/${userId}`;
    } else if (type === "material") {
      url = `/materials/${courseId}/${subSection.materialId}/${userId}`;
    } else if (type === "assignment") {
      url = `/assignments/${courseId}/${subSection.assignmentId}/${userId}`;
    } else {
      console.error("Invalid type:", type);
      return;
    }

    try {
      const response = await fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("삭제 요청 실패");
      }

      console.log(`Section ${index} (${type}) deleted.`);
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
    }
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

            {activeSection?.subSections.map((subSection, index) => (
              <SectionWrapper key={index}>
                {subSection.isEditing && (
                  <EditContainer onIconClick={handleIconClick} index={index} />
                )}
                {subSection.isEditing ? (
                  <EditableSection
                    subSection={subSection}
                    type={subSection.type}
                    handleSave={(updatedTitle) => {
                      const updatedSections = curriculumData.map((section) =>
                        section.title === activeItem
                          ? {
                              ...section,
                              subSections: section.subSections.map((s, i) =>
                                i === index
                                  ? {
                                      ...s,
                                      title: updatedTitle,
                                      isEditing: false,
                                    }
                                  : s
                              ),
                            }
                          : section
                      );
                      setCurriculumData(updatedSections);
                    }}
                  />
                ) : (
                  <CurriculumSection
                    subSection={subSection}
                    index={index}
                    type={subSection.type}
                    editTarget={editTarget}
                    handleSectionClick={handleSectionClick}
                    handleDelete={handleDelete}
                  />
                )}
              </SectionWrapper>
            ))}
          </main>
        </div>
      </PageLayout>
      <EditButton to="/class/${courseId}/curriculum" edit={false} />
    </div>
  );
};

export default Curriculum;
