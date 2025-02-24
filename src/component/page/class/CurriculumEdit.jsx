import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import TopBar from "../../ui/TopBar";
import CurriculumSidebar from "../../ui/class/CurriculumSidebar";
import ClassTopbar from "../../ui/class/ClassTopbar";
import { PageLayout } from "../../ui/class/ClassLayout";
import EditableSection from "../../ui/curriculum/EditableSection";
import CurriculumSection from "../../ui/curriculum/CurriculumSection";
import api from "../../api/api";
import EditContainer from "../../ui/curriculum/EditContainer";
import { UsersContext } from "../../contexts/usersContext";
import { formatLecturePeriod } from "./Curriculum";
import EditButton from "../../ui/class/EditButton";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Description } from "@mui/icons-material";

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

export const toLocalDateTime = (isoString) => {
  if (!isoString) return null;
  return isoString.replace("T", " ") + ":00"; // "2025-02-22 11:00:00" 형태로 변환
};

const CurriculumEdit = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UsersContext);
  const userId = user.userId;
  const [curriculumData, setCurriculumData] = useState([]);
  const [activeLectureId, setActiveLectureId] = useState(lectureId);
  const [activeLecture, setActiveLecture] = useState(null);
  const [subSections, setSubSections] = useState(
    activeLecture?.subSections || []
  );
  const [editTarget, setEditTarget] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [lectureDescription, setLectureDescription] = useState(
    activeLecture?.lectureDescription || ""
  );

  // 데이터 받아와서 초기화
  useEffect(() => {
    if (!userId) return;

    const fetchCurriculum = async () => {
      try {
        const response = await api.get(
          `/lectures/curriculum/${courseId}/${userId}`
        );

        if (!response.data || !response.data.success) {
          console.error("API 요청 실패:", response.data);
          return;
        }

        const lectures = response.data.data || []; // 데이터 없을 경우 빈 배열로 처리
        setCurriculumData(lectures);

        console.log("[DEBUG] curriculumData:", lectures);

        const defaultLecture =
          lectures.find((lec) => lec.lectureId === parseInt(lectureId)) ||
          lectures[0];

        const sortedSubSections = [
          ...(defaultLecture.videos || []).map((v) => ({
            ...v,
            title: v.videoTitle,
            isEditing: false,
          })),
          ...(defaultLecture.materials || []).map((m) => ({
            ...m,
            title: m.originalFilename,
            isEditing: false,
          })),
          ...(defaultLecture.assignments || []).map((a) => ({
            ...a,
            title: a.assignmentTitle,
            isEditing: false,
          })),
        ].sort(
          (a, b) => (a.contentOrderIndex || 0) - (b.contentOrderIndex || 0)
        );

        console.log("After", defaultLecture);
        setActiveLecture({ ...defaultLecture, subSections: sortedSubSections });
        setSubSections(sortedSubSections);
        setActiveLectureId(defaultLecture.lectureId);
      } catch (error) {
        console.error("커리큘럼 불러오기 실패:", error);
      }
    };

    fetchCurriculum();
  }, [courseId, userId, lectureId]);

  // 챕터 설명 수정정
  const handleDescriptionClick = () => {
    setIsEditingDescription(true);
  };

  // 섹션 순서 수정 관련 함수
  const handleDragUpdate = (update) => {
    setIsDragging(true);
    if (!update.destination) return;

    const tempSubSections = Array.from(subSections);
    const [movedItem] = tempSubSections.splice(update.source.index, 1);
    tempSubSections.splice(update.destination.index, 0, movedItem);

    setSubSections(tempSubSections);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const movedItem = subSections[sourceIndex];
    const targetItem = subSections[destinationIndex];

    if (!movedItem || !targetItem) return;

    const contentOrderId = movedItem.contentOrderId;
    const targetContentOrderId = targetItem.contentOrderId;

    try {
      await api.put(`/contentorders/${courseId}/${activeLectureId}/reorder`, {
        contentOrderId,
        targetContentOrderId,
      });

      setIsDragging(false);

      setTimeout(() => {
        setIsDragging(false);
        location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
      setIsDragging(false);
    }
  };

  // 섹션 추가
  const handleAdd = async (type) => {
    if (!activeLecture) return;

    try {
      let url = "";

      if (type === "video") {
        url = `/videos/${courseId}/${activeLectureId}/${userId}`;
      } else if (type === "material") {
        url = `/materials/${courseId}/${activeLectureId}/${userId}`;
      } else if (type === "assignment") {
        url = `/assignments/${courseId}/${activeLectureId}/${userId}`;
      }

      await api.post(url);
      location.reload();
    } catch (error) {
      console.error("추가 실패:", error);
    }
  };

  // 섹션 삭제
  const handleDelete = async (event, index) => {
    if (event) event.stopPropagation();
    if (!activeLecture) return;

    const subSection = activeLecture.subSections[index];
    let url = "";

    if (subSection.contentType === "video") {
      url = `/videos/${courseId}/${subSection.videoId}/${userId}`;
    } else if (subSection.contentType === "material") {
      url = `/materials/${courseId}/${subSection.materialId}/${userId}`;
    } else if (subSection.contentType === "assignment") {
      url = `/assignments/${courseId}/${subSection.assignmentId}/${userId}`;
    }

    try {
      await api.delete(url);
      // setSubSections((prev) => prev.filter((_, i) => i !== index));
      location.reload();
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  // 섹션 클릭 -> isEditing 상태 변경 (true, false)
  const handleSectionClick = (index, event) => {
    event.stopPropagation(); // 이벤트 버블링 방지

    const excludedTags = ["INPUT", "TEXTAREA", "BUTTON", "SELECT", "LABEL"];
    if (excludedTags.includes(event.target.tagName)) {
      console.log("[DEBUG] 입력 필드 클릭 감지 → handleSectionClick 실행 안함");
      return;
    }

    if (event.target.closest(".datetime-edit")) {
      console.log(
        "[DEBUG] DateTimeEdit 내부 클릭 감지 → handleSectionClick 실행 안함"
      );
      return;
    }

    setActiveLecture((prev) => {
      if (!prev) return prev;

      const updatedSubSections = prev.subSections.map((s, i) =>
        i === index
          ? { ...s, isEditing: !s.isEditing }
          : { ...s, isEditing: false }
      );

      return { ...prev, subSections: updatedSubSections };
    });
  };

  // 섹션 외 다른 부분 클릭 시
  useEffect(() => {
    const handleClickOutside = async (event) => {
      console.log(isDragging);
      if (isDragging) return;

      if (event.target.closest(".lecture-description-edit")) {
        console.log(
          "[DEBUG] 강의 설명 클릭 감지 -> handleMainClick 실행 안 함"
        );
        return;
      }

      if (isEditingDescription) {
        console.log("[DEBUG] 강의 설명 저장 중...");

        try {
          const response = await api.patch(
            `/lectures/${courseId}/${activeLectureId}/${userId}`,
            {
              lectureTitle: activeLecture.lectureTitle,
              lectureDescription: lectureDescription, // 변경된 설명 저장
              startDate: activeLecture.startDate,
              endDate: activeLecture.endDate,
            }
          );

          if (response.data.success) {
            console.log("강의 설명 수정 성공:", response.data);
            setLectureDescription(lectureDescription);
            setIsEditingDescription(false); // 수정 완료 후 편집 종료
          } else {
            console.error("강의 설명 수정 실패:", response.data.message);
          }
        } catch (error) {
          console.error("강의 설명 수정 오류:", error);
        }
      }

      if (
        !event.target.closest(".editable-section") ||
        event.target.closest(".file-upload")
      ) {
        console.log("[DEBUG] handleMainClick 실행됨 -> isEditing=false 처리");

        setActiveLecture((prev) => {
          if (!prev) return prev;

          const updatedSubSections = prev.subSections.map((s) => ({
            ...s,
            isEditing: false,
          }));

          return { ...prev, subSections: updatedSubSections };
        });
        location.reload();
      }
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [isEditingDescription, lectureDescription]);

  return (
    <div>
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
              {formatLecturePeriod(activeLecture?.startDate)} ~{" "}
              {formatLecturePeriod(activeLecture?.endDate)}
            </p>
          </Section>
          <Section
            className="lecture-description-edit"
            style={{
              backgroundColor: "var(--grey-color)",
              padding: "0.15rem 1.5rem",
            }}
            onClick={handleDescriptionClick}
          >
            {isEditingDescription ? (
              <input
                type="text"
                value={lectureDescription}
                onChange={(e) => setLectureDescription(e.target.value)}
                autoFocus
                style={{
                  fontSize: "1.555rem",
                  fontWeight: "bolder",
                  letterSpacing: "-1px",
                  width: "100%",
                  backgroundColor: "white",
                  border: "1.5px solid var(--darkgrey-color)",
                  borderRadius: "8px",
                  outline: "none",
                  padding: "1.5vh 2vh",
                  margin: "1.5vh 0vh",
                }}
              />
            ) : (
              <h1
                style={{
                  fontSize: "1.555rem",
                  fontWeight: "bolder",
                  letterSpacing: "-1px",
                }}
              >
                {activeLecture?.lectureDescription || "설명 없음"}
              </h1>
            )}
          </Section>
          <DragDropContext
            onDragUpdate={handleDragUpdate}
            onDragEnd={handleDragEnd}
          >
            <Droppable droppableId="curriculum">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {activeLecture?.subSections.map((subSection, index) => (
                    <Draggable
                      key={String(subSection.contentOrderId)}
                      draggableId={String(subSection.contentOrderId)}
                      index={index}
                      isDragDisabled={!subSection.isEditing}
                    >
                      {(provided) => (
                        <SectionWrapper
                          key={subSection.id}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={(event) => handleSectionClick(index, event)}
                        >
                          {subSection.isEditing && (
                            <EditContainer
                              handleAdd={handleAdd}
                              index={index}
                            />
                          )}
                          {subSection.isEditing ? (
                            <EditableSection
                              subSection={subSection}
                              index={index}
                              className="editable-section"
                              handleDelete={(event) =>
                                handleDelete(event, index)
                              }
                            />
                          ) : (
                            <CurriculumSection
                              lecture={activeLecture}
                              subSection={subSection}
                              index={index}
                              editTarget={editTarget}
                              handleDelete={(event) =>
                                handleDelete(event, index)
                              }
                              handleSectionClick={handleSectionClick}
                            />
                          )}
                        </SectionWrapper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </main>
      </div>
      <EditButton
        edit={false}
        to={`/class/${courseId}/curriculum/${activeLectureId}/`}
      />
    </div>
  );
};

export default CurriculumEdit;
