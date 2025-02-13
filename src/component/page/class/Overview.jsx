import ClassTopbar from "../../ui/class/ClassTopbar";
import ClassSidebar from "../../ui/class/ClassSidebar";
import { useParams, useOutletContext } from "react-router-dom";
import ClassThumbnail from "../../img/class/class_thumbnail.svg";
import TopBar from "../../ui/TopBar";
import styled from "styled-components";
import { PageLayout, Section } from "../../ui/class/ClassLayout";
import EditButton from "../../ui/class/EditButton";

// const SectionTitle = styled.h2`
//   font-size: 1.5rem;
//   font-weight: bold;
//   margin-bottom: 1rem;
//   margin-top: 3.5rem;
// `;

const SectionContent = styled.div`
  font-size: 1.15rem;
  line-height: 1.5;
  color: var(--black-color);
  margin-bottom: 2rem;

  ul {
    margin-top: 0.5rem;
    padding-left: 1.8rem;
    list-style-type: disc;

    li {
      margin-bottom: 0.5rem;

      &::marker {
        font-size: 0.6em;
      }
    }
  }
`;

const IconRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  color: var(--darkgrey-color);

  .material-symbols-outlined {
    font-size: 1.6rem;
    vertical-align: middle;
  }

  span {
    font-size: 1.18rem;
    font-weight: 500;
  }
`;

const Content = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ClassOverview = () => {
  const context = useOutletContext();
  const courseData = context?.courseData || {};
  const isCreator = context?.isCreator || false
    ;
  const { courseId } = useParams();
  if (!courseData) {
    return <div>로딩 중...</div>; // 데이터가 로딩되지 않은 경우
  }

  return (
    <div>
      <TopBar />
      <PageLayout>
        <ClassTopbar activeTab="overview" />
        <div style={{ display: "flex", marginTop: "1rem" }}>
          <ClassSidebar style={{ marginRight: "2rem" }} />
          <main
            style={{
              flex: 1,
              backgroundColor: "#f9f9f9",
              padding: "0rem",
              borderRadius: "8px",
              marginTop: "0.5rem",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "0rem" }}>
              <img
                src={courseData.courseThumbnail || ClassThumbnail}
                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                alt="Class Thumbnail"
              />
            </div>
            <Section style={{ marginTop: "2rem" }}>
              <span
                style={{
                  fontSize: "2.2rem",
                  fontWeight: "900",
                }}
              >
                {courseData.courseTitle}
              </span>
              <IconRow style={{ marginTop: "2rem" }}>
                <span className="material-symbols-outlined">event</span>
                <span>
                  {" "}
                  {courseData.startDate
                    ? courseData.startDate
                    : "시작 날짜 미정"}
                </span>
              </IconRow>
              <IconRow>
                <span className="material-symbols-outlined">video_library</span>
                <span>
                  {courseData.durationWeeks > 0
                    ? `${courseData.durationWeeks}주 커리큘럼`
                    : "기간 미정"}
                </span>
              </IconRow>
              <IconRow>
                <span className="material-symbols-outlined">person</span>
                <span>{courseData.instructorName}</span>
              </IconRow>
            </Section>

            <h1
              style={{
                fontSize: "1.85rem",
                fontWeight: "bold",
                margin: "3rem 2rem",
                textAlign: "left",
              }}
            >
              강의 소개
            </h1>

            <Content>
              <Section style={{ padding: "1.5rem 5rem" }} n>
                <SectionContent style={{ marginTop: "1.5rem" }}>
                  {courseData.courseDescription}
                </SectionContent>
              </Section>
            </Content>
          </main>
        </div>
      </PageLayout>
      {isCreator && (
        <EditButton to={`/class/${courseId}/overview/info/edit`} edit={true} />
      )}
    </div>
  );
};

export default ClassOverview;
