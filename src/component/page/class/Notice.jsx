import ClassSidebar from "../../ui/class/ClassSidebar";
import ClassTopbar from "../../ui/class/ClassTopbar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../../ui/TopBar";
import styled from "styled-components";
import { PageLayout, Section } from "../../ui/class/ClassLayout";
import EditButton from "../../ui/class/EditButton";
import api from "../../api/api";

const Title = styled.h1`
  font-size: 2.6rem;
  font-weight: bold;
  margin-top: 0rem;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 20rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid var(--black-color);
  border-radius: 30px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
  }
`;

const SearchIcon = styled.span`
  font-size: 1.9rem;
  color: var(--grey-color);
  cursor: pointer;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const NoticeList = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--black-color);
  padding: 1.3rem;
`;

const NoticeItemLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0rem;
`;

const NoticeItem = styled.div`
  padding: 1.5rem;
  border-bottom: 1.5px solid #cdcdcd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: var(--lightgrey-color);
  }
`;

const NoticeTitle = styled.h3`
  font-size: 1.35rem;
  font-weight: 550;
  color: var(--black-color);
  margin-bottom: 0.8rem;
`;

const NoticeMeta = styled.div`
  font-size: 0.9rem;
  color: #474747;
  display: flex;
  gap: 0.3rem;
  margin-bottom: 1.2rem;
  font-weight: semi-bold;
`;

const NoticeViews = styled.div`
  text-align: center;
  color: var(--main-color);
  font-size: 1.25rem;
  font-weight: bold;

  div {
    font-size: 0.875rem;
    color: #474747;
    margin-top: 0.25rem;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  margin: 2rem;
`;

const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  background-color: ${(props) =>
    props.active ? "var(--pink-color)" : "transparent"};
  border: none;
  cursor: pointer;
  font-size: 1.3rem;
  &:hover {
    background-color: var(--lightgrey-color);
  }
`;

const Icon = styled.span`
  font-size: 1.5rem;
  color: var(--black-color);
`;

const ClassNotice = ({}) => {
  const { courseId } = useParams();
  const [userId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [notices, setNotices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const ITEMS_PER_PAGE = 5;

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

  useEffect(() => {
    if (!courseId || userId === null) return;

    const fetchNotices = async () => {
      try {
        console.log(`공지사항 요청: courseId=${courseId}, userId=${userId}`);
        const response = await api.get(`/announcements/${courseId}/${userId}`);

        console.log("응답 데이터:", response.data);
        if (response.data.success) {
          const sortedNotices = response.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setNotices(sortedNotices);
          console.log(response.data.data);
        } else {
          console.warn(response.data.message);
        }
      } catch (error) {
        console.error( error);
      }
    };

    fetchNotices();
  }, [courseId, userId]);

  // 총 페이지 개수 계산
  const totalPages = Math.ceil(notices.length / ITEMS_PER_PAGE);

  // 현재 페이지의 공지 목록 가져오기
  const currentNotices = notices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
              padding: "2rem",
              borderRadius: "8px",
            }}
          >
            <ContentHeader>
              <Title>공지사항</Title>
              <SearchContainer>
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon
                  className="material-symbols-outlined"
                  style={{ color: "var(--black-color)", fontSize: "2.7rem" }}
                >
                  search
                </SearchIcon>
              </SearchContainer>
            </ContentHeader>

            <Section>
              <NoticeList>
                {/* 🔹 공지가 없을 때 표시할 메시지 */}
                {notices.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "var(--darkgrey-color)",
                      padding: "3rem 0",
                    }}
                  >
                    아직 등록된 공지사항이 없습니다.
                  </div>
                ) : (
                  currentNotices.map((notice) => (
                    <NoticeItem key={notice.announcementId}>
                      <NoticeItemLeft>
                        <NoticeTitle>{notice.announcementTitle}</NoticeTitle>{" "}
                        {/* ✅ title → announcementTitle */}
                        <NoticeMeta>
                          <span>{notice.instructorName}</span>{" "}
                          {/* ✅ author → instructorName */}
                          <span>|</span>
                          <span>
                            {new Date(notice.createdAt).toLocaleDateString()}
                          </span>{" "}
                          {/* ✅ date → createdAt */}
                        </NoticeMeta>
                      </NoticeItemLeft>
                      <NoticeViews>
                        {notice.viewCount} {/* ✅ views → viewCount */}
                        <div>조회수</div>
                      </NoticeViews>
                    </NoticeItem>
                  ))
                )}
              </NoticeList>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <Pagination>
                  {/* 이전 버튼 */}
                  <PageButton
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <Icon className="material-symbols-outlined">
                      arrow_back_ios
                    </Icon>
                  </PageButton>

                  {/* 현재 페이지 버튼 (1부터 totalPages까지 동적 생성) */}
                  {Array.from({ length: totalPages }, (_, index) => (
                    <PageButton
                      key={index + 1}
                      active={currentPage === index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </PageButton>
                  ))}

                  {/* 다음 버튼 */}
                  <PageButton
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <Icon className="material-symbols-outlined">
                      arrow_forward_ios
                    </Icon>
                  </PageButton>
                </Pagination>
              )}
            </Section>
          </main>
        </div>
      </PageLayout>
      <EditButton
        to={`/class/${courseId}/overview/notice/create`}
        edit={true}
      />
    </div>
  );
};

export default ClassNotice;
