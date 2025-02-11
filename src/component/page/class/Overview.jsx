import ClassTopbar from "../../ui/class/ClassTopbar";
import ClassSidebar from "../../ui/class/ClassSidebar";
import { useState } from "react";
import ClassThumbnail from "../../img/class/class_thumbnail.svg";
import TopBar from "../../ui/TopBar";
import styled from "styled-components";
import { PageLayout, Section } from "../../ui/class/ClassLayout";
import EditButton from "../../ui/class/EditButton";

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  margin-top: 3.5rem;
`;

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
              marginTop: "0.5rem"
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "0rem" }}>
              <img
                src={ClassThumbnail}
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
                bod 다이어리 1000% 활용하기
              </span>
              <IconRow style={{ marginTop: "2rem" }}>
                <span className="material-symbols-outlined">event</span>
                <span>2025년 1월 2일 시작</span>
              </IconRow>
              <IconRow>
                <span className="material-symbols-outlined">video_library</span>
                <span>4주 커리큘럼</span>
              </IconRow>
              <IconRow>
                <span className="material-symbols-outlined">person</span>
                <span>김잇다</span>
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
                <SectionTitle style={{ marginTop: "1.5rem" }}>
                  저와 함께 인생의 센스를 길러보아요
                </SectionTitle>
                <SectionContent>
                  다이어리를 잘 활용한다면 우리의 일상을 알차고 의미있게 보낼 수
                  있어요. 스티커를 붙이고, 적절하게 그날의 제목을 표시하고,
                  납비를 기록하기도 하고, 해야할 일을 정리하기도 하는 소중한
                  다이어리! 저와 함께 나만의 다이어리 한 권 꼭 채우기에
                  도전해보아요.
                </SectionContent>

                <SectionTitle>내 삶이 녹아있는 다이어리 활용법</SectionTitle>
                <SectionContent>
                  잘 쓴 다이어리 한 권에는 나의 삶이 가득 녹아있어요. 매년 한
                  권씩 다이어리를 완성해 간직해보세요. 시간이 흘러도 언제든
                  열어볼 수 있는 내 삶의 자서전이 될 거예요. 글씨가 예쁘지
                  않아도 괜찮아요. 내 손으로 직접 쓰고, 기록했다는 그 자체만으로
                  충분히 소중하고 가치 있으니까요.
                </SectionContent>

                <SectionTitle>프로그램 소개</SectionTitle>
                <SectionContent>
                  <ul>
                    <li>
                      루틴: 11/4(월) ~ 1/27(월) 매일 bod 다이어리 작성하기
                    </li>
                    <li>
                      인증: 온라인 줌 참여 화면 또는 오늘 작성한 bod 다이어리
                      사진과 소감을 남겨주세요.
                    </li>
                    <li>
                      경험치: 인증으로 얻는 경험치인 페이지를 쌓을 수 있고,
                      페이지를 쌓으면 레벨을 올릴 수 있습니다.
                    </li>
                  </ul>
                </SectionContent>

                <SectionTitle>참여 방법</SectionTitle>
                <SectionContent>
                  <ul>
                    <li>
                      루틴 참여: 11/4(월) ~ 1/27(월) 매일 bod 다이어리 작성하기
                    </li>
                    <li>
                      미션 채팅 참여: 채팅방에 참여해서 다른 루틴 참여자와
                      경험을 공유하세요.
                    </li>
                    <li>
                      미션 인증: 온라인 줌 참여 화면 또는 오늘 작성한 bod
                      다이어리 사진과 소감을 남겨주세요.
                    </li>
                    <li>
                      경험치 획득: 각 인증으로 페이지(경험치)를 획득합니다.
                    </li>
                    <li>후기 작성: 루틴 종료 후 후기 작성</li>
                    <li>레벨 업: 페이지를 모아 레벨을 올립니다.</li>
                  </ul>
                </SectionContent>
              </Section>
            </Content>
          </main>
        </div>
      </PageLayout>
      <EditButton to="/overview/notice/create" edit={true} />{" "}
      {/* 강의실 개요 수정창 링크로 수정 필요요 */}
    </div>
  );
};

export default ClassOverview;
