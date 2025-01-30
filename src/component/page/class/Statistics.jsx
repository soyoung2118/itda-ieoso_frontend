import TopBar from "../../ui/TopBar";
import ClassTopbar from "../../ui/class/ClassTopbar";
import { useState } from "react";
import { useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import { PageLayout, Section } from "../../ui/class/ClassLayout";
import PercentRing from "../../ui/class/PercentRing";
import PercentBar from "../../ui/class/PercentBar";
import StudentProgressTable from "../../ui/class/StudentProgressTable";

const StatsContainer = styled.div`
  display: flex;
  margin-left: 2rem;
  gap: 6rem;
  width: 90%;
`;

const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  &:first-child {
    flex: 0 0 auto;
    width: auto;
  }

  &:last-child {
    flex: 1;
  }
`;

const CalendarWrapper = styled.div`
  width: 30%;

  .react-calendar {
    border: none;
    background-color: transparent;
  }

  .react-calendar__navigation {
    display: none;
  }

  .react-calendar__month-view__weekdays {
    font-size: 1.2rem;
    text-decoration: none;
    color: var(--black-color);
    text-align: center;
  }

  .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration: none;
  }

  .react-calendar__tile {
    background: transparent;
    text-align: center;
    padding: 1.5rem;
    font-size: 1.2rem; /* 날짜 크기 확대 */
    border-radius: 50%; /* 동그란 셀 */
    transition: background-color 0.3s ease, width 0.3s, height 0.3s;
    width: 40px; /* 날짜 셀 크기 */
    height: 40px; /* 날짜 셀 크기 */
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--black-color);
  }

  .react-calendar__tile--now {
    background-color: var(--main-color) !important;
    width: 50px; /* 현재 날짜 셀 크기 */
    height: 50px; /* 현재 날짜 셀 크기 */
    color: white !important;
  }

  .react-calendar__tile--now:hover {
    background-color: var(
      --main-color
    ) !important; /* 호버 시에도 동일한 배경 */
  }

  .react-calendar__tile:hover {
    background-color: rgba(0, 0, 0, 0.1); /* 일반 셀 호버 효과 */
  }

  /* 이전/다음 달 날짜 스타일 */
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #aaa; /* 회색으로 표시 */
  }
`;

const ClassStatistics = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = `${now.getFullYear()}.${
        now.getMonth() + 1
      }.${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(
        2,
        "0"
      )}`;
      const calendarTime = `${now.getFullYear()}년 ${now.getMonth() + 1}월`;

      setCurrentTime(formattedTime);
      setCurrentMonth(calendarTime);
    };

    updateTime();

    const timer = setInterval(updateTime, 60000);

    return () => clearInterval(timer);
  }, []);
  return (
    <div>
      <TopBar />
      <PageLayout>
        <ClassTopbar activeTab="stat" />
        <main
          style={{
            flex: 1,
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "900",
                color: "var(--black-color)",
              }}
            >
              전체 학습현황
            </h1>

            <p
              style={{
                color: "var(--darkgrey-color)",
                fontSize: "1.1rem",
                marginLeft: "1.3rem",
                fontWeight: "550",
                marginBottom: "0",
              }}
            >
              {currentTime} 기준
            </p>
          </div>
          <Section style={{ padding: "2rem 3rem", paddingBottom:"3rem" }}>
            <div style={{ display: "flex", gap: "2rem", marginBottom: "4rem" }}>
              <CalendarWrapper>
                <h2>{currentMonth}</h2>
                <Calendar
                  locale="ko"
                  showNavigation={false}
                  showNeighboringMonth={true}
                  formatDay={(locale, date) => date.getDate()}
                />
              </CalendarWrapper>

              <StatsContainer>
                <StatBox>
                  <h2>전체 과제 제출 현황</h2>
                  <div
                    style={{ display: "flex", alignItems: "center", flex: "1" }}
                  >
                    <PercentRing percent={75} />
                  </div>
                </StatBox>
                <StatBox>
                  <h2>최근 과제 제출 현황</h2>
                  <div
                    style={{ display: "flex", alignItems: "center", flex: "1" }}
                  >
                    <PercentBar percent={62} />
                  </div>
                </StatBox>
              </StatsContainer>
            </div>
            <StudentProgressTable />
          </Section>
        </main>
      </PageLayout>
    </div>
  );
};

export default ClassStatistics;
