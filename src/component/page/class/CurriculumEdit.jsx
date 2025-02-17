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
import api from "../../api/api";
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

const Curriculum = () => {
  const { courseId } = useParams();
  const [userId, setUserId] = useState(null);
  const [curriculumData, setCurriculumData] = useState([]);
  const [activeLectureId, setActiveLectureId] = useState(1); // ✅ 기본 선택 lectureId = 1
  const [activeLecture, setActiveLecture] = useState(null);
  // const [curriculumData, setCurriculumData] = useState(
  //   dummyData[0]?.data.map((lecture) => ({
  //     ...lecture,
  //     subSections: [
  //       ...lecture.videos.map((v) => ({ ...v, title: v.videoTitle, isEditing: false })),
  //       ...lecture.materials.map((m) => ({ ...m, title: m.materialTitle, isEditing: false })),
  //       ...lecture.assignments.map((a) => ({ ...a, title: a.assignmentTitle, isEditing: false })),
  //     ].sort((a, b) => a.id - b.id),
  //   })) || []
  // );

  // const [activeLecture, setActiveLecture] = useState(() => {
  //   const initialLecture = dummyData[0]?.data[0]; // 첫 번째 강의 선택
  //   return initialLecture
  //     ? {
  //         ...initialLecture,
  //         subSections: [
  //           ...(initialLecture.videos || []).map((v) => ({ ...v, title: v.videoTitle, isEditing: false })),
  //           ...(initialLecture.materials || []).map((m) => ({ ...m, title: m.materialTitle, isEditing: false })),
  //           ...(initialLecture.assignments || []).map((a) => ({ ...a, title: a.assignmentTitle, isEditing: false })),
  //         ].sort((a, b) => a.id - b.id),
  //       }
  //     : { subSections: [] }; // 기본값 설정
  // });

  const [editTarget, setEditTarget] = useState(null);
  const [actionQueue, setActionQueue] = useState([]);
  const [activeSection, setActiveSection] = useState(null);

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

  // 데이터 받아와서 초기화
  useEffect(() => {
    if (!userId) return;

    const fetchCurriculum = async () => {
      try {
        const response = await api.get(
          `/lectures/curriculum/${courseId}/${userId}`
        );
        if (response.data.success) {
          const lectures = response.data.data;
          setCurriculumData(lectures);

          const defaultLecture =
            lectures.find((lec) => lec.lectureId === 1) || lectures[0];
          setActiveLectureId(defaultLecture.lectureId);

          setActiveLecture({
            ...defaultLecture,
            subSections: [
              ...(defaultLecture.videos || []).map((v) => ({
                ...v,
                title: v.videoTitle,
                isEditing: false,
              })),
              ...(defaultLecture.materials || []).map((m) => ({
                ...m,
                title: m.materialTitle,
                isEditing: false,
              })),
              ...(defaultLecture.assignments || []).map((a) => ({
                ...a,
                title: a.assignmentTitle,
                isEditing: false,
              })),
            ].sort(
              (a, b) => (a.contentOrderIndex || 0) - (b.contentOrderIndex || 0)
            ), // 정렬
          });
        }
      } catch (error) {
        console.error("커리큘럼 불러오기 실패:", error);
      }
    };

    fetchCurriculum();
  }, [courseId, userId]);

  // 커리큘럼 데이터 없을 경우 초기 섹션 (video)
  // 다시 수정하기

  const handleActionQueue = (action) => {
    setActionQueue((prev) => [...prev, action]);
  };

  // 섹션 수정
  const handleSectionClick = (index) => {
    setActiveLecture((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        subSections: prev.subSections.map((s, i) => ({
          ...s,
          isEditing: i === index ? !s.isEditing : false,
        })),
      };
    });
    setEditTarget((prev) =>
      prev?.index === index
        ? null
        : { index, sectionIndex: activeLecture.lectureId }
    );
    handleActionQueue({ type: "edit", index });
  };

  // 섹션 추가
  const handleIconClick = (type, index) => {
    if (!activeLecture) return;
    const newId = activeLecture.subSections.length
      ? Math.max(...activeLecture.subSections.map((s) => s.id)) + 1
      : 1;
    const newSubSection = {
      id: newId,
      type,
      title: "새 항목",
      isEditing: true,
    };
    setActiveLecture((prev) => ({
      ...prev,
      subSections: [
        ...prev.subSections.map((s) => ({ ...s, isEditing: false })),
        newSubSection,
      ].sort((a, b) => a.id - b.id),
    }));
    setEditTarget({ index: newId - 1, sectionIndex: activeLecture.lectureId });
    setActionQueue((prev) => [
      ...prev,
      { type: "add", section: newSubSection },
    ]);
  };

  // 섹션 삭제
  const handleDelete = (index, type, id) => {
    if (!activeLecture) return;
    setActiveLecture((prev) => ({
      ...prev,
      subSections: prev.subSections
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, id: i + 1 })),
    }));
    handleActionQueue({ type: "delete", id, sectionType: type });
    // 삭제한 후 편집 상태 초기화
    setEditTarget(null);
  };

  // 저장 버튼 클릭 시 API 요청
  const handleSave = async () => {
    try {
      for (const action of actionQueue) {
        let url = "";
        let method = "PATCH";
        let data = {};

        if (action.type === "edit") {
          const subSection = activeLecture.subSections[action.index];
          if (!subSection) continue;

          // 새 데이터 구조 반영: contentOrderId, contentType
          const { contentOrderId, contentType, contentData } = subSection;

          if (contentType === "video") {
            url = `/videos/${courseId}/${contentOrderId}/${userId}`;
            data = {
              videoTitle: contentData.videoTitle,
              videoUrl: contentData.videoUrl,
              startDate: contentData.startDate,
              endDate: contentData.endDate,
            };
          } else if (contentType === "material") {
            url = `/materials/${courseId}/${contentOrderId}/${userId}`;
            method = "POST";
            data = new FormData();
            data.append("files", contentData.materialFile);
            data.append("materialTitle", contentData.materialTitle);
          } else if (contentType === "assignment") {
            url = `/assignments/${courseId}/${contentOrderId}/${userId}`;
            data = {
              assignmentTitle: contentData.assignmentTitle,
              assignmentDescription: contentData.assignmentDescription,
              startDate: contentData.startDate,
              endDate: contentData.endDate,
            };
          } else if (contentType === "lecture") {
            url = `/lectures/${courseId}/${contentOrderId}/${userId}`;
            data = {
              lectureTitle: contentData.lectureTitle,
              lectureDescription: contentData.lectureDescription,
              startDate: contentData.startDate,
              endDate: contentData.endDate,
            };
          }
        }

        // 삭제 처리
        else if (action.type === "delete") {
          if (action.sectionType === "video") {
            url = `/videos/${courseId}/${action.id}/${userId}`;
          } else if (action.sectionType === "material") {
            url = `/materials/${courseId}/${action.id}/${userId}`;
          } else if (action.sectionType === "assignment") {
            url = `/assignments/${courseId}/${action.id}/${userId}`;
          } else if (action.sectionType === "lecture") {
            url = `/lectures/${courseId}/${action.id}/${userId}`;
          }
          method = "DELETE";
        }

        // API 요청 전송
        if (url) {
          if (method === "POST") {
            await api.post(url, data, {
              headers: { "Content-Type": "multipart/form-data" },
            });
          } else if (method === "DELETE") {
            await api.delete(url);
          } else {
            await api.patch(url, data);
          }
        }
      }

      setActionQueue([]);
      alert("변경 사항이 저장되었습니다.");
    } catch (error) {
      console.error("저장 중 오류 발생:", error);
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
            activeItem={activeLectureId}
            setActiveItem={setActiveLectureId}
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
                {activeLecture?.lectureTitle ?? "제목 없음"}
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
                {activeLecture?.startDate && activeLecture?.endDate
                  ? `${activeLecture.startDate} ~ ${activeLecture.endDate}`
                  : "[학습 기간 설정하기]"}
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
                {activeLecture.lectureDescription}
              </h1>
            </Section>

            {activeLecture?.subSections.map((subSection, index) => (
              <SectionWrapper key={subSection.id}>
                {subSection.isEditing && (
                  <EditContainer onIconClick={handleIconClick} index={index} />
                )}
                {subSection.isEditing ? (
                  <EditableSection
                    subSection={subSection}
                    handleDelete={() =>
                      handleDelete(index, subSection.id, subSection.type)
                    }
                  />
                ) : (
                  <CurriculumSection
                    subSection={subSection}
                    index={index}
                    editTarget={editTarget}
                    handleSectionClick={() => handleSectionClick(index)}
                    handleDelete={() =>
                      handleDelete(index, subSection.id, subSection.type)
                    }
                  />
                )}
              </SectionWrapper>
            ))}
          </main>
        </div>
      </PageLayout>
      <EditButton
        onClick={handleSave}
        to="/class/${courseId}/curriculum"
        edit={false}
      />
    </div>
  );
};

export default Curriculum;
