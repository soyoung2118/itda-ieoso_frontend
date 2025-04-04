import { useState, useEffect, useContext } from "react";
import {
  useNavigate,
  useLocation,
  useParams,
  useOutletContext,
} from "react-router-dom";
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
import UnselectedSection from "../../img/class/check/unsel_sec.svg";
import DoneSection from "../../img/class/check/done_sec.svg";
import EditButton from "../../ui/class/EditButton";
import VideoDefaultThumbnail from "../../img/class/video_thumbnail.svg";
import Close from "@mui/icons-material/Close";
import api from "../../api/api";
import { UsersContext } from "../../contexts/usersContext";
import { getYouTubeThumbnail } from "../../ui/curriculum/EditableSection";

const CurriculmContainer = styled.main`
  flex: 1;
  padding: 3.5vh;
  border-radius: 8px;

  @media (max-width: 1024px) {
    padding: 3.25vh;
    padding-left: 1.5vh;
  }

  @media (max-width: 480px) {
    padding: 3vh 3vh;
  }
`;
const Section = styled.div`
  display: flex;
  align-items: center;
  padding: 1.3rem 1.5rem;
  border-radius: 14px;
  margin: 1.15rem 0rem;
  background-color: #ffffff;
  cursor: pointer;
  width: 98.8%;

  @media (max-width: 1024px) {
    padding: 1.35vh 1.55vh;
    width: 99%;
  }
  @media (max-width: 768px) {
    padding: 1.3vh 1.4vh;
    width: 100%;
  }
  @media (max-width: 480px) {
    margin: 2vh 0vh;
    width: 103%;
    padding: 2.5vh 3vh;
    border-radius: 6px;
  }
`;

const LectureTitle = styled.h1`
  font-size: 2.3rem;
  font-weight: 700;
  color: var(--main-color);
  margin: 0;
  margin-bottom: -0.2rem;

  @media (max-width: 1024px) {
    font-size: 30px;
  }
  @media (max-width: 768px) {
    font-size: 24.5px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
    font-weight: 650;
  }
`;

const LectureDate = styled.span`
  color: #969696;
  font-size: 23px;

  font-weight: 510;
  margin: 0 1rem;
  margin-left: 1.8vh;

  @media (max-width: 1024px) {
    font-size: 19px;
    margin-left: 1.2vh;
  }

  @media (max-width: 768px) {
    font-size: 15.5px;
    margin-left: 1vh;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    font-weight: 500;
  }
`;

const LectureDescription = styled.span`
  font-size: 1.6rem;
  font-weight: 700;

  @media (max-width: 1024px) {
    font-size: 21px;
  }

  @media (max-width: 768px) {
    font-size: 16.5px;
    font-weight: 670;
  }
  @media (max-width: 480px) {
    font-size: 11.5px;
    font-weight: 600;
  }
`;

const LectureDescriptionSection = styled.div`
  display: flex;
  align-items: center;
  padding: 1.3rem 1.5rem;
  border-radius: 14px;
  margin: 1.15rem 0rem;
  cursor: pointer;
  width: 99%;
  background-color: ${({ isCompleted }) =>
    isCompleted ? "var(--pink-color)" : "var(--grey-color)"};
  padding: 2vh 2.5vh;

  @media (max-width: 1024px) {
    padding: 1vh 1.7vh;
    width: 98%;
  }

  @media (max-width: 768px) {
    width: 99%;
    border-radius: 9px;
  }

  @media (max-width: 480px) {
    width: 106%;
    padding: 1.7vh 2vh;
    margin: 2vh 0vh;
    border-radius: 7px;
  }
`;

const CurriculumTitle = styled.h3`
  font-size: 1.65rem;
  font-weight: 700;
  margin-bottom: -0.3rem;
  margin-top: 0.5rem;
  letter-spacing: -1px;

  @media (max-width: 1024px) {
    font-size: 21px;
  }

  @media (max-width: 768px) {
    font-size: 16.5px;
    margin-left: -2vh;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    padding: 0.3vh 1vh;
    font-weight: 630;
  }
`;

const VideoContainer = styled.div`
  position: relative;
  width: 22%;
  aspect-ratio: 4 / 2.6;
  border-radius: 8px;

  @media (max-width: 1024px) {
    width: 30%;
  }

  @media (max-width: 768px) {
    width: 27%;
  }
  @media (max-width: 480px) {
    width: 30%;
  }
`;

const VideoThumbnail = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;

  @media (max-width: 480px) {
    border-radius: 4.5px;
  }
`;

const MaterialSection = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--lightgrey-color);
  width: 100%;
  padding: 1.2rem 1.5rem;
  border-radius: 8px;
  font-size: 1.07rem;

  @media (max-width: 1024px) {
    padding: 1.3vh 1.5vh;
  }
  @media (max-width: 768px) {
    padding: 1.5vh;
  }
  @media (max-width: 480px) {
    border-radius: 4px;
  }
`;

const Icon = styled.img`
  width: 4.3vh;
  margin-left: 1rem;
  margin-right: 1rem;

  @media (max-width: 1024px) {
    width: 2.1vh;
    margin-left: 0.6vh;
    margin-right: 1.1vh;
  }

  @media (max-width: 768px) {
    width: 2vh;
  }

  @media (max-width: 480px) {
    width: 3vh;
    margin-right: 0.8vh;
  }
`;

const SectionIcon = styled.img`
  margin-left: auto;
  margin-right: 1.35rem;
  width: 2.7vh;

  @media (max-width: 1024px) {
    width: 2.5vh;
    margin-right: 1.3vh;
  }

  @media (max-width: 768px) {
    width: 1.9vh;
    margin-right: 1vh;
  }

  @media (max-width: 480px) {
    width: 2.5vh;
    margin-right: 1vh;
  }
`;

const VideoInformation = styled.div`
  margin-left: 2.4vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: flex-start;

  @media (max-width: 1200px) {
    margin-left: 1.8vh;
  }

  @media (max-width: 1024px) {
    margin-left: 1.5vh;
  }

  @media (max-width: 768px) {
    margin-left: 3vh;
  }
`;

const VideoDetails = styled.p`
  font-size: 17.3px;
  color: var(--black-color);
  display: flex;
  gap: 1vh;

  @media (max-width: 1200px) {
    font-size: 15px;
  }

  @media (max-width: 1024px) {
    font-size: 13.5px;
    gap: 0.5vh;
  }
  @media (max-width: 768px) {
    font-size: 11px;
    margin-left: -2vh;
  }

  @media (max-width: 480px) {
    font-size: 7px;
    margin-left: -1vh;
  }

  & > div {
    display: flex;
    align-items: center;
    gap: 1.3vh;

    @media (max-width: 1024px) {
      gap: 0.5vh;
    }

    @media (max-width: 768px) {
      gap: 0.5vh;
    }
  }
`;

const BlackLine = styled.span`
  border-left: 1.5px solid black;
  height: 1rem;

  @media (max-width: 768px) {
    border-left: 1px solid black;
    height: 1.3vh;
  }

  @media (max-width: 480px) {
    border-left: 0.5px solid black;
  }
`;

const PlayButton = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4vh;
  height: auto;
  cursor: pointer;
  z-index: 10;

  @media (max-width: 1024px) {
    width: 2.3vh;
  }
  @media (max-width: 480px) {
    width: 3vh;
  }
`;

const SectionTitle = styled.span`
  margin-right: 0.6rem;
  cursor: pointer;
  display: inline-block;
  flex-shrink: 1;
  overflow: hidden;

  @media (max-width: 1024px) {
    font-size: 15.7px;
  }
  @media (max-width: 768px) {
    font-size: 12px;
  }
  @media (max-width: 480px) {
    font-size: 8.5px;
  }
`;

const FileSize = styled.span`
  color: var(--main-color);
  font-size: 0.9rem;

  @media (max-width: 1024px) {
    font-size: 14px;
  }
  @media (max-width: 768px) {
    font-size: 10.5px;
  }
  @media (max-width: 480px) {
    font-size: 8px;
  }
`;

const AssignmentDate = styled.span`
  color: var(--main-color);
  margintop: 0.3rem;
  // whitespace: nowrap;
  flexshrink: 0;

  @media (max-width: 1024px) {
    font-size: 14.5px;
  }
  @media (max-width: 768px) {
    font-size: 10px;
  }
  @media (max-width: 480px) {
    font-size: 7px;
  }
`;

const CheckIcon = styled.img`
  margin-left: auto;
  width: 1.2rem;

  @media (max-width: 768px) {
    width: 1.5vh;
  }
  @media (max-width: 480px) {
    width: 1.8vh;
  }
`;

export const formatDate = (isoString) => {
  if (!isoString) return " ";
  const date = new Date(isoString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const sec = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${min}:${sec}`;
};

export const formatLecturePeriod = (isoString) => {
  if (!isoString) return " ";
  const date = new Date(isoString);
  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  return `${month} ${day}일`;
};

const Curriculum = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const { courseId, lectureId } = useParams();

  const { user } = useContext(UsersContext);
  const userId = user.userId;
  const { courseData } = useOutletContext();
  const [curriculumData, setCurriculumData] = useState([]);
  const [historyData, setHistoryData] = useState({
    materials: [],
    submissions: [],
  });
  const [activeLectureId, setActiveLectureId] = useState(
    Number(lectureId) || 1,
  );
  const [activeLecture, setActiveLecture] = useState(null);

  const context = useOutletContext();
  const isCreator = context?.isCreator || false;
  const [allCompleted, setAllCompleted] = useState(false);
  const [allCompletedLectures, setAllCompletedLectures] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const curriculumRes = await api.get(
          `/lectures/curriculum/${courseId}/${userId}`,
        );
        const historyRes = await api.get(
          `/lectures/history/${courseId}/${userId}`,
        );

        if (curriculumRes.data.success) {
          const { curriculumResponses, instructorName } =
            curriculumRes.data.data || {};
          const lectures = curriculumResponses || [];
          setCurriculumData(lectures);

          const defaultLecture =
            lectures.find((lec) => lec.lectureId === Number(lectureId)) ||
            lectures[0];

          setActiveLectureId(defaultLecture.lectureId);

          setActiveLecture({
            ...defaultLecture,
            instructorName,
            subSections: [
              ...(defaultLecture.videos || []).map((v) => ({
                ...v,
                title: v.videoTitle,
                id: v.contentOrderIndex,
                url: v.videoUrl,
                thumbnail: getYouTubeThumbnail(v.videoUrl),
                checked: false,
              })),
              ...(defaultLecture.materials || []).map((m) => ({
                ...m,
                title: m.originalFilename,
                id: m.contentOrderIndex,
                url: m.materialFile,
                checked: false,
              })),
              ...(defaultLecture.assignments || []).map((a) => ({
                ...a,
                title: a.assignmentTitle,
                id: a.contentOrderIndex,
                deadline: a.endDate,
                checked: false,
              })),
            ].sort(
              (a, b) => (a.contentOrderIndex || 0) - (b.contentOrderIndex || 0),
            ),
          });
        }
        if (historyRes.data.success) {
          setHistoryData(historyRes.data.data);
        }
      } catch (error) {
        console.error("커리큘럼 데이터 로딩 오류:", error);
      }
    }
    fetchData();
  }, [courseId, userId, lectureId]);

  useEffect(() => {
    if (!activeLecture || !historyData) return;

    const updatedSubSections = activeLecture.subSections.map((sub) => {
      let isChecked = false;

      if (sub.contentType === "material") {
        const materialHistory = historyData.materials.find(
          (m) => m.materialId === sub.materialId,
        );
        isChecked = materialHistory?.materialHistoryStatus || false;
      } else if (sub.contentType === "assignment") {
        const assignmentHistory = historyData.submissions.find(
          (a) => a.assignmentId === sub.assignmentId,
        );
        isChecked =
          assignmentHistory?.submissionStatus === "SUBMITTED" ||
          assignmentHistory?.submissionStatus === "LATE";
      }

      return { ...sub, checked: isChecked };
    });

    if (
      JSON.stringify(activeLecture.subSections) !==
      JSON.stringify(updatedSubSections)
    ) {
      setActiveLecture((prev) => ({
        ...prev,
        subSections: updatedSubSections,
      }));
    }
  }, [historyData]);

  // 과제 제출 및 자료 다운 여부
  useEffect(() => {
    if (!curriculumData || !historyData) return;

    const completedStatus = {};

    curriculumData.forEach((lecture) => {
      const lectureMaterials = lecture.materials || [];
      const lectureAssignments = lecture.assignments || [];

      const allMaterialsCompleted = lectureMaterials.every((material) =>
        historyData.materials.some(
          (history) =>
            history.materialId === material.materialId &&
            history.materialHistoryStatus,
        ),
      );

      const allAssignmentsSubmitted = lectureAssignments.every((assignment) =>
        historyData.submissions.some(
          (history) =>
            history.assignmentId === assignment.assignmentId &&
            (history.submissionStatus === "SUBMITTED" ||
              history.submissionStatus === "LATE"),
        ),
      );

      completedStatus[lecture.lectureId] =
        allMaterialsCompleted && allAssignmentsSubmitted;
    });

    setAllCompletedLectures(completedStatus);
  }, [curriculumData, historyData]);

  const handleSectionClick = (sub) => {
    const now = new Date();
    const startDate = new Date(sub.startDate);
    const endDate = new Date(sub.endDate);

    if (sub.contentType === "video") {
      if (
        now.getTime() < startDate.getTime() ||
        now.getTime() > endDate.getTime()
      ) {
        alert(
          `이 콘텐츠는 ${startDate.toLocaleString()} ~ ${endDate.toLocaleString()}까지만 접근 가능합니다.`,
        );
        return;
      }

      navigate(`/class/${courseId}/playing/${activeLectureId}/${sub.videoId}`);
    } else if (sub.contentType === "assignment") {
      if (isCreator) {
        navigate(
          `/class/${courseId}/assignment/submit/${activeLectureId}/${sub.assignmentId}`,
        );
      }
      if (now.getTime() < startDate.getTime()) {
        alert(
          `이 과제는 ${startDate.toLocaleString()} 이후에 제출할 수 있습니다.`,
        );
        return;
      }
      navigate(
        `/class/${courseId}/assignment/submit/${activeLectureId}/${sub.assignmentId}`,
      );
    }
  };

  const handleMaterialClick = async (material) => {
    const now = new Date();
    const startDate = new Date(material.startDate);
    const endDate = new Date(material.endDate);

    if (
      now.getTime() < startDate.getTime() ||
      now.getTime() > endDate.getTime()
    ) {
      alert(
        `이 자료는 ${startDate.toLocaleString()} ~ ${endDate.toLocaleString()}까지만 다운로드 가능합니다.`,
      );
      return;
    }

    try {
      const response = await api.get("/materials/download", {
        params: {
          fileUrl: material.materialFile,
          materialId: material.materialId,
        },
      });

      const presignedUrl = response.data.data;
      const fileResponse = await fetch(presignedUrl);
      const arrayBuffer = await fileResponse.arrayBuffer();

      const fileExtension = material.originalFilename
        .split(".")
        .pop()
        .toLowerCase();
      let mimeType = "application/octet-stream";

      if (fileExtension === "pdf") {
        mimeType = "application/pdf";
      } else if (fileExtension === "txt") {
        mimeType = "text/plain";
      } else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
        mimeType = `image/${fileExtension}`;
      } else if (fileExtension === "zip") {
        mimeType = "application/zip";
      }

      const blob = new Blob([arrayBuffer], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = material.originalFilename;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("파일 처리 중 오류:", error);
    }
  };

  // 학생들에게 보일 섹션 / 교육자에게 보일 섹션 필터
  const filteredSubSections = isCreator
    ? activeLecture?.subSections
    : activeLecture?.subSections.filter((sub) =>
        Object.values(sub).every((value) => value !== null),
      );

  const truncatedText = (text) => {
    if (!text) return "";

    const width = window.innerWidth;

    let maxLength = 10;
    if (width >= 1024) maxLength = 11;
    else if (width >= 768) maxLength = 11;
    else if (width >= 480) maxLength = 9;

    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const materialTruncatedText = (text) => {
    if (!text) return "";

    const width = window.innerWidth;

    let maxLength = 10;
    if (width >= 1024) maxLength = 30;
    else if (width >= 768) maxLength = 20;
    else if (width >= 480) maxLength = 15;

    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div style={{ display: "flex" }}>
      <CurriculumSidebar
        sections={curriculumData}
        activeItem={activeLectureId}
        setActiveItem={setActiveLectureId}
        edit={false}
        completedLectures={allCompletedLectures}
      />
      <CurriculmContainer>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <LectureTitle>{activeLecture?.lectureTitle}</LectureTitle>

          <LectureDate>
            [{formatLecturePeriod(activeLecture?.startDate)} ~{" "}
            {formatLecturePeriod(activeLecture?.endDate)}]
          </LectureDate>
        </div>

        <LectureDescriptionSection>
          <LectureDescription>
            {activeLecture?.lectureDescription}
          </LectureDescription>
          {!isCreator && (
            <SectionIcon
              src={
                allCompletedLectures[activeLectureId]
                  ? DoneSection
                  : UnselectedSection
              }
            />
          )}
        </LectureDescriptionSection>

        {filteredSubSections?.map((sub) => (
          <div key={sub.id}>
            <div>
              {sub.contentType === "video" && (
                <Section onClick={() => handleSectionClick(sub)}>
                  <VideoContainer>
                    {sub.thumbnail ? (
                      <div>
                        <VideoThumbnail
                          src={sub.thumbnail}
                          alt="YouTube 썸네일"
                        />
                        <PlayButton src={PlayIcon} />
                      </div>
                    ) : (
                      <VideoThumbnail
                        src={VideoDefaultThumbnail}
                        alt="YouTube 썸네일"
                      />
                    )}
                  </VideoContainer>
                  <VideoInformation>
                    <CurriculumTitle>{sub.title}</CurriculumTitle>
                    <VideoDetails>
                      <div style={{ whiteSpace: "nowrap" }}>
                        <span>{activeLecture.instructorName}</span>
                        <BlackLine />
                      </div>

                      <span>
                        {formatDate(sub?.startDate)} ~{" "}
                        {formatDate(sub?.endDate)}
                      </span>
                    </VideoDetails>
                  </VideoInformation>
                </Section>
              )}

              {sub.contentType === "material" && (
                <Section
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <Icon src={Material} />
                  <MaterialSection>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "0.5vh",
                      }}
                    >
                      <SectionTitle onClick={() => handleMaterialClick(sub)}>
                        {materialTruncatedText(sub.title)}
                      </SectionTitle>
                      <FileSize>{sub.fileSize || ""}</FileSize>
                    </div>

                    {!isCreator && (
                      <CheckIcon
                        src={sub.checked ? DoneIcon : UndoneIcon}
                        alt="download status"
                      />
                    )}
                  </MaterialSection>
                </Section>
              )}

              {sub.contentType === "assignment" && (
                <Section
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                  onClick={() => handleSectionClick(sub)}
                >
                  <Icon src={Assignment} alt="assignment icon" />
                  <MaterialSection
                    style={{
                      flexWrap: "wrap",
                    }}
                  >
                    <SectionTitle>
                      {truncatedText(sub.title || "과제 없음")}
                    </SectionTitle>
                    <AssignmentDate>
                      {formatDate(sub?.startDate)} ~ {formatDate(sub?.endDate)}
                    </AssignmentDate>
                    {!isCreator && (
                      <CheckIcon
                        src={sub.checked ? DoneIcon : UndoneIcon}
                        alt="submission status"
                      />
                    )}
                  </MaterialSection>
                </Section>
              )}
            </div>
          </div>
        ))}
      </CurriculmContainer>
      {isCreator && (
        <EditButton
          to={`/class/${courseId}/curriculum/${activeLectureId}/edit`}
          edit={true}
        />
      )}
    </div>
  );
};

export default Curriculum;
